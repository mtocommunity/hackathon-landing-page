/**
 * Loading Component Logic
 * Lógica y utilidades para el componente Loading
 */

import type { LoadingProps, LoadingConfig } from './Loading.types';

export class LoadingController {
  /**
   * Genera las clases CSS para el loading basado en las props
   */
  static generateClasses(props: LoadingProps): string {
    const {
      size = 'md',
      variant = 'primary',
      class: className = '',
      fullscreen = false,
      overlay = false
    } = props;

    const classes = [
      'loader',
      `loader--${size}`,
      `loader--${variant}`,
      fullscreen && 'loader--fullscreen',
      overlay && 'loader--overlay',
      className
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Genera atributos para el componente loading
   */
  static generateAttributes(props: LoadingProps) {
    return {
      'data-component': 'loading',
      'data-variant': props.variant,
      'data-size': props.size,
      'aria-label': props.text || 'Cargando contenido',
      'role': 'status',
      'aria-live': 'polite'
    };
  }

  /**
   * Valida las props del loading
   */
  static validateProps(props: LoadingProps): boolean {
    if (props.progress !== undefined) {
      if (props.progress < 0 || props.progress > 100) {
        console.warn('Loading: Progress should be between 0 and 100');
        return false;
      }
    }

    return true;
  }

  /**
   * Obtiene la configuración de animación para cada variante
   */
  static getAnimationConfig(variant?: LoadingProps['variant']): LoadingConfig {
    const configs: Record<string, LoadingConfig> = {
      primary: {
        duration: 1200,
        easing: 'linear',
        direction: 'normal'
      },
      secondary: {
        duration: 1500,
        easing: 'ease-in-out',
        direction: 'normal'
      },
      dots: {
        duration: 1400,
        easing: 'ease-in-out',
        direction: 'normal'
      },
      pulse: {
        duration: 2000,
        easing: 'ease-in-out',
        direction: 'alternate'
      },
      wave: {
        duration: 1600,
        easing: 'ease-in-out',
        direction: 'normal'
      }
    };

    return configs[variant || 'primary'];
  }

  /**
   * Genera el contenido HTML específico para cada variante
   */
  static generateSpinnerContent(variant: LoadingProps['variant'] = 'primary'): string {
    switch (variant) {
      case 'primary':
        return `
          <div class="loader__spinner">
            <div class="loader__circle"></div>
          </div>
        `;

      case 'secondary':
        return `
          <div class="loader__spinner">
            <div class="loader__ring"></div>
            <div class="loader__ring"></div>
          </div>
        `;

      case 'dots':
        return `
          <div class="loader__dots">
            <div class="loader__dot"></div>
            <div class="loader__dot"></div>
            <div class="loader__dot"></div>
          </div>
        `;

      case 'pulse':
        return `
          <div class="loader__pulse">
            <div class="loader__pulse-ring"></div>
            <div class="loader__pulse-ring"></div>
            <div class="loader__pulse-ring"></div>
          </div>
        `;

      case 'wave':
        return `
          <div class="loader__wave">
            <div class="loader__wave-bar"></div>
            <div class="loader__wave-bar"></div>
            <div class="loader__wave-bar"></div>
            <div class="loader__wave-bar"></div>
            <div class="loader__wave-bar"></div>
          </div>
        `;

      default:
        return this.generateSpinnerContent('primary');
    }
  }
}

/**
 * Clase para manejar múltiples instancias de loading
 */
export class LoadingManager {
  private static instances = new Map<string, HTMLElement>();
  private static globalOverlay: HTMLElement | null = null;

  /**
   * Muestra un loading con ID único
   */
  static show(id: string, props: LoadingProps): HTMLElement {
    const existing = this.instances.get(id);
    if (existing) {
      existing.style.display = 'flex';
      return existing;
    }

    const loader = this.createLoader(props);
    loader.dataset.loaderId = id;
    
    if (props.fullscreen || props.overlay) {
      document.body.appendChild(loader);
      this.globalOverlay = loader;
    }
    
    this.instances.set(id, loader);
    return loader;
  }

  /**
   * Oculta un loading por ID
   */
  static hide(id: string): boolean {
    const loader = this.instances.get(id);
    if (!loader) return false;

    loader.style.display = 'none';
    
    if (loader === this.globalOverlay) {
      loader.remove();
      this.globalOverlay = null;
    }
    
    this.instances.delete(id);
    return true;
  }

  /**
   * Oculta todos los loadings
   */
  static hideAll(): void {
    this.instances.forEach((loader, id) => {
      this.hide(id);
    });
  }

  /**
   * Actualiza el progreso de un loading
   */
  static updateProgress(id: string, progress: number): boolean {
    const loader = this.instances.get(id);
    if (!loader) return false;

    const progressBar = loader.querySelector('.loader__progress-bar');
    if (progressBar instanceof HTMLElement) {
      progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }

    const progressText = loader.querySelector('.loader__progress-text');
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }

    return true;
  }

  /**
   * Actualiza el texto de un loading
   */
  static updateText(id: string, text: string): boolean {
    const loader = this.instances.get(id);
    if (!loader) return false;

    const textElement = loader.querySelector('.loader__text');
    if (textElement) {
      textElement.textContent = text;
    }

    return true;
  }

  /**
   * Crea un elemento loader dinámicamente
   */
  private static createLoader(props: LoadingProps): HTMLElement {
    const classes = LoadingController.generateClasses(props);
    const attributes = LoadingController.generateAttributes(props);
    const spinnerContent = LoadingController.generateSpinnerContent(props.variant);

    const loader = document.createElement('div');
    loader.className = classes;
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        loader.setAttribute(key, String(value));
      }
    });

    loader.innerHTML = `
      ${spinnerContent}
      ${props.text ? `<p class="loader__text">${props.text}</p>` : ''}
      ${props.progress !== undefined ? `
        <div class="loader__progress">
          <div class="loader__progress-bar" style="width: ${props.progress}%"></div>
        </div>
        <span class="loader__progress-text">${Math.round(props.progress)}%</span>
      ` : ''}
    `;

    return loader;
  }
}

