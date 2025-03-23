export class DragManager {
  /**
      * Cria um gerenciador de arrasto
      * @param {Object} options - Opções do gerenciador de arrasto
      * options = {
      *  dragHandle: null,           // Seletor para área de arrasto
      *  bounds: 'window',          // 'window' ou elemento pai
      *  grid: null,                // [x, y] para snap
      *  onDragStart: null,         // Callback
      *  onDrag: null,              // Callback
      *  onDragEnd: null,           // Callback
      * }
      */
  constructor(options = {}) {
    this.options = {
      dragHandle: null,
      bounds: 'window',
      grid: null,
      onDragStart: null,
      onDrag: null,
      onDragEnd: null,
      excludeNodes: '.no-drag, .window-controls, .window-button, .window-content',
      ...options
    };

    this.dragState = null;
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
  }

  /**
  * Torna elementos arrastáveis
  * @param {string|Element|Element[]} elements - Seletor ou elemento(s)
  * @param {Object} options - Opções específicas para estes elementos
  */
  makeDraggable(elements, options = {}) {
    const elementList = this.getElements(elements);
    const mergedOptions = { ...this.options, ...options };

    elementList.forEach(element => {
      // Evita duplicar setup
      if (element.dataset.draggable) return;

      // Marca elemento como draggable
      element.dataset.draggable = 'true';

      // Define área de arrasto
      const dragHandle = mergedOptions.dragHandle ?
        element.querySelector(mergedOptions.dragHandle) :
        element;

      // Configuração inicial
      if (!element.style.position) {
        element.style.position = 'absolute';
      }

      // Adiciona listeners
      this.setupDraggable(element, dragHandle, mergedOptions);
    });

    return elementList; // Permite encadeamento
  }

  /**
  * Remove funcionalidade draggable
  * @param {string|Element|Element[]} elements - Elementos para remover
  */
  removeDraggable(elements) {
    const elementList = this.getElements(elements);

    elementList.forEach(element => {
      if (!element.dataset.draggable) return;

      element.removeEventListener('mousedown', element._dragStartHandler);
      delete element.dataset.draggable;
      delete element._dragStartHandler;
    });
  }

  setupDraggable(element, handle, options) {
    const startDrag = (e) => {
      // Verifica se o clique foi no conteúdo ou em elementos excluídos
      if (this.shouldPreventDrag(e.target, element)) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const bounds = this.calculateBounds(element, options.bounds);

      this.dragState = {
        element,
        handle,
        options,
        startX: e.clientX,
        startY: e.clientY,
        initialLeft: rect.left,
        initialTop: rect.top,
        bounds,
        originalZIndex: element.style.zIndex
      };

      element.classList.add('dragging');
      element.style.zIndex = '10000';

      if (options.onDragStart) {
        options.onDragStart(element, rect);
      }

      document.addEventListener('mousemove', this.boundMouseMove);
      document.addEventListener('mouseup', this.boundMouseUp);
    };

    element._dragStartHandler = startDrag;
    handle.addEventListener('mousedown', startDrag);
  }

  handleMouseMove(e) {
    if (!this.dragState) return;

    const { element, startX, startY, initialLeft, initialTop, bounds, options } = this.dragState;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    // Aplica grid se definido
    if (options.grid) {
      const [gridX, gridY] = options.grid;
      dx = Math.round(dx / gridX) * gridX;
      dy = Math.round(dy / gridY) * gridY;
    }

    // Calcula nova posição
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Aplica limites
    if (bounds) {
      newLeft = Math.max(bounds.left, Math.min(bounds.right - element.offsetWidth, newLeft));
      newTop = Math.max(bounds.top, Math.min(bounds.bottom - element.offsetHeight, newTop));
    }

    // Atualiza posição
    requestAnimationFrame(() => {
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      // Callback
      if (options.onDrag) {
        options.onDrag(element, { left: newLeft, top: newTop });
      }
    });
  }

  handleMouseUp() {
    if (!this.dragState) return;

    const { element, options, originalZIndex } = this.dragState;

    // Restaura estado original
    element.classList.remove('dragging');
    element.style.zIndex = originalZIndex;

    // Callback
    if (options.onDragEnd) {
      options.onDragEnd(element);
    }

    // Limpa estado
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    this.dragState = null;
  }

  // Novo método para verificar se deve prevenir o arrasto
  shouldPreventDrag(target, element) {
    // Verifica se o clique foi em algum elemento excluído
    if (this.options.excludeNodes && target.matches(this.options.excludeNodes)) {
      return true;
    }

    // Verifica se o clique foi no conteúdo da janela
    const windowContent = element.querySelector('.window-content');
    if (windowContent && (target === windowContent || windowContent.contains(target))) {
      return true;
    }

    return false;
  }

  // Utilitários
  getElements(elements) {
    if (typeof elements === 'string') {
      return Array.from(document.querySelectorAll(elements));
    }
    return Array.isArray(elements) ? elements : [elements];
  }

  calculateBounds(element, bounds) {
    if (bounds === 'window') {
      return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight
      };
    }
    if (bounds instanceof Element) {
      const rect = bounds.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      };
    }
    return null;
  }
} 