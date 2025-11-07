'use strict';

import { addOrAppendElement, validateId } from '../utils.js';

// todo - adicionar funcionalidades de arrastar e soltar ícones no dock
export class NavBarDock {
  constructor() {
    this.dock = document.createElement('div');
    this.dock.classList.add('dock');
  }

  createDock() {
    this.dock.innerHTML = `<div class="dock-container"></div>`;
    return this.dock;
  }

  setGridTemplateColumns(columns) {
    this.dock.querySelector('.dock-container').style.gridTemplateColumns = columns;
  }

  setGridTemplateRows(rows) {
    this.dock.querySelector('.dock-container').style.gridTemplateRows = rows;
  }

  addDockSection(section) {
    this.dock.querySelector('.dock-container').appendChild(section.get());
  }

  removeDockSection(section) {
    this.dock.querySelector(`.dock-section:contains(${section})`).remove();
  }

  getDockSection(section) {
    return this.dock.querySelector(`.dock-section:contains(${section})`);
  }

  getDockSections() {
    return this.dock.querySelectorAll('.dock-section');
  }

  getDockSectionIndex(section) {
    return Array.from(this.getDockSections()).indexOf(section);
  }

  getDockSectionPosition(section) {
    return this.getDockSectionIndex(section);
  }

  /**
   * Adiciona um item ao dock
   * @param {DockItem} item
   */
  addDockItem(item) {
    this.dock.querySelector('.dock-container').appendChild(item.getItem());
  }

  addDockAppIcon(icon) {
    const dockItem = new DockIcon(icon);
    this.dock.querySelector('.dock-container').appendChild(dockItem.getItem());
  }

  removeDockItem(item) {
    this.dock.querySelector(`.dock-item:contains(${item})`).remove();
  }

  getDockItem(item) {
    return this.dock.querySelector(`.dock-item:contains(${item})`);
  }

  getDockItems() {
    return this.dock.querySelectorAll('.dock-item');
  }

  getDockItemIndex(item) {
    return Array.from(this.getDockItems()).indexOf(item);
  }

  getDockItemPosition(item) {
    return this.getDockItemIndex(item);
  }
}

export class DockSection {
  constructor(options = {}) {
    this.options = {
      title: "",
      content: "",
      id: "",
      ...options
    };
    this.section = document.createElement('div');
    this.section.classList.add('dock-section');
    this.section.title = this.options.title;
    this.section.id = validateId(this.options.id);
    addOrAppendElement(this.options.content, this.section);
  }

  get() {
    return this.section;
  }
}

export class DockItem {
  static defaultOptions = {
    id: "",
    title: "",
    command: null,
    menuOptions: [],
    content: "",
    icon: {
      src: "",
      alt: "",
    },
  };

  /**
   * @description Cria um novo ícone para o dock
   * @param {Object} options - Opções de configuração do item da dock
   * @param {string} options.title - Título do ícone (tooltip)
   * @param {string} options.id - ID único do ícone
   * @param {Function} options.command - Função a ser executada ao clicar no ícone
   * @param {Array} options.menuOptions - Opções do menu de contexto do ícone
   * @param {Object} options.icon - Opções do ícone (ver DockIcon)
   * @param {string} options.icon.src - Caminho da imagem do ícone
   * @param {string} options.icon.alt - Texto alternativo da imagem
   */
  constructor(options = {}) {
    this.options = { ...DockItem.defaultOptions, ...options };
    this.createItemElement();
    // this._icon.addEventListener('click', this.handleClick.bind(this));
    const menuItemsDefault = [
      { label: 'Fechar', action: () => {  } }
    ];
    const menu = createDockMenu(menuItemsDefault);
    this._container.appendChild(menu);
  }

  /**
   * @private
   * @description Cria o elemento DOM do ícone
   */
  createItemElement() {
    this._container = document.createElement('div');
    const icon = new DockIcon(this.options.icon).getIcon();
    icon.addEventListener('click', () => {
      if (this._container._command) {
        this._container._command();
      }
    });
    this._container.appendChild(icon);
    this._container.classList.add('dock-item');
    this.setupItemAttributes();
  }

  /**
   * @private
   * @description Configura os atributos básicos do ícone
   */
  setupItemAttributes() {
    this._container.classList.add('dock-item');
    this._container.title = this.options.title;
    this._container.id = this.validateId(this.options.id);
    this._container.dataset.windowId = this.options.id;
    this._container._command = this.options.command;
  }

  /**
   * @description Valida e retorna o ID do ícone
   * @param {string} id - ID a ser validado
   * @returns {string} ID validado
   */
  validateId(id) {
    return validateId(id);
  }

  /**
   * @description Retorna o elemento DOM do ícone
   * @returns {HTMLElement} Elemento do ícone
   */
  getItem() {
    return this._container;
  }

  // handleClick() {
  //   if (this._container._command) {
  //     this._container._command();
  //   }
  // }
}

export class DockIcon {

  /**
   * @description Cria um novo ícone para o dock
   * @param {Object} options - Opções de configuração do ícone
   * @param {string} options.src - Caminho da imagem do ícone
   * @param {string} options.alt - Texto alternativo da imagem
   */
  constructor(src, alt="") {
    this.options = { src, alt };
    this.createIconElement();
    // this._icon.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * @private
   * @description Cria o elemento DOM do ícone
   */
  createIconElement() {
    this._icon = document.createElement('div');
    this.setupIconAttributes();
    this.addIconImage();
  }

  /**
   * @private
   * @description Configura os atributos básicos do ícone
   */
  setupIconAttributes() {
    this._icon.classList.add('dock-icon');
  }

  /**
   * @private
   * @description Adiciona a imagem ao ícone
   */
  addIconImage() {
    const img = document.createElement('img');
    img.src = this.options.src;
    img.alt = this.options.alt;
    addOrAppendElement(img, this._icon);
  }

  /**
   * @description Retorna o elemento DOM do ícone
   * @returns {HTMLElement} Elemento do ícone
   */
  getIcon() {
    return this._icon;
  }
}

const createDockMenu = (menuItems = []) => {
    const menu = document.createElement('div');
    menu.classList.add('dock-item-menu');
    menuItems.forEach(menuItem => {
      const item = document.createElement('div');
      item.classList.add('dock-item-menu-option');
      item.textContent = menuItem.label;
      item.addEventListener('click', menuItem.action);
      menu.appendChild(item);
    });
    return menu;
  }


export function pushAppIconToDock({name, id, src, alt, command}){
  const icon = new DockIcon({name, id, src, alt, command});
  const dockApps = document.querySelector('#apps-bar');
  addOrAppendElement(icon.getIcon(), dockApps);
}

export function removeAppIconFromDock({id}){
  const dockApps = document.querySelector('#apps-bar');
  const icon = dockApps.querySelector(`[data-window-id="${id}"]`);
  icon.remove();
}

export function pushAppToDock({name, id, command=() => {}, menuoptions=[], icon=DockIcon.defaultOptions}){
  const dockItem = new DockItem({name, id, command, menuoptions, icon});
  const dockApps = document.querySelector('#apps-bar');
  addOrAppendElement(dockItem.getItem(), dockApps);
}

export function removeAppFromDock({id}){
  const dockApps = document.querySelector('#apps-bar');
  const app = dockApps.querySelector(`[data-window-id="${id}"]`);
  app.remove();
}

