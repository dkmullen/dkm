import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";

const SITE_URL = "https://dkmullen.com";
const WRITING_DIR = "writing";
const OUTPUT_FILE = join(WRITING_DIR, "rss.xml");

async function getHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getHtmlFiles(path)));
    } else if (
      entry.isFile() &&
      extname(entry.name).toLowerCase() === ".html" &&
      entry.name !== "index.html"
    ) {
      files.push(path);
    }
  }

  return files;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function makeUrlsAbsolute(html, articleUrl) {
  const baseUrl = new URL(articleUrl);

  return (
    html
      .replace(
        /(<a\b[^>]*\bhref=["'])([^"']+)(["'])/gi,
        (match, prefix, url, suffix) => {
          if (
            url.startsWith("#") ||
            url.startsWith("mailto:") ||
            url.startsWith("tel:") ||
            /^[a-z][a-z\d+\-.]*:/i.test(url)
          ) {
            return match;
          }

          return `${prefix}${new URL(url, baseUrl).href}${suffix}`;
        },
      )
      .replace(
        /(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi,
        (match, prefix, url, suffix) => {
          if (url.startsWith("data:") || /^[a-z][a-z\d+\-.]*:/i.test(url)) {
            return match;
          }

          return `${prefix}${new URL(url, baseUrl).href}${suffix}`;
        },
      )
      // Remove target="_blank" (or any other target value)
      .replace(/\s+target\s*=\s*(["'])[^"']*\1/gi, "")
      // Remove rel attributes from links
      .replace(/\s+rel\s*=\s*(["'])[^"']*\1/gi, "")
  );
}


function getArticle(html, filePath) {
  const title = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.trim();

  const tagline = html
    .match(
      /<p[^>]*class=["'][^"']*\btagline\b[^"']*["'][^>]*>(.*?)<\/p>/is,
    )?.[1]
    ?.trim();

  const date = html.match(
    /<date[^>]*datetime=["']([^"']+)["'][^>]*>(.*?)<\/date>/is,
  );

  const articleMatch = html.match(
    /<article[^>]*class=["'][^"']*\barticle-wrapper\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/i,
  );

  if (!title || !date || !articleMatch) {
    console.warn(
      `Skipping ${filePath}: missing title, date, or article content`,
    );
    return null;
  }

  const clean = (text) => text.replace(/<[^>]*>/g, "").trim();

  const relativePath = relative(WRITING_DIR, filePath).split("\\").join("/");

  const url = `${SITE_URL}/${WRITING_DIR}/${relativePath}`;

  return {
    title: clean(title),
    description: tagline ? clean(tagline) : "",
    date: date[1],
    url,
    content: makeUrlsAbsolute(articleMatch[1].trim(), url),
  };
}

const files = await getHtmlFiles(WRITING_DIR);
const articles = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const article = getArticle(html, file);

  if (article) {
    articles.push(article);
  }
}

articles.sort((a, b) => new Date(b.date) - new Date(a.date));

const items = articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.url)}</link>
      <guid>${escapeXml(article.url)}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      ${
        article.description
          ? `<description>${escapeXml(article.description)}</description>`
          : ""
      }
      <content:encoded><![CDATA[
${article.content}
      ]]></content:encoded>
    </item>`,
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Dennis Mullen - Writing</title>
    <link>${SITE_URL}/writing/</link>
    <description>Articles by Dennis Mullen</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

await writeFile(OUTPUT_FILE, rss);

console.log(`Generated ${OUTPUT_FILE} with ${articles.length} articles.`);
