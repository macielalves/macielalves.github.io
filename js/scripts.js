function max_screen(){
    const janela = document.getElementById('container_main')
    janela.classList.toggle('janela_full')
    if (janela.classList.contains('janela_min')) {
        janela.classList.toggle('janela_min')
    }
}

function close_page(){
    window.close()
}

function minimize(){
    const janela = document.getElementById('container_main')
    janela.classList.toggle('janela_min')
    if (janela.classList.contains('janela_full')) {
        janela.classList.toggle('janela_full')
    }
}
/*
*`${var}`
*
*
*
*/

// const janela = document.getElementById()

