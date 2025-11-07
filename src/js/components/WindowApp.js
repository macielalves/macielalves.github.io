import { DragManager } from '../managers/DragManager.js';
import { ResizeManager } from '../managers/ResizeManager.js';
import { CollisionManager } from '../managers/CollisionManager.js';
import { pushAppToDock, removeAppIconFromDock } from './NavBarDock.js';
import Icon from './Icons.js';



export class WindowApp {
  static options = {
    resize: true,
    icon: './src/assets/images/M.png',
    dockMenu: null,
  };

  /**
   * @description Cria uma janela de aplicação
   * @param {string} name - Nome da aplicação
   * @param {string} id - ID da janela
   * @param {Object} options - Opções da janela
   * options = {
   *   resize: true/false,          // Habilita/desabilita redimensionamento
   *   icon: Icon/String,          // Ícone da aplicação
   *   dockMenu: DockMenu,         // Menu do ícone na dock
   * }
   */
  constructor(name, id, options = {}) {
    this._options = options;
    this._name = name;
    this._id = this.validateId(id);
    this._window = null;
    this._dragManager = new DragManager();
    this._resize = options.resize === undefined ? true : options.resize;
    this._hidden = false;
    this._dockMenu = options.dockMenu || null;
    if (typeof options.icon === 'string') {
      this._icon = new Icon(options.icon);
    } else {
      this._icon = options.icon;
    }
    // console.log(this._resize);
  }

  open() {
    pushAppToDock({
      name: this._name, id: this._id, command: () => {
        this.minimize();
      }, menuOptions: [], icon: this._icon.src,
    });
    this._window = this.createWindow();
    this._window.classList.add('glass');
    this._window.classList.add('window');
    this._window.classList.add('active');
    document.querySelector('.desktop').appendChild(this._window);
    this.setupWindowControls();

    // Setup drag e resize
    this._dragManager.makeDraggable(this._window, {
      dragHandle: '.window-header',
      excludeNodes: '.window-controls, .window-button, .window-content, .resize-handle, .no-drag'
    });
    this.setResizable(this._resize);
    this.centerWindow();
  }

  createWindow() {
    const windowTemplate = `
          <div class="window" id="${this._id}" data-window-id="${this._id}">
              <div class="window-header">
                <div class="window-controls">
                  <div class="window-button minimize-button">
                    <i class="fas fa-window-minimize"></i>
                  </div>
                  <div class="window-button maximize-button">
                    <i class="fas fa-window-maximize"></i>
                  </div>
                  <div class="window-button close-button">
                    <i class="fas fa-times"></i>
                  </div>
                </div>
                <div class="window-title">${this._name}</div>
              </div>
              <div class="window-content">
                  <div class="window-body"></div>
              </div>
          </div>
      `;

    const windowElement = document.createElement('div');
    windowElement.innerHTML = windowTemplate.trim();
    return windowElement.firstElementChild;
  }

  setIcon(src) {
    this._icon.setSrc(src);
  }

