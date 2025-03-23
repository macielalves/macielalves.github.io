export class SubCmd {
  /**
   * @description Cria uma nova instância do terminal de comando
   */
  constructor() {
    this.cmd = document.createElement('div');
    this.cmd.classList.add('cmd');
    this.history = [];
    this.historyIndex = -1;
    this.currentInput = '';
    this.prompt = '> ';
    this.commands = {
      'clear': () => this.clear(),
      'help': () => this.showHelp(),
      'history': () => this.showHistory()
    };
  }

  /**
   * @description Cria e inicializa o terminal
   * @returns {HTMLElement} Elemento do terminal
   */
  createCmd() {
    const cmdContainer = this.cmd;
    const cmdInput = this.createCmdInput();
    const cmdOutput = this.createCmdOutput();
    
    cmdContainer.appendChild(cmdOutput);
    cmdContainer.appendChild(cmdInput);
    
    this.setupEventListeners(cmdInput);
    
    return cmdContainer;
  }

  /**
   * @description Cria o campo de entrada do terminal
   * @returns {HTMLInputElement} Campo de entrada
   */
  createCmdInput() {
    const input = document.createElement('input');
    input.classList.add('cmd-input');
    input.placeholder = this.prompt;
    input.autocomplete = 'off';
    input.spellcheck = false;
    return input;
  }

  /**
   * @description Cria a área de saída do terminal
   * @returns {HTMLElement} Área de saída
   */
  createCmdOutput() {
    const output = document.createElement('div');
    output.classList.add('cmd-output');
    return output;
  }

  /**
   * @description Configura os eventos do terminal
   * @param {HTMLInputElement} input - Campo de entrada
   */
  setupEventListeners(input) {
    input.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Enter':
          this.executeCommand(input.value);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateHistory('up', input);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.navigateHistory('down', input);
          break;
      }
    });
  }

  /**
   * @description Executa um comando
   * @param {string} command - Comando a ser executado
   */
  executeCommand(command) {
    if (!command.trim()) return;
    
    this.history.push(command);
    this.historyIndex = this.history.length;

    const cmd = command.trim().split(' ')[0];
    
    if (this.commands[cmd]) {
      this.commands[cmd]();
    } else {
      try {
        const result = eval(command);
        if (result !== undefined) {
          this.displayOutput(result.toString(), 'success');
        }
      } catch (error) {
        this.displayOutput(`Erro: ${error.message}`, 'error');
      }
    }

    this.displayOutput(command);
    this.clearInput();
  }

  /**
   * @description Navega pelo histórico de comandos
   * @param {string} direction - Direção da navegação ('up' ou 'down')
   * @param {HTMLInputElement} input - Campo de entrada
   */
  navigateHistory(direction, input) {
    if (direction === 'up' && this.historyIndex > 0) {
      this.historyIndex--;
      input.value = this.history[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex < this.history.length) {
      this.historyIndex++;
      input.value = this.history[this.historyIndex] || '';
    }
  }

  /**
   * @description Mostra a ajuda do terminal
   */
  showHelp() {
    const helpText = `
      Comandos:
      clear   - Limpa o terminal
      help    - Mostra esta ajuda
      history - Mostra o histórico de comandos
    `;
    this.displayOutput(helpText, 'success');
  }

  /**
   * @description Mostra o histórico de comandos
   */
  showHistory() {
    if (this.history.length === 0) {
      this.displayOutput('Histórico vazio', 'error');
      return;
    }
    
    const historyText = this.history.map((cmd, i) => `${i + 1}: ${cmd}`).join('\n');
    this.displayOutput(historyText, 'success');
  }

  /**
   * @description Exibe a saída no terminal
   * @param {string} text - Texto a ser exibido
   * @param {string} type - Tipo de saída ('normal', 'error', 'success')
   */
  displayOutput(text, type = 'normal') {
    const output = this.cmd.querySelector('.cmd-output');
    const line = document.createElement('div');
    line.classList.add('cmd-line');
    
    if (type === 'error') {
      line.classList.add('error');
    } else if (type === 'success') {
      line.classList.add('success');
    }

    // Formata comandos especiais
    const formattedText = this.formatCommand(text);
    line.innerHTML = `${this.prompt}${formattedText}`;
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  formatCommand(text) {
    // Exemplo de formatação de comando
    return text.replace(
      /(^\w+)(\s.*)?/,
      '<span class="command">$1</span><span class="param">$2</span>'
    );
  }

  /**
   * @description Limpa o campo de entrada
   */
  clearInput() {
    const input = this.cmd.querySelector('.cmd-input');
    input.value = '';
  }

  /**
   * @description Limpa todo o terminal
   */
  clear() {
    const output = this.cmd.querySelector('.cmd-output');
    output.innerHTML = '';
  }
}

