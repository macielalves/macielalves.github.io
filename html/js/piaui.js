window.addEventListener('scroll', function () {
    let header = document.getElementById('titulo');

    if (window.scrollY > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
        // window.alert(window.scrollY)
    }
    document.getElementById('scroll_marker').textContent = window.scrollY;
});

window.addEventListener('onkeydown', function () {
});
