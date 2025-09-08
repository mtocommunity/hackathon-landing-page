/**
 * Button Component Logic
 * Lógica y utilidades para el componente Button
 */

import type { ButtonProps } from './Button.types';

export class ButtonController {
  /**
   * Genera las clases CSS para el botón basado en las props
   */
  static generateClasses(props: ButtonProps): string {
    const { 
      variant = 'primary', 
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      class: className = '',
      icon,
      iconPosition = 'right'
    } = props;

    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      icon && `btn--with-icon`,
      icon && `btn--icon-${iconPosition}`,
      disabled && 'btn--disabled',
      loading && 'btn--loading',
      fullWidth && 'btn--full-width',
      className
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Determina si debe usar un elemento 'a' o 'button'
   */
  static getTagName(href?: string): 'a' | 'button' {
    return href ? 'a' : 'button';
  }

  /**
   * Genera las props específicas del elemento HTML
   */
  static getElementProps(props: ButtonProps) {
    const { href, type = 'button', disabled = false } = props;
    const isLink = !!href;

    if (isLink) {
      return {
        href,
        role: 'button',
        'aria-disabled': disabled ? 'true' : undefined,
        tabindex: disabled ? -1 : undefined
      };
    }

    return {
      type,
      disabled,
      'aria-disabled': disabled ? 'true' : undefined
    };
  }

  /**
   * Valida las props del botón
   */
  static validateProps(props: ButtonProps): boolean {
    // No puede ser link y disabled al mismo tiempo
    if (props.href && props.disabled) {
      console.warn('Button: Links cannot be disabled. Use aria-disabled instead.');
      return false;
    }

    // Loading state solo para buttons, no links
    if (props.href && props.loading) {
      console.warn('Button: Loading state not supported for links.');
      return false;
    }

    return true;
  }

  /**
   * Genera el contenido del icono
   */
  static renderIcon(icon?: string, position?: 'left' | 'right'): string {
    if (!icon) return '';
    
    return `<span class="btn__icon btn__icon--${position}" aria-hidden="true">${icon}</span>`;
  }
}

/**
 * Hook para manejar el estado del botón en el cliente
 */
export function createButtonHandler(element: HTMLElement) {
  let isPressed = false;

  const handleMouseDown = () => {
    isPressed = true;
    element.classList.add('btn--pressed');
  };

  const handleMouseUp = () => {
    isPressed = false;
    element.classList.remove('btn--pressed');
  };

  const handleMouseLeave = () => {
    isPressed = false;
    element.classList.remove('btn--pressed');
  };

  // Keyboard interactions
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      isPressed = true;
      element.classList.add('btn--pressed');
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'Space' || event.code === 'Enter') {
      isPressed = false;
      element.classList.remove('btn--pressed');
      
      // Trigger click for Space key
      if (event.code === 'Space') {
        element.click();
      }
    }
  };

  // Attach event listeners
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('keydown', handleKeyDown);
  element.addEventListener('keyup', handleKeyUp);

  // Return cleanup function
  return () => {
    element.removeEventListener('mousedown', handleMouseDown);
    element.removeEventListener('mouseup', handleMouseUp);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('keydown', handleKeyDown);
    element.removeEventListener('keyup', handleKeyUp);
  };
}
