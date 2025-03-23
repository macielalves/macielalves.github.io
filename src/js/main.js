import { WindowApp } from './components/WindowApp.js';
import { Calc } from './components/Calc.js';
import { SubBrowser } from './managers/SubBrowser.js';
import { NavBarDock, DockItem } from './components/NavBarDock.js';
import { SubCmd } from './managers/SubCmd.js';

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
  infoWindow.setIcon('https://img.icons8.com/?size=100&id=103413&format=png&color=000000');
  infoWindow.hide();
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
    desktop.appendChild(icon);
  }

  const desktop = document.querySelector('.desktop');
  const navBarDock = new NavBarDock();
  const dock = navBarDock.createDock();
  desktop.appendChild(dock);

  // Criar ícones iniciais
  createDesktopIcon({ name: 'Lixeira', id: 'trash', command: createTrashWindow, src: 'https://img.icons8.com/?size=100&id=pre7LivdxKxJ&format=png&color=000000' });
  createDesktopIcon({ name: 'cmd', id: 'cmd', command: createCmdWindow, src: 'https://img.icons8.com/?size=100&id=gagNo02GtaUp&format=png&color=000000' });
  createDesktopIcon({ name: 'calc', id: 'calc', command: createCalcWindow, src: 'https://raw.githubusercontent.com/macielalves/McCalc/main/img/icon.png' });

  createDesktopIcon({
    name: 'Navegador',
    id: 'browser',
    command: createBrowserWindow,
    src: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000'
  });

  createDesktopIcon({ name: 'Info', id: 'info', command: pushWindowInfo, src: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000' });


  const appsBar = new DockItem({ id: 'apps-bar' });
  const toolsBar = new DockItem({ title: '^', id: 'tools-bar' });
  const clockBar = new DockItem({ title: 'clock', id: 'clock-bar' });
  // Adicionar itens na barra de tarefas
  navBarDock.addDockItem(appsBar);
  navBarDock.addDockItem(toolsBar);
  navBarDock.addDockItem(clockBar);

  const windowCmd = createCmdWindow();
  windowCmd.setPosition(20, 10, "%");
  windowCmd.setSize(800, 500);

  createDesktopIcon({ name: 'Perfil de Usuário', id: 'user-profile', command: createUserProfile, src: 'https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000' });
  createDesktopIcon({ name: 'GitHub', id: 'github', command: () => window.open("https://github.com/macielalves"), src: 'https://img.icons8.com/?size=100&id=52539&format=png&color=000000' });

});

const createTrashWindow = () => {
  const windowApp = new WindowApp('Lixeira', 'trash');
  windowApp.setIcon('https://img.icons8.com/?size=100&id=pre7LivdxKxJ&format=png&color=000000');
  windowApp.open();
}

const createCalcWindow = () => {
  const windowApp = new WindowApp('Calculadora', 'calc', false);
  const calc = new Calc();
  windowApp.setIcon('https://raw.githubusercontent.com/macielalves/McCalc/main/img/icon.png');
  windowApp.open();
  windowApp.setSizeAuto();
  windowApp.setMinSize(100, 100);
  windowApp.setPosition(100, 100);
  windowApp.setContent(calc.createCalculator());
  return windowApp;
}

const createCmdWindow = () => {
  const windowApp = new WindowApp('CMD', 'cmd');
  windowApp.setIcon('https://img.icons8.com/?size=100&id=gagNo02GtaUp&format=png&color=000000');
  windowApp.open();
  const cmdWindow = new SubCmd();
  const cmd = cmdWindow.createCmd();
  windowApp.setSize(600, 400);
  windowApp.centerWindow();
  windowApp.setContent(cmd);
  return windowApp;
}

const createBrowserWindow = () => {
  const windowApp = new WindowApp('Navegador', 'browser', false);
  windowApp.setIcon('https://img.icons8.com/?size=100&id=103413&format=png&color=000000');
  windowApp.open();
  const browserWindow = new SubBrowser();
  const browser = browserWindow.createBrowser();
  browserWindow.navigate('https://thebotcatalog.vercel.app');
  const windowWidth = window.innerWidth;
  if (windowWidth < 400) {
    windowApp.setMinSize(100, 100);
  } else {
    windowApp.setMinSize(600, 400);
    windowApp.setSize(600, 400);
  }
  windowApp.setResizable(true);
  windowApp.setPosition(20, 10, "%");
  windowApp.setContent(browser);
}

function createUserProfile() {
  const windowApp = new WindowApp('Perfil de Usuário', 'user-profile');
  windowApp.setIcon('https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000');
  windowApp.open();
}