/**
 * Hook para manejar loading states en componentes
 */
export function createLoadingHandler(element: HTMLElement) {
  let isVisible = false;
  
  const show = () => {
    if (isVisible) return;
    
    isVisible = true;
    element.style.display = 'flex';
    element.classList.add('loader--visible');
    
    // Trigger entrance animation
    setTimeout(() => {
      element.classList.add('loader--animate-in');
    }, 10);
  };

  const hide = () => {
    if (!isVisible) return;
    
    isVisible = false;
    element.classList.add('loader--animate-out');
    
    setTimeout(() => {
      element.style.display = 'none';
      element.classList.remove('loader--visible', 'loader--animate-in', 'loader--animate-out');
    }, 300);
  };

  const toggle = () => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  };

  // Auto-hide después de cierto tiempo si tiene el atributo data-auto-hide
  const autoHideDelay = element.dataset.autoHide;
  if (autoHideDelay) {
    setTimeout(hide, parseInt(autoHideDelay));
  }

  return {
    show,
    hide,
    toggle,
    isVisible: () => isVisible
  };
}

/**
 * Utilidad para crear efectos de loading progresivo
 */
export class ProgressiveLoader {
  private element: HTMLElement;
  private currentProgress = 0;
  private targetProgress = 0;
  private animationId: number | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  setProgress(progress: number, animated = true): void {
    this.targetProgress = Math.max(0, Math.min(100, progress));
    
    if (!animated) {
      this.currentProgress = this.targetProgress;
      this.updateUI();
      return;
    }

    this.animateProgress();
  }

  private animateProgress(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const animate = () => {
      const diff = this.targetProgress - this.currentProgress;
      
      if (Math.abs(diff) < 0.1) {
        this.currentProgress = this.targetProgress;
        this.updateUI();
        return;
      }

      this.currentProgress += diff * 0.1;
      this.updateUI();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  private updateUI(): void {
    const progressBar = this.element.querySelector('.loader__progress-bar');
    if (progressBar instanceof HTMLElement) {
      progressBar.style.width = `${this.currentProgress}%`;
    }

    const progressText = this.element.querySelector('.loader__progress-text');
    if (progressText) {
      progressText.textContent = `${Math.round(this.currentProgress)}%`;
    }
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
