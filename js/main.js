toggleMenu = () => {
    let classList = document.getElementById('menu').classList;
    if (classList.contains('show')) {
        classList.remove('show');
    } else {
        classList.add('show');
    }
}