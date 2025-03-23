const cor_fundo = document.body;
function bg_dark () {
    cor_fundo.classList.toggle('modo-dark');
}

const audio = document.getElementById('dj');
const vigia = document.getElementById('vigia');
vigia.addEventListener('change', function(){
    if (vigia.checked){
        audio.play();
    } else {
        audio.pause();
    }
});


