toggleMenu = () => {
  let classList = document.getElementById('menu').classList;
  if (classList.contains('show')) {
    classList.remove('show');
  } else {
    classList.add('show');
  }
};

const navTemplate = `<div class="navbar">
        <div class="logo"><a href="./index.html">dkmullen.com</a></div>
        <div class="menu" id="menu">
          <a href="./portfolio.html"><div class="menu-item" id="portfolioLink">Portfolio</div></a>
          <a href="./favorite-things.html"><div class="menu-item" id="favoritesLink">Favorite Things</div></a>
          <a href="./contact.html"><div class="menu-item" id="contactLink">Contact Me</div></a>
        </div>
        <div class="menu-icon-wrapper">
            <img class = "menu-icon" src="assets/images/menu-white-36dp.svg" width="36" height="36" alt="menu icon" onclick="toggleMenu()"> 
        </div>
    </div>`;

loadNav = () => {
  document.getElementById('navbar-wrapper').innerHTML = navTemplate;
  let pathArray = window.location.pathname.split('/');
  switch (pathArray[pathArray.length - 1]) {
    case 'portfolio.html':
      document.getElementById('portfolioLink').classList.add('active');
      break;
    case 'writing.html':
      document.getElementById('writingLink').classList.add('active');
      break;
    case 'favorite-things.html':
      document.getElementById('favoritesLink').classList.add('active');
      break;
    case 'books.html':
      document.getElementById('favoritesLink').classList.add('active');
      break;
    case 'contact.html':
      document.getElementById('contactLink').classList.add('active');
      break;
  }
};

function pressButton() {
  document.getElementById('submit-button').classList.add('pressed');
}
function releaseButton() {
  document.getElementById('submit-button').classList.remove('pressed');
}

async function submitMessage() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let message = document.getElementById('message').value;
  let errorMsg = document.querySelector('.error-sending-message').classList;
  errorMsg.remove('show');
  errorMsg.add('hide');
  const res = await axios({
    method: 'post',
    url: 'https://sdfh3459a9.execute-api.us-east-2.amazonaws.com/dev',
    headers: {
      'x-api-key': 'i0k0ucR4tW1wmajvQb4XX5GleesDI4Jk2y9l97zd',
    },
    data: {
      name,
      email,
      message,
    },
  }).catch((err) => {
    console.error(err);
    errorMsg.remove('hide');
    errorMsg.add('show');
  });
  if (res) {
    if (res.status === 200) {
      let msg = document.getElementById('message-received').classList;
      document.getElementById('contact-form').reset();
      msg.remove('hide');
      msg.add('show');
      setTimeout(() => {
        msg.remove('show');
        msg.add('hide');
      }, 7000);
    }
  }
}
document.getElementById('name').addEventListener('input', doValidate);
document.getElementById('email').addEventListener('input', doValidate);
document.getElementById('message').addEventListener('input', doValidate);

function doValidate() {
  let submitButton = document.getElementById('submit-button');
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let message = document.getElementById('message').value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (emailPattern.test(email) && name && message) {
    submitButton.disabled = false;
    submitButton.classList.remove('disabled');
  } else {
    submitButton.disabled = true;
    submitButton.classList.add('disabled');
  }
  errMsg = document.getElementById('email-error-message').classList;
  if (email && !emailPattern.test(email)) {
    errMsg.add('show');
    errMsg.remove('hide');
  } else {
    errMsg.remove('show');
    errMsg.add('hide');
  }
}
