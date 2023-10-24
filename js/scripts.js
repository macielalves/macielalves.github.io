function max_screen(){
    const janela = document.getElementById('container_main');
    janela.classList.toggle('janela_full')
    if (janela.classList.contains('janela_min')) {
        janela.classList.toggle('janela_min')
    }
}

function close_page(){
    window.document.close()
}

function minimize(){
    const janela = document.getElementById('container_main')
    janela.classList.toggle('janela_min')
    if (janela.classList.contains('janela_full')) {
        janela.classList.toggle('janela_full')
    }
}



function move_top_bar (event) {
    let top_bar = document.getElementById('container_main');
    
    let cX = event.clientX;
    let cY = event.clientY;

    top_bar.style.top = `calc(${cY}px)`;
    top_bar.style.left = `calc(${cX}px)`;

}
