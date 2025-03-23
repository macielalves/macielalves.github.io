export class SubBrowser {
  constructor() {
    this.browser = null;
    this.currentUrl = '';
    this.history = [];
    this.currentHistoryIndex = -1;
  }

  createBrowser() {
    this.browser = document.createElement('div');
    this.browser.className = 'sub-browser';
    
    this.browser.innerHTML = `
      <div class="browser-toolbar">
        <div class="browser-controls">
          <button class="browser-btn back" title="Voltar">◀</button>
          <button class="browser-btn forward" title="Avançar">▶</button>
          <button class="browser-btn reload" title="Recarregar">↻</button>
        </div>
        <div class="browser-address-bar">
          <input type="text" name="url-input-browser" class="url-input" placeholder="Digite uma URL">
          <button class="browser-btn go">Ir</button>
        </div>
      </div>
      <div class="browser-content">
        <iframe id="browser-frame" 
                sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
                allowfullscreen>
        </iframe>
      </div>
    `;

    this.setupBrowserEvents(this.browser);
    return this.browser;
  }

  setupBrowserEvents(browser) {
    const urlInput = browser.querySelector('.url-input');
    const goButton = browser.querySelector('.go');
    const backButton = browser.querySelector('.back');
    const forwardButton = browser.querySelector('.forward');
    const reloadButton = browser.querySelector('.reload');
    const iframe = browser.querySelector('#browser-frame');

    // Navegar ao pressionar Enter ou clicar no botão Ir
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.navigate(urlInput.value);
      }
    });

    goButton.addEventListener('click', () => {
      this.navigate(urlInput.value);
    });

    // Botões de navegação
    backButton.addEventListener('click', () => this.goBack());
    forwardButton.addEventListener('click', () => this.goForward());
    reloadButton.addEventListener('click', () => this.reload());

    // Atualiza estado dos botões de navegação
    this.updateNavigationState();
  }

  navigate(url) {
    // // Adiciona https:// se não houver protocolo
    // if (!url.match(/^https?:\/\//i)) {
    //   url = 'https://' + url;
    // }

    try {
      const iframe = this.browser.querySelector('#browser-frame');
      iframe.src = url;
      
      // Atualiza histórico
      this.currentHistoryIndex++;
      this.history.splice(this.currentHistoryIndex);
      this.history.push(url);
      
      // Atualiza URL na barra de endereço
      this.browser.querySelector('.url-input').value = url;
      this.currentUrl = url;
      
      this.updateNavigationState();
    } catch (error) {
      console.error('Erro ao navegar:', error);
      this.showError('Não foi possível carregar a página');
    }
  }

  goBack() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      const url = this.history[this.currentHistoryIndex];
      this.navigate(url);
    }
  }

  goForward() {
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.currentHistoryIndex++;
      const url = this.history[this.currentHistoryIndex];
      this.navigate(url);
    }
  }

  reload() {
    const iframe = this.browser.querySelector('#browser-frame');
    iframe.src = iframe.src;
  }

  updateNavigationState() {
    const backButton = this.browser.querySelector('.back');
    const forwardButton = this.browser.querySelector('.forward');

    backButton.disabled = this.currentHistoryIndex <= 0;
    forwardButton.disabled = this.currentHistoryIndex >= this.history.length - 1;
  }

  showError(message) {
    const content = this.browser.querySelector('.browser-content');
    content.innerHTML = `
      <div class="browser-error">
        <h3>Erro</h3>
        <p>${message}</p>
      </div>
    `;
  }
}

