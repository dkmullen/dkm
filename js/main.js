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
            <a href="./about.html"><div class="menu-item" id="aboutLink">About</div></a>
            <a href="./writing.html"><div class="menu-item" id="writingLink">Writing</div></a>
            <a href="./favorite-things.html"><div class="menu-item" id="favoritesLink">Favorite Things</div></a>
            <a href="./contact.html"><div class="menu-item" id="contactLink">Contact Me</div></a>
        </div>
        <div class="menu-icon-wrapper">
            <img class = "menu-icon" src="assets/images/menu-white-36dp.svg" onclick="toggleMenu()"> 
        </div>
    </div>`;

loadNav = () => {
	document.getElementById('navbar-wrapper').innerHTML = navTemplate;
	let pathArray = window.location.pathname.split('/');
	switch (pathArray[pathArray.length - 1]) {
		case 'index.html':
		// 	// document.getElementById('homeLink').classList.add('active');
			loadQuotes();
			break;
		case 'about.html':
			document.getElementById('aboutLink').classList.add('active');
			break;
		case 'writing.html':
			document.getElementById('writingLink').classList.add('active');
			break;
		case 'favorite-things.html':
			document.getElementById('favoritesLink').classList.add('active');
			break;
		case 'contact.html':
			document.getElementById('contactLink').classList.add('active');
			break;
	}
};

async function loadQuotes() {
	const res = await axios
		.get('https://w4hyvgmxbj.execute-api.us-east-2.amazonaws.com/dev')
		.catch((err) => {
			console.log(err);
		});
	if (res) {
		let target = document.getElementById('quote-wrapper-temp');
		for (let i in res.data) {
			target.innerHTML += `<div class="quote"><em>${res.data[i].quote}</em><div class="quote-source">${res.data[i].source}</div></div>`;
		}
	}
}

async function submitMessage() {
	let name = document.getElementById('name').value;
	let email = document.getElementById('email').value;
	let message = document.getElementById('message').value;
	console.log(name, email, message);
	// const res = await axios({
	// 	method: 'post',
	// 	url: 'url',
	// 	data: {
	// 		name, email, message
	// 	},
	// }).catch((err) => {
	// 	console.log(err);
	// });
	// if (res) {
	// 	document.getElementById('result').innerHTML = res.data;
	// }
}