  setupWindowControls() {
    const minimizeButton = this._window.querySelector('.minimize-button');
    const maximizeButton = this._window.querySelector('.maximize-button');
    const closeButton = this._window.querySelector('.close-button');

    if (minimizeButton) {
      minimizeButton.addEventListener('click', () => this.minimize());
    }

    if (maximizeButton) {
      maximizeButton.addEventListener('click', () => this.maximize());
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => this.close(), { once: true });
    }
  }

  centerWindow() {
    const windowRect = this._window.getBoundingClientRect();
    const windowWidth = windowRect.width;
    const windowHeight = windowRect.height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    this.setPosition(left, top);
  }

  minimize() {
    this._window.classList.toggle('minimized');
  }

  maximize() {
    this._window.classList.toggle('maximized');
    this._resizeManager?.toggleResizeHandles(this._window);
  }

  close() {
    if (!this._window) return;

    this._window.classList.add('closing');
    setTimeout(() => {
      if (this._window && this._window.parentNode) {
        this._window.parentNode.removeChild(this._window);
        removeAppIconFromDock({ id: this._id });
      }
      this._window = null;
    }, 300);
  }

  /**
   * Valida o ID da janela
   * @param {string} id - ID da janela
   * @returns {string} ID da janela
   */
  validateId(id) {
    let validId = id;
    let counter = 1;

    while (document.getElementById(validId)) {
      validId = `${id}_${counter}`;
      counter++;
    }

    return validId;
  }

  /**
   * Define o tamanho da janela
   * @param {number} width - Largura da janela
   * @param {number} height - Altura da janela
   */
  setSize(width, height) {
    this._window.style.width = `${width}px`;
    this._window.style.height = `${height}px`;
  }

  /**
   * Define o tamanho da janela como automático
   */
  setSizeAuto() {
    this._window.style.width = 'auto';
    this._window.style.height = 'auto';
  }

  /**
   * Define o tamanho mínimo da janela
   * @param {number} width - Largura mínima da janela
   * @param {number} height - Altura mínima da janela
   */
  setMinSize(width, height) {
    this._window.style.minWidth = `${width}px`;
    this._window.style.minHeight = `${height}px`;
  }

  /**
   * Define o tamanho máximo da janela
   * @param {number} width - Largura máxima da janela
   * @param {number} height - Altura máxima da janela
   */
  setMaxSize(width, height) {
    this._window.style.maxWidth = `${width}px`;
    this._window.style.maxHeight = `${height}px`;
  }

  /**
   * Define o tamanho mínimo e máximo da janela
   * @param {number} minWidth - Largura mínima da janela
   * @param {number} minHeight - Altura mínima da janela
   * @param {number} maxWidth - Largura máxima da janela
   * @param {number} maxHeight - Altura máxima da janela
   */
  setMinMaxSize(minWidth, minHeight, maxWidth, maxHeight) {
    this.setMinSize(minWidth, minHeight);
    this.setMaxSize(maxWidth, maxHeight);
  }

  /**
   * Define se a janela é redimensionável
   * @param {boolean} resizable - Se a janela é redimensionável
   */
  setResizable(resizable) {
    this._resize = resizable;
    const maximizeButton = this._window?.querySelector('.maximize-button');
    if (this._resize && !this._resizeManager) {
      this._resizeManager = new ResizeManager({
        onResizeStart: (el) => {
          el.classList.add('no-drag'); // Previne drag durante resize
        },
        onResizeEnd: (el) => {
          el.classList.remove('no-drag');
        }
      });
      this._resizeManager.setupResizableWindow(this._window);

      if (!maximizeButton) {
        const _maximizeButton = document.createElement('div');
        _maximizeButton.classList.add('window-button');
        _maximizeButton.classList.add('maximize-button');
        _maximizeButton.innerHTML = '<i class="fas fa-window-maximize"></i>';
        _maximizeButton.addEventListener('click', () => this.maximize());
        const minimizeButton = this._window?.querySelector('.minimize-button');
        minimizeButton.insertAdjacentElement('afterend', _maximizeButton);
      }
    } else {
      if (this._resizeManager) {
        this._resizeManager.destroy();
      }
      // Remove icon de maximizar
      if (maximizeButton) {
        maximizeButton.remove();
      }
    }
  }

  /**
   * Define a posição da janela
   * @param {number} x - Posição X da janela em pixels
   * @param {number} y - Posição Y da janela em pixels
   * @param {string} unit - Unidade de medida (px, %, etc.)
   */
  setPosition(x, y, unit = "px") {
    try {
      this._window.style.left = `${x}${unit}`;
      this._window.style.top = `${y}${unit}`;
    } catch (error) {
      console.error('Erro ao definir a posição da janela:', error);
    }
  }

  /**
   * Define o conteúdo da janela
   * @param {string | HTMLElement} content - Conteúdo da janela
   */
  setContent(content) {
    if (typeof content === 'string') {
      this._window.querySelector('.window-body').innerHTML = content;
    } else if (typeof content === 'object') {
      this._window.querySelector('.window-body').appendChild(content);
    }
  }

  hide() {
    this._window.classList.add('hidden');
  }

  show() {
    this._window.classList.remove('hidden');
  }

}

// Função utilitária para tornar elementos draggable
export function makeDraggable(elements, options = {}) {
  const dragManager = new DragManager();
  return dragManager.makeDraggable(elements, options);
}

// Função utilitária para detecção de colisão
export function setupCollisionDetection(element, options = {}) {
  const collisionManager = new CollisionManager();
  collisionManager.addElement(element, options);
  return collisionManager;
}

