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
            <a href="./about.html"><div class="menu-item">About</div></a>
            <a href="./writing.html"><div class="menu-item">Writing</div></a>
            <a href="./favorite-things.html"><div class="menu-item">Favorite Things</div></a>
        </div>
        <div class="menu-icon-wrapper">
            <img class = "menu-icon" src="assets/images/menu-white-36dp.svg" onclick="toggleMenu()"> 
        </div>
    </div>`;

loadNav = () => {
    document.getElementById('navbar-wrapper').innerHTML = navTemplate;
}