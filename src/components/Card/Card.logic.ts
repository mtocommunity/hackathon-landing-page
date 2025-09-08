/**
 * Card Component Logic
 * Lógica y utilidades para el componente Card
 */

import type { CardProps, CardAnimationConfig } from './Card.types';

export class CardController {
  /**
   * Genera las clases CSS para la card basado en las props
   */
  static generateClasses(props: CardProps): string {
    const { 
      variant = 'default', 
      size = 'md', 
      class: className = '', 
      hoverable = false,
      clickable = false,
      loading = false,
      animate = false
    } = props;

    const classes = [
      'card',
      `card--${variant}`,
      `card--${size}`,
      hoverable && 'card--hoverable',
      clickable && 'card--clickable',
      loading && 'card--loading',
      animate && 'card--animate',
      className
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Determina si la card debe tener rol específico para accesibilidad
   */
  static getAccessibilityRole(props: CardProps): string | undefined {
    if (props.clickable) {
      return 'button';
    }
    return undefined;
  }

  /**
   * Genera atributos adicionales para la card
   */
  static getCardAttributes(props: CardProps) {
    const role = this.getAccessibilityRole(props);
    
    return {
      'data-component': 'card',
      'data-variant': props.variant,
      role,
      tabindex: props.clickable ? 0 : undefined,
      'aria-disabled': props.loading ? 'true' : undefined
    };
  }

  /**
   * Valida las props de la card
   */
  static validateProps(props: CardProps): boolean {
    // Warning si es clickable pero no tiene hover
    if (props.clickable && !props.hoverable) {
      console.warn('Card: Clickable cards should typically be hoverable for better UX.');
    }

    return true;
  }

  /**
   * Configura animaciones personalizadas
   */
  static getAnimationConfig(variant?: CardProps['variant']): CardAnimationConfig {
    const baseConfig = {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };

    switch (variant) {
      case 'glass':
        return { ...baseConfig, duration: 200 };
      case 'neon':
        return { ...baseConfig, duration: 400, easing: 'ease-out' };
      case 'premium':
        return { ...baseConfig, duration: 350 };
      default:
        return baseConfig;
    }
  }
}

/**
 * Hook para manejar interacciones de la card
 */
export function createCardHandler(element: HTMLElement) {
  const isClickable = element.classList.contains('card--clickable');
  const isHoverable = element.classList.contains('card--hoverable');
  
  let isPressed = false;
  let focusedByKeyboard = false;

  // Mouse interactions
  const handleMouseEnter = () => {
    if (isHoverable) {
      element.classList.add('card--hover');
    }
  };

  const handleMouseLeave = () => {
    if (isHoverable) {
      element.classList.remove('card--hover', 'card--pressed');
      isPressed = false;
    }
  };

  const handleMouseDown = () => {
    if (isClickable) {
      isPressed = true;
      element.classList.add('card--pressed');
    }
  };

  const handleMouseUp = () => {
    if (isClickable && isPressed) {
      isPressed = false;
      element.classList.remove('card--pressed');
    }
  };

  // Keyboard interactions
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      isPressed = true;
      element.classList.add('card--pressed');
      focusedByKeyboard = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      isPressed = false;
      element.classList.remove('card--pressed');
      
      // Trigger click event
      element.click();
    }
  };

  // Focus handling
  const handleFocus = (event: FocusEvent) => {
    if (focusedByKeyboard) {
      element.classList.add('card--focus-visible');
    }
  };

  const handleBlur = () => {
    element.classList.remove('card--focus-visible', 'card--pressed');
    focusedByKeyboard = false;
    isPressed = false;
  };

  // Click handling
  const handleClick = (event: MouseEvent) => {
    if (element.hasAttribute('aria-disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Emit custom event for card clicks
    const customEvent = new CustomEvent('card:click', {
      detail: { 
        element,
        variant: element.dataset.variant,
        originalEvent: event
      }
    });
    element.dispatchEvent(customEvent);
  };

  // Attach event listeners
  if (isHoverable) {
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
  }

  if (isClickable) {
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('keyup', handleKeyUp);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('click', handleClick);
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('mousedown', handleMouseDown);
    element.removeEventListener('mouseup', handleMouseUp);
    element.removeEventListener('keydown', handleKeyDown);
    element.removeEventListener('keyup', handleKeyUp);
    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('blur', handleBlur);
    element.removeEventListener('click', handleClick);
  };
}

/**
 * Utilidad para crear efectos de loading en cards
 */
export class CardLoadingManager {
  private static loadingCards = new Set<HTMLElement>();

  static setLoading(element: HTMLElement, isLoading: boolean) {
    if (isLoading) {
      element.classList.add('card--loading');
      element.setAttribute('aria-disabled', 'true');
      this.loadingCards.add(element);
    } else {
      element.classList.remove('card--loading');
      element.removeAttribute('aria-disabled');
      this.loadingCards.delete(element);
    }
  }

  static isLoading(element: HTMLElement): boolean {
    return this.loadingCards.has(element);
  }

  static getAllLoadingCards(): HTMLElement[] {
    return Array.from(this.loadingCards);
  }
}
