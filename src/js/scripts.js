/**
 * Constantes para classes CSS
 */
const CLASSES = {
    FULL: 'janela_full',
    MIN: 'janela_min',
    WINDOW: 'window'
};

/**
 * Alterna o estado da janela
 * @param {string} state - Estado da janela
 */
function toggleWindowState(state) {
    const janela = document.getElementById('container_main');
    const oppositeState = state === CLASSES.FULL ? CLASSES.MIN : CLASSES.FULL;

    janela.classList.toggle(state);
    if (janela.classList.contains(oppositeState)) {
        janela.classList.toggle(oppositeState);
    }
}

/**
 * Maximiza a janela
 */
function max_screen() {
    toggleWindowState(CLASSES.FULL);
}

/**
 * Minimiza a janela
 */
function minimize() {
    toggleWindowState(CLASSES.MIN);
}

class WindowApp {
    constructor(name, id) {
        this.name = name;
        this.id = this.validateId(id);
        this.window = null;
        this.dragManager = new DraggableManager();
        this.resizeManager = new ResizeManager({
            onResizeStart: (el) => {
                el.classList.add('no-drag'); // Previne drag durante resize
            },
            onResizeEnd: (el) => {
                el.classList.remove('no-drag');
            }
        });
    }

    open() {
        this.window = this.createWindow();
        document.body.appendChild(this.window);
        this.setupWindowControls();
        
        // Setup drag e resize
        this.dragManager.makeDraggable(this.window, {
            dragHandle: '.window-header',
            excludeNodes: '.window-controls, .window-button, .window-content, .resize-handle, .no-drag'
        });
        this.resizeManager.setupResizableWindow(this.window);
        
        this.centerWindow();
    }

    createWindow() {
        const windowTemplate = `
            <div class="window" id="${this.id}" data-window-id="${this.id}">
            <div class="window-header">
                    <div class="window-title">${this.name}</div>
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
                </div>
                <div class="window-content">
                    <div class="window-body">
                        <p>Conteúdo da janela ${this.name}</p>
                    </div>
                </div>
            </div>
        `;

        const windowElement = document.createElement('div');
        windowElement.innerHTML = windowTemplate.trim();
        return windowElement.firstElementChild;
    }

    setupWindowControls() {
        const minimizeButton = this.window.querySelector('.minimize-button');
        const maximizeButton = this.window.querySelector('.maximize-button');
        const closeButton = this.window.querySelector('.close-button');

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
        const windowRect = this.window.getBoundingClientRect();
        const windowWidth = windowRect.width;
        const windowHeight = windowRect.height;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        this.window.style.left = `${left}px`;
        this.window.style.top = `${top}px`;
    }

    minimize() {
        this.window.classList.toggle('minimized');
    }

    maximize() {
        this.window.classList.toggle('maximized');
    }

    close() {
        if (!this.window) return;

        this.window.classList.add('closing');
        setTimeout(() => {
            if (this.window && this.window.parentNode) {
                this.window.parentNode.removeChild(this.window);
            }
            this.window = null;
        }, 300);
    }

    validateId(id) {
        let validId = id;
        let counter = 1;

        while (document.getElementById(validId)) {
            validId = `${id}_${counter}`;
            counter++;
        }

        return validId;
    }
}

// Função utilitária para tornar elementos draggable
function makeDraggable(elements, options = {}) {
    const dragManager = new DraggableManager();
    return dragManager.makeDraggable(elements, options);
}

// Função utilitária para detecção de colisão
function setupCollisionDetection(element, options = {}) {
    const collisionManager = new CollisionManager();
    collisionManager.addElement(element, options);
    return collisionManager;
}

class DraggableManager {
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

    makeDraggable(elements, options = {}) {
        const elementList = this.getElements(elements);
        const mergedOptions = { ...this.options, ...options };

        elementList.forEach(element => {
            if (element.dataset.draggable) return;

            element.dataset.draggable = 'true';

            const dragHandle = mergedOptions.dragHandle ?
                element.querySelector(mergedOptions.dragHandle) :
                element;

            if (!element.style.position) {
                element.style.position = 'absolute';
            }

            this.setupDraggable(element, dragHandle, mergedOptions);
        });

        return elementList;
    }

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

        if (options.grid) {
            const [gridX, gridY] = options.grid;
            dx = Math.round(dx / gridX) * gridX;
            dy = Math.round(dy / gridY) * gridY;
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        if (bounds) {
            newLeft = Math.max(bounds.left, Math.min(bounds.right - element.offsetWidth, newLeft));
            newTop = Math.max(bounds.top, Math.min(bounds.bottom - element.offsetHeight, newTop));
        }

        requestAnimationFrame(() => {
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;

            if (options.onDrag) {
                options.onDrag(element, { left: newLeft, top: newTop });
            }
        });
    }

