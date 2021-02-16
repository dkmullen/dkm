toggleMenu = () => {
    let classList = document.getElementById('menu').classList;
    if (classList.contains('show')) {
        classList.remove('show');
    } else {
        classList.add('show');
    }
}

const navTemplate = 
    `<div class="navbar">
        <div class="logo"><a href="./index.html">dkmullen.com</a></div>
        <div class="menu" id="menu">
            <a href="./index.html"><div class="menu-item" id="homeLink">Home</div></a>
            <a href="./about.html"><div class="menu-item" id="aboutLink">About</div></a>
            <a href="./writing.html"><div class="menu-item" id="writingLink">Writing</div></a>
            <a href="./favorite-things.html"><div class="menu-item" id="favoritesLink">Favorite Things</div></a>
        </div>
        <div class="menu-icon-wrapper">
            <img class = "menu-icon" src="assets/images/menu-white-36dp.svg" onclick="toggleMenu()"> 
        </div>
    </div>`;

loadNav = () => {
    document.getElementById('navbar-wrapper').innerHTML = navTemplate;
    let pathArray = window.location.pathname.split('/');
    switch (pathArray[pathArray.length -1]) {
        case 'index.html':
            document.getElementById('homeLink').classList.add('active');
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
    }
}