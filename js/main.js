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
        <div class="logo">dkmullen.com</div>
        <div class="menu" id="menu">
            <div class="menu-item">About</div>
            <div class="menu-item">Writing</div>
            <div class="menu-item">Favorite Things</div>
        </div>
        <div class="menu-icon-wrapper">
            <img class = "menu-icon" src="assets/images/menu-white-36dp.svg" onclick="toggleMenu()"> 
        </div>
    </div>`;

loadNav = () => {
    document.getElementById('navbar-wrapper').innerHTML = navTemplate;
}