    handleMouseUp() {
        if (!this.dragState) return;

        const { element, options, originalZIndex } = this.dragState;

        element.classList.remove('dragging');
        element.style.zIndex = originalZIndex;

        if (options.onDragEnd) {
            options.onDragEnd(element);
        }

        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);
        this.dragState = null;
    }

    shouldPreventDrag(target, element) {
        if (this.options.excludeNodes && target.matches(this.options.excludeNodes)) {
            return true;
        }

        const windowContent = element.querySelector('.window-content');
        if (windowContent && (target === windowContent || windowContent.contains(target))) {
            return true;
        }

        return false;
    }

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

class CollisionManager {
    constructor(options = {}) {
        this.options = {
            velocityThreshold: 15,
            cooldownTime: 150,
            historySize: 5,
            soundEnabled: true,
            soundVolume: 0.3,
            soundUrl: null,
            bounds: 'window',
            onCollision: null,
            visualFeedback: true,
            ...options
        };

        this.state = {
            lastCollision: 0,
            velocityHistory: [],
            activeElements: new Map(),
            sound: null
        };

        this.initializeSound();
    }

    initializeSound() {
        if (this.options.soundEnabled && this.options.soundUrl) {
            this.state.sound = new Audio(this.options.soundUrl);
            this.state.sound.volume = this.options.soundVolume;
        }
    }

    addElement(element, options = {}) {
        const elementOptions = { ...this.options, ...options };
        
        this.state.activeElements.set(element, {
            velocityHistory: [],
            lastCollision: 0,
            options: elementOptions
        });

        return this;
    }

    removeElement(element) {
        this.state.activeElements.delete(element);
        return this;
    }

    checkCollision(element, movement) {
        const elementState = this.state.activeElements.get(element);
        if (!elementState) return false;

        const { dx = 0, dy = 0, velocity } = movement;
        const now = Date.now();
        const rect = element.getBoundingClientRect();
        const bounds = this.calculateBounds(elementState.options.bounds);

        if (now - elementState.lastCollision < elementState.options.cooldownTime) {
            return false;
        }

        this.updateVelocityHistory(elementState, velocity);

        const avgVelocity = this.calculateAverageVelocity(elementState);
        if (avgVelocity < elementState.options.velocityThreshold) {
            return false;
        }

        const collision = {
            left: rect.left <= bounds.left && dx < 0,
            right: rect.right >= bounds.right && dx > 0,
            top: rect.top <= bounds.top && dy < 0,
            bottom: rect.bottom >= bounds.bottom && dy > 0,
            velocity: avgVelocity,
            position: { x: rect.left, y: rect.top },
            bounds
        };

        const hasCollision = Object.entries(collision)
            .filter(([key]) => ['left', 'right', 'top', 'bottom'].includes(key))
            .some(([_, value]) => value);

        if (hasCollision) {
            elementState.lastCollision = now;
            this.handleCollision(element, collision, elementState);
            return collision;
        }

        return false;
    }

    handleCollision(element, collision, elementState) {
        const { options } = elementState;

        if (options.soundEnabled && this.state.sound) {
            this.playCollisionSound(collision.velocity);
        }

        if (options.visualFeedback) {
            this.addCollisionEffect(element, collision);
        }

        if (options.onCollision) {
            options.onCollision(element, collision);
        }
    }

    playCollisionSound(velocity) {
        if (!this.state.sound) return;

        const normalizedVolume = Math.min(
            velocity / (this.options.velocityThreshold * 2),
            1
        );
        
        this.state.sound.volume = normalizedVolume * this.options.soundVolume;
        this.state.sound.currentTime = 0;
        this.state.sound.play().catch(() => {});
    }

    addCollisionEffect(element, collision) {
        element.classList.remove(
            'collision-horizontal',
            'collision-vertical',
            'collision-effect'
        );

        element.classList.add('collision-effect');
        
        if (collision.left || collision.right) {
            element.classList.add('collision-horizontal');
        }
        if (collision.top || collision.bottom) {
            element.classList.add('collision-vertical');
        }

        setTimeout(() => {
            element.classList.remove(
                'collision-effect',
                'collision-horizontal',
                'collision-vertical'
            );
        }, 150);
    }

    updateVelocityHistory(elementState, velocity) {
        elementState.velocityHistory.push(velocity);
        if (elementState.velocityHistory.length > elementState.options.historySize) {
            elementState.velocityHistory.shift();
        }
    }

    calculateAverageVelocity(elementState) {
        if (!elementState.velocityHistory.length) return 0;
        
        return elementState.velocityHistory.reduce((a, b) => a + b, 0) / 
               elementState.velocityHistory.length;
    }

    calculateBounds(bounds) {
        if (bounds === 'window') {
            return {
                left: 0,
                top: 0,
                right: window.innerWidth,
                bottom: window.innerHeight
            };
        }
        if (bounds instanceof Element) {
            return bounds.getBoundingClientRect();
        }
        return bounds;
    }
}

class ResizeManager {
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

    setupResizableWindow(windowElement) {
        if (!windowElement || windowElement.dataset.resizable) return;

        // Marca como resizable
        windowElement.dataset.resizable = 'true';

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

        return windowElement;
    }

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


