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

export class DockItem {
  constructor(options = {}) {
    this.options = {
      title: "",
      content: "",
      id: "",
      ...options
    };
    this.item = document.createElement('div');
    this.item.classList.add('dock-item');
    this.item.title = this.options.title;
    this.item.id = validateId(this.options.id);
    addOrAppendElement(this.options.content, this.item);
  }

  getItem() {
    return this.item;
  }
}

export class DockIcon {
  static defaultOptions = {
      title: "",
      id: "",
      src: "",
      alt: "",
    command: null
  };

  /**
   * @description Cria um novo ícone para o dock
   * @param {Object} options - Opções de configuração do ícone
   * @param {string} options.title - Título do ícone (tooltip)
   * @param {string} options.id - ID único do ícone
   * @param {string} options.src - Caminho da imagem do ícone
   * @param {string} options.alt - Texto alternativo da imagem
   * @param {Function} options.command - Função a ser executada ao clicar no ícone
   */
  constructor(options = {}) {
    this.options = { ...DockIcon.defaultOptions, ...options };
    this.createIconElement();
    this._icon.addEventListener('click', this.handleClick.bind(this));
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
    this._icon.title = this.options.title;
    this._icon.id = this.validateId(this.options.id);
    this._icon.dataset.windowId = this.options.id;
    this._icon._command = this.options.command;
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
  getIcon() {
    return this._icon;
  }

  handleClick() {
    if (this._icon._command) {
      this._icon._command();
    }
  }
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

