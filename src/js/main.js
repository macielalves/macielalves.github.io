import { WindowApp } from './components/WindowApp.js';
import { Calc } from './components/Calc.js';
import { SubBrowser } from './managers/SubBrowser.js';

function createWindow(name, id) {
  const app = new WindowApp(name, id);
  app.open();
  return app;
}

function pushWindowInfo() {
  const informacoesNavegador = navigator.userAgent;
  const versaoNavegador = navigator.appVersion;
  const sistemaOperacional = navigator.platform;
  const arquitetura = navigator.cpuClass;
  const idioma = navigator.language;
  const vendor = navigator.vendor;
  const cookieEnabled = navigator.cookieEnabled;
  const online = navigator.onLine;
  const infoWindow = createWindow('Informações do Navegador', 'info');
  infoWindow.setContent(`
    <h1>Informações do Navegador</h1>
    <p>Informações do Navegador: ${informacoesNavegador}</p>
    <p>Versão do Navegador: ${versaoNavegador}</p>
    <p>Sistema Operacional: ${sistemaOperacional}</p>
    <p>Arquitetura: ${arquitetura}</p>
    <p>Idioma: ${idioma}</p>
    <p>Vendor: ${vendor}</p>
    <p>Cookie Enabled: ${cookieEnabled}</p>
    <p>Online: ${online}</p>
  `);
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Criar ícones na área de trabalho
  function createDesktopIcon({
    name,
    id,
    command = null,
    src = "src/assets/images/M.png",
    alt = null
  }) {
    const icon = document.createElement('div');
    icon.classList.add('desktop-icon');
    icon.innerHTML = `
      <img src="${src}" alt="${alt || name}">
      <span>${name}</span>
    `;
    icon.addEventListener('click', () => {
      if (command) {
        command();
      } else {
        createWindow(name, id);
      }
    });
    document.querySelector('.desktop').appendChild(icon);

  }

  // Criar ícones iniciais
  createDesktopIcon({name: 'cmd', id: 'cmd', command: createCmdWindow, src: 'https://img.icons8.com/?size=100&id=gagNo02GtaUp&format=png&color=000000'});
  createDesktopIcon({name: 'calc', id: 'calc', command: createCalcWindow, src: 'https://raw.githubusercontent.com/macielalves/McCalc/main/img/icon.png'});
  createDesktopIcon({name: 'Lixeira', id: 'trash', src: 'https://img.icons8.com/?size=100&id=pre7LivdxKxJ&format=png&color=000000'});

  createDesktopIcon({
    name: 'Navegador', 
    id: 'browser',
    command: createBrowserWindow,
    src: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000'
  });
});

const createCalcWindow = () => {
  const windowApp = new WindowApp('Calculadora', 'calc', false);
  windowApp.open();
  const calc = new Calc();
  const calcWindow = calc.createCalculator();
  calc.init();
  windowApp.setSize(400, 500);
  windowApp.setContent(calcWindow);
}

const createCmdWindow = () => {
  const cmdWindow = createWindow('CMD', 'cmd');
  cmdWindow.setContent(`
    <h1>CMD</h1>
    <p>Comando do Windows</p>
    <input type="text" id="cmdInput" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off">
    <button id="cmdButton">Executar</button>
  `);
  const cmdInput = document.getElementById('cmdInput');
  const cmdButton = document.getElementById('cmdButton');
  cmdButton.addEventListener('click', () => {
    const command = cmdInput.value;
    console.log(command);
  });
}

const createBrowserWindow = () => {
  const windowApp = new WindowApp('Navegador', 'browser');
  windowApp.open();
  const browserWindow = new SubBrowser();
  const browser = browserWindow.createBrowser();
  browserWindow.navigate('https://www.youtube.com/embed/dOJY4krNdws?autoplay=1&mute=0&fs=1');
  windowApp.setContent(browser);
}
