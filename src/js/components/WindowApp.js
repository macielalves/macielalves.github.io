import { DragManager } from '../managers/DragManager.js';
import { ResizeManager } from '../managers/ResizeManager.js';
import { CollisionManager } from '../managers/CollisionManager.js';

export class WindowApp {
  constructor(name, id, resize = true) {
    this._name = name;
    this._id = this.validateId(id);
    this._window = null;
    this._dragManager = new DragManager();
    this._resize = resize;
    if (this._resize) {
      this._resizeManager = new ResizeManager({
        onResizeStart: (el) => {
          el.classList.add('no-drag'); // Previne drag durante resize
        },
        onResizeEnd: (el) => {
          el.classList.remove('no-drag');
        }
      });
    }
  }

  open() {
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
    if (this._resize) {
      this._resizeManager.setupResizableWindow(this._window);
    } else {
      // Remove icon de maximizar
      const maximizeButton = this._window.querySelector('.maximize-button');
      if (maximizeButton) {
        maximizeButton.remove();
      }
    }

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

    this._window.style.left = `${left}px`;
    this._window.style.top = `${top}px`;
  }

  minimize() {
    this._window.classList.toggle('minimized');
  }

  maximize() {
    this._window.classList.toggle('maximized');
    if (this._window.classList.contains('maximized')) {
      // Remove resize handles
      this._window.style.resize = 'none';
    } else {
      // Add resize handles
      this._window.style.resize = 'both';
    }
  }

  close() {
    if (!this._window) return;

    this._window.classList.add('closing');
    setTimeout(() => {
      if (this._window && this._window.parentNode) {
        this._window.parentNode.removeChild(this._window);
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
