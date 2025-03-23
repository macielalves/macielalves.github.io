const search = document.getElementById("search");
search.addEventListener("keypress", function (e) {
  let teste = document.getElementById("search-result");
  if (e.key === "Enter") {
    const termoPesquisado = this.value;
    if (!termoPesquisado) return;

    const elementos = document.querySelectorAll('p, h2, h3');

    elementos.forEach(elemento => {
      const texto = elemento.textContent.toLowerCase();
      if (texto.includes(termoPesquisado.toLowerCase())) {
        elemento.style.backgroundColor = '#ff000040';
        const link = document.createElement('a');
        const itemList = document.createElement('li');
        if (elemento.id) {
          link.href = '#' + elemento.id;
          link.textContent = ' Link para esta seção';
          itemList.appendChild(link);
          teste.appendChild(itemList);
        }
      }
    });
  }
})


// document.addEventListener('DOMContentLoaded', searchContext);
