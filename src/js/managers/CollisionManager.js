export class CollisionManager {
  constructor(options = {}) {
    this.options = {
      velocityThreshold: 15,        // Velocidade mínima para colisão
      cooldownTime: 150,            // Tempo entre colisões (ms)
      historySize: 5,               // Frames para calcular velocidade
      soundEnabled: true,           // Habilita/desabilita som
      soundVolume: 0.3,             // Volume base do som (0-1)
      soundUrl: null,               // URL do arquivo de som
      bounds: 'window',             // 'window' ou elemento
      onCollision: null,            // Callback de colisão
      visualFeedback: true,         // Habilita feedback visual
      ...options
    };

    this.state = {
      lastCollision: 0,
      velocityHistory: [],
      activeElements: new Map(),    // Guarda estado de elementos
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

  /**
   * Adiciona elemento para monitoramento de colisão
   * @param {Element} element Elemento para monitorar
   * @param {Object} options Opções específicas para este elemento
   */
  addElement(element, options = {}) {
    const elementOptions = { ...this.options, ...options };

    this.state.activeElements.set(element, {
      velocityHistory: [],
      lastCollision: 0,
      options: elementOptions
    });

    return this; // Para encadeamento
  }

  removeElement(element) {
    this.state.activeElements.delete(element);
    return this;
  }

  /**
   * Verifica colisão para um elemento
   * @param {Element} element Elemento a verificar
   * @param {Object} movement Dados do movimento {dx, dy, velocity}
   * @returns {Object|false} Dados da colisão ou false
   */
  checkCollision(element, movement) {
    const elementState = this.state.activeElements.get(element);
    if (!elementState) return false;

    const { dx = 0, dy = 0, velocity } = movement;
    const now = Date.now();
    const rect = element.getBoundingClientRect();
    const bounds = this.calculateBounds(elementState.options.bounds);

    // Verifica cooldown
    if (now - elementState.lastCollision < elementState.options.cooldownTime) {
      return false;
    }

    // Atualiza histórico de velocidade
    this.updateVelocityHistory(elementState, velocity);

    // Calcula velocidade média
    const avgVelocity = this.calculateAverageVelocity(elementState);
    if (avgVelocity < elementState.options.velocityThreshold) {
      return false;
    }

    // Detecta colisões
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

    // Reproduz som
    if (options.soundEnabled && this.state.sound) {
      this.playCollisionSound(collision.velocity);
    }

    // Adiciona feedback visual
    if (options.visualFeedback) {
      this.addCollisionEffect(element, collision);
    }

    // Executa callback
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
    this.state.sound.play().catch(() => { });
  }

  addCollisionEffect(element, collision) {
    // Remove classes antigas
    element.classList.remove(
      'collision-horizontal',
      'collision-vertical',
      'collision-effect'
    );

    // Adiciona novas classes
    element.classList.add('collision-effect');

    if (collision.left || collision.right) {
      element.classList.add('collision-horizontal');
    }
    if (collision.top || collision.bottom) {
      element.classList.add('collision-vertical');
    }

    // Remove classes após animação
    setTimeout(() => {
      element.classList.remove(
        'collision-effect',
        'collision-horizontal',
        'collision-vertical'
      );
    }, 150);
  }

  // Métodos auxiliares
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