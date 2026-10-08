import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const SITE_URL = 'https://dkmullen.com';
const WRITING_DIR = 'writing';
const OUTPUT_FILE = join(WRITING_DIR, 'rss.xml');

async function getHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getHtmlFiles(path));
    } else if (
      entry.isFile() &&
      extname(entry.name).toLowerCase() === '.html' &&
      entry.name !== 'index.html'
    ) {
      files.push(path);
    }
  }

  return files;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getArticle(html, filePath) {
  const title = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.trim();
  const tagline = html.match(
    /<p[^>]*class=["']tagline["'][^>]*>(.*?)<\/p>/is
  )?.[1]?.trim();
  const date = html.match(
    /<date[^>]*datetime=["']([^"']+)["'][^>]*>(.*?)<\/date>/is
  );

  if (!title || !date) {
    console.warn(`Skipping ${filePath}: missing title or date`);
    return null;
  }

  const clean = (text) => text.replace(/<[^>]*>/g, '').trim();

  const relativePath = relative(WRITING_DIR, filePath)
    .split('\\')
    .join('/');

  const url = `${SITE_URL}/${WRITING_DIR}/${relativePath}`;

  return {
    title: clean(title),
    description: tagline ? clean(tagline) : '',
    date: date[1],
    url,
  };
}

const files = await getHtmlFiles(WRITING_DIR);
const articles = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
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
          : ''
      }
    </item>`
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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