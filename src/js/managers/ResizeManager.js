export class ResizeManager {
  /**
   * ResizeManager(options = {})
   * @param {Object} options - Opções para o gerenciador de redimensionamento
   * @param {number} options.minWidth - Largura mínima da janela
   * @param {number} options.minHeight - Altura mínima da janela
   * @param {Array} options.handles - Alças de redimensionamento
   * @param {Function} options.onResize - Função chamada quando a janela é redimensionada
   * @param {Function} options.onResizeStart - Função chamada quando o redimensionamento começa
   * @param {Function} options.onResizeEnd - Função chamada quando o redimensionamento termina
   */
  constructor(options = {}) {
    this.options = {
      minWidth: 300,
      minHeight: 200,
      handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
      onResize: null,
      onResizeStart: null,
      onResizeEnd: null,
      ...options
    };

    this.resizeState = null;
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
  }

  /**
   * Configura a janela para ser redimensionável
   * @param {HTMLElement} windowElement - Elemento da janela
   * @returns {HTMLElement} - Elemento da janela
   */
  setupResizableWindow(windowElement) {
    if (!windowElement || windowElement.dataset.resizable) return;

    // Marca como resizable
    windowElement.dataset.resizable = 'true';

    this.addResizeHandles(windowElement);

    return windowElement;
  }

  /**
   * Adiciona as alças de resize
   * @param {HTMLElement} windowElement - Elemento da janela
   */
  addResizeHandles(windowElement) {
    // Adiciona as alças de resize
    this.options.handles.forEach(position => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${position}`;
      handle.dataset.handle = position;
      windowElement.appendChild(handle);

      handle.addEventListener('mousedown', (e) => {
        this.handleResizeStart(e, windowElement, position);
        e.stopPropagation(); // Previne conflito com drag
      });
    });
  }

  removeResizeHandles(windowElement) {
    const handles = windowElement.querySelectorAll('.resize-handle');
    handles.forEach(handle => handle.remove());
  }

  /**
   * Inicia o redimensionamento da janela
   * @param {MouseEvent} e - Evento de mouse
   * @param {HTMLElement} element - Elemento da janela
   * @param {string} handlePosition - Posição da alça de redimensionamento
   */
  handleResizeStart(e, element, handlePosition) {
    e.preventDefault();

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    this.resizeState = {
      element,
      handle: handlePosition,
      startX: e.clientX,
      startY: e.clientY,
      initialRect: rect,
      initialLeft: parseFloat(computedStyle.left),
      initialTop: parseFloat(computedStyle.top),
      initialWidth: rect.width,
      initialHeight: rect.height,
    };

    element.classList.add('resizing');

    // Callback de início
    if (this.options.onResizeStart) {
      this.options.onResizeStart(element, this.resizeState);
    }

    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  /**
   * Manipula o movimento do mouse durante o redimensionamento
   * @param {MouseEvent} e - Evento de mouse
   */
  handleMouseMove(e) {
    if (!this.resizeState) return;

    const {
      element,
      handle,
      startX,
      startY,
      initialRect,
      initialLeft,
      initialTop,
      initialWidth,
      initialHeight
    } = this.resizeState;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Calcula novas dimensões e posição
    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newLeft = initialLeft;
    let newTop = initialTop;

    // Ajusta dimensões baseado na alça usada
    switch (handle) {
      case 'e':
        newWidth = Math.max(this.options.minWidth, initialWidth + dx);
        break;
      case 'w':
        newWidth = Math.max(this.options.minWidth, initialWidth - dx);
        newLeft = initialLeft + initialWidth - newWidth;
        break;
      case 's':
        newHeight = Math.max(this.options.minHeight, initialHeight + dy);
        break;
      case 'n':
        newHeight = Math.max(this.options.minHeight, initialHeight - dy);
        newTop = initialTop + initialHeight - newHeight;
        break;
      case 'ne':
        newWidth = Math.max(this.options.minWidth, initialWidth + dx);
        newHeight = Math.max(this.options.minHeight, initialHeight - dy);
        newTop = initialTop + initialHeight - newHeight;
        break;
      case 'nw':
        newWidth = Math.max(this.options.minWidth, initialWidth - dx);
        newHeight = Math.max(this.options.minHeight, initialHeight - dy);
        newLeft = initialLeft + initialWidth - newWidth;
        newTop = initialTop + initialHeight - newHeight;
        break;
      case 'se':
        newWidth = Math.max(this.options.minWidth, initialWidth + dx);
        newHeight = Math.max(this.options.minHeight, initialHeight + dy);
        break;
      case 'sw':
        newWidth = Math.max(this.options.minWidth, initialWidth - dx);
        newHeight = Math.max(this.options.minHeight, initialHeight + dy);
        newLeft = initialLeft + initialWidth - newWidth;
        break;
    }

    // Limita ao tamanho da janela
    const maxWidth = window.innerWidth - newLeft;
    const maxHeight = window.innerHeight - newTop;
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    // Aplica as novas dimensões
    requestAnimationFrame(() => {
      if (!this.resizeState) return;

      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      // Atualiza dimensões no elemento
      element.dataset.dimensions = `${Math.round(newWidth)}×${Math.round(newHeight)}`;

      // Callback durante o resize
      if (this.options.onResize) {
        this.options.onResize(element, { width: newWidth, height: newHeight, left: newLeft, top: newTop });
      }
    });
  }

  /**
   * Manipula o evento de soltar o mouse
   */
  handleMouseUp() {
    if (!this.resizeState) return;

    const { element } = this.resizeState;
    element.classList.remove('resizing');

    // Callback de fim
    if (this.options.onResizeEnd) {
      this.options.onResizeEnd(element, this.resizeState);
    }

    // Limpa estado
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    this.resizeState = null;
  }
}