function max_screen() {
    const janela = document.getElementById('container_main');
    janela.classList.toggle('janela_full')
    if (janela.classList.contains('janela_min')) {
        janela.classList.toggle('janela_min')
    }
}

function close_page() {
    window.close()
}

function minimize() {
    const janela = document.getElementById('container_main')
    janela.classList.toggle('janela_min')
    if (janela.classList.contains('janela_full')) {
        janela.classList.toggle('janela_full')
    }
}



// Quantidade de tabs na tela
// const tabs = 10;

// const container = document.querySelector(".container");

// console.log(Math.random(1));
// function randomPosition() {

// }

// function createMydiv () {
//   container.innerHTML += (
//     '\n<div class="mydiv">\n'+
//       '<div><span>Top bar</span> <button class="btn-close">X</button></div>\n'+
//       "<h1>Span</h1>"+
//       "</div>");
// }

// for(let i=0; i< tabs; i++){
//   createMydiv();
// }


//Make the DIV element draggagle:
const mydivs = document.querySelectorAll("div#container_main");

const mdiv = { code: 0 };

mydivs.forEach(elmnt => {
    const styles = elmnt.style;
    const code = mdiv.code += 1;
    elmnt.classList.add(`item-${code}`);
    elmnt.childNodes[1].classList.add(`item-${code}-header`);
    dragElement(elmnt, code);
})


function dragElement(elmnt, code) {
    const subElmnt = document.querySelector(`.item-${code}-header`);

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (subElmnt) {
        /* if present, the header is where you move the DIV from:*/
        subElmnt.onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function rmChild(e) {
        container.removeChild(e);
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        let max_x = document.body.clientWidth;
        const min_x = 0;
        let max_y = document.body.clientHeight;
        const min_y = 0;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

