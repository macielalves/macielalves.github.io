import { WindowApp } from './components/WindowApp.js';
import { Calc } from './components/Calc.js';
import { SubBrowser } from './managers/SubBrowser.js';
import { NavBarDock, DockItem } from './components/NavBarDock.js';
import { SubCmd } from './managers/SubCmd.js';

document.author = 'Maciel Alves';
async function getLastCommitDate() {
  try {
    const response =  await fetch('https://api.github.com/repos/macielalves/macielalves.github.io/commits/main');
    if (!response.ok) {
      throw new Error('Erro ao buscar commits do repositório');
    }
    const data = await response.json();
    return data.commit.author.date;
  } catch (error) {
    console.error('Erro ao buscar data do último commit:', error);
    return null;
  }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Seletor root
  const root = document.querySelector('.root');
  // Criação da área de trabalho
  const desktop = document.createElement('div');
  desktop.classList.add('desktop');
  // Adiciona a área de trabalho ao root
  root.appendChild(desktop);
  // Criação da barra de navegação
  const navBarDock = new NavBarDock();
  const dock = navBarDock.createDock();
  // dock.classList.add('dock-hidden');
  root.appendChild(dock);

  { // <-- Uma forma opcional de organizar o código; Estrutura de Bloco
    // Criar ícones iniciais
    desktop.appendChild(createDesktopIcon({ name: 'Lixeira', id: 'trash', command: createTrashWindow, src: 'https://img.icons8.com/?size=100&id=pre7LivdxKxJ&format=png&color=000000' }));
    desktop.appendChild(createDesktopIcon({ name: 'cmd', id: 'cmd', command: createCmdWindow, src: 'https://img.icons8.com/?size=100&id=gagNo02GtaUp&format=png&color=000000' }));
    desktop.appendChild(createDesktopIcon({ name: 'calc', id: 'calc', command: createCalcWindow, src: 'https://raw.githubusercontent.com/macielalves/McCalc/main/img/icon.png' }));
  
    desktop.appendChild(createDesktopIcon({
      name: 'Navegador',
      id: 'browser',
      command: createBrowserWindow,
      src: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000'
    }));
    desktop.appendChild(createDesktopIcon({ name: 'Info', id: 'info', command: pushWindowInfo, src: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000' }));
    desktop.appendChild(createDesktopIcon({ name: 'Perfil de Usuário', id: 'user-profile', command: createUserProfile, src: 'https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000' }));
    desktop.appendChild(createDesktopLink({ name: 'GitHub', href: 'https://github.com/macielalves', src: 'https://img.icons8.com/?size=100&id=52539&format=png&color=000000' }));
    desktop.appendChild(createDesktopLink({ name: 'Linkedin', href: 'https://www.linkedin.com/in/macielalves-dev', src: 'https://img.icons8.com/?size=100&id=13930&format=png&color=000000' }));
    desktop.appendChild(createDesktopLink({name: 'Old Main', href: './src/pages/index.html', src: '/src/assets/images/FolderMcA.svg'}))
  }


  const appsBar = new DockItem({ id: 'apps-bar' });
  const toolsBar = new DockItem({ title: '^', id: 'tools-bar' });
  const clockBar = new DockItem({ title: 'clock', id: 'clock-bar' });
  // Adicionar itens na barra de tarefas
  navBarDock.addDockItem(appsBar);
  navBarDock.addDockItem(toolsBar);
  navBarDock.addDockItem(clockBar);

  setTimeout(async () => {
    const lastCommitDate = await getLastCommitDate();
    document.lastCommitDate = lastCommitDate;
    pushWindowInfo();
  }, 1000);

});


// Informações do Navegador
function pushWindowInfo(a=null) {
  const infoWindow = new WindowApp('Informações do App', 'info', {icon: 'https://img.icons8.com/?size=100&id=VQOfeAx5KWTK&format=png&color=000000'});
  infoWindow.open();
  infoWindow.setPosition(20, 10, "%");
  infoWindow.setSize(700, 400);
  infoWindow.setContent(`
    <h1>Informações da Página</h1>
    <h2>O que é isso?</h2>
    <p style="font-size: 1.2rem;">É onde você pode ver meus projetos e me conhecer melhor por meio de uma área de trabalho interativa feita exclusivamente em HTML, CSS e JavaScript.</p>
    <p>Autor: ${document.author}</p>
    <p>URL: ${window.location.href}</p>
    <p>Título: ${document.title}</p>
    <p>Descrição: O sitema é uma mistura de um gerenciador de janelas e um navegador, com um pouco de ferramentas de sistema operacional.</p>
    <p>Palavras-chave: ${document.keywords}</p>
    <p>Data de criação: ${document.createDate}</p>
    <p>Data de modificação: ${document.lastCommitDate}</p>
    <h2>Obrigado por visitar!</h2>
    <p align="center">Em constante desenvolvimento!</p>
  `);
}

const createTrashWindow = () => {
  const windowApp = new WindowApp('Lixeira', 'trash', {resize: false, icon: 'https://img.icons8.com/?size=100&id=pre7LivdxKxJ&format=png&color=000000'});
  windowApp.open();
}

const createCalcWindow = () => {
  const windowApp = new WindowApp('Calculadora', 'calc', {resize: false, icon: 'https://raw.githubusercontent.com/macielalves/McCalc/main/img/icon.png'});
  windowApp.open();
  const calc = new Calc();
  windowApp.setSizeAuto();
  windowApp.setMinSize(100, 100);
  windowApp.setPosition(100, 100);
  windowApp.setContent(calc.createCalculator());
  return windowApp;
}

const createCmdWindow = () => {
  const windowApp = new WindowApp('CMD', 'cmd', {resize: false, icon: 'https://img.icons8.com/?size=100&id=gagNo02GtaUp&format=png&color=000000'});
  windowApp.open();
  const cmdWindow = new SubCmd();
  const cmd = cmdWindow.createCmd();
  windowApp.setSize(600, 400);
  windowApp.centerWindow();
  windowApp.setContent(cmd);
  return windowApp;
}

const createBrowserWindow = () => {
  const windowApp = new WindowApp('Navegador', 'browser', {resize: false, icon: 'https://img.icons8.com/?size=100&id=103413&format=png&color=000000'});
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
  const windowApp = new WindowApp('Perfil de Usuário', 'user-profile', {resize: false, icon: 'https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000'});
  windowApp.open();
}

function createDesktopLink({ name, href = null, target = '_blank', src = "src/assets/images/M.png", alt = null }) {
  const link = document.createElement('a');
  link.classList.add('desktop-link');
  link.href = href;
  link.target = target;
  link.innerHTML = `
    <img src="${src}" alt="${alt || name}">
    <span>${name}</span>
  `;
  return link
}

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
    } else if (href) {
      window.open(href, '_blank');
    } else {
      // console.log('Não há comando ou href');
    }
  });
  return icon
}

