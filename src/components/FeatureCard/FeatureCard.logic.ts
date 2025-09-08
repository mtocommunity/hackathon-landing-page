/**
 * FeatureCard Component Logic
 * Lógica y utilidades para el componente FeatureCard
 */

import type { FeatureCardProps } from './FeatureCard.types';

export class FeatureCardController {
  /**
   * Genera las clases CSS para la feature card basado en las props
   */
  static generateClasses(props: FeatureCardProps): string {
    const { 
      variant = 'default',
      class: className = '',
      clickable = false,
      animate = true
    } = props;

    const classes = [
      'feature-card',
      `feature-card--${variant}`,
      clickable && 'feature-card--clickable',
      animate && 'feature-card--animate',
      className
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Genera el estilo de animación con delay
   */
  static generateAnimationStyle(delay: number = 0): string {
    return `animation-delay: ${delay * 0.1}s`;
  }

  /**
   * Determina el elemento contenedor (div o a)
   */
  static getContainerTag(href?: string): 'div' | 'a' {
    return href ? 'a' : 'div';
  }

  /**
   * Genera atributos para el contenedor
   */
  static getContainerAttributes(props: FeatureCardProps) {
    const { href, clickable, title } = props;
    
    const baseAttributes = {
      'data-component': 'feature-card',
      'data-variant': props.variant
    };

    if (href) {
      return {
        ...baseAttributes,
        href,
        'aria-label': `${title} - ${props.description}`,
        role: 'link'
      };
    }

    if (clickable) {
      return {
        ...baseAttributes,
        role: 'button',
        tabindex: 0,
        'aria-label': `${title} - ${props.description}`
      };
    }

    return baseAttributes;
  }

  /**
   * Valida el contenido de la feature card
   */
  static validateContent(props: FeatureCardProps): boolean {
    if (!props.icon.trim()) {
      console.warn('FeatureCard: Icon is required');
      return false;
    }

    if (!props.title.trim()) {
      console.warn('FeatureCard: Title is required');
      return false;
    }

    if (!props.description.trim()) {
      console.warn('FeatureCard: Description is required');
      return false;
    }

    return true;
  }

  /**
   * Sanitiza y procesa el contenido del icono
   */
  static processIcon(icon: string): string {
    // Simple sanitization - remove script tags and event handlers
    return icon
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }

  /**
   * Trunca la descripción si es muy larga
   */
  static truncateDescription(description: string, maxLength: number = 150): string {
    if (description.length <= maxLength) {
      return description;
    }
    
    return description.substring(0, maxLength).trim() + '...';
  }
}

/**
 * Hook para manejar interacciones de la feature card
 */
export function createFeatureCardHandler(element: HTMLElement) {
  const isClickable = element.classList.contains('feature-card--clickable') || 
                     element.tagName.toLowerCase() === 'a';
  
  let isPressed = false;
  let focusedByKeyboard = false;

  // Mouse interactions
  const handleMouseEnter = () => {
    element.classList.add('feature-card--hover');
    
    // Trigger hover animation on icon
    const icon = element.querySelector('.feature-card__icon');
    if (icon instanceof HTMLElement) {
      icon.classList.add('feature-card__icon--hover');
    }
  };

  const handleMouseLeave = () => {
    element.classList.remove('feature-card--hover', 'feature-card--pressed');
    isPressed = false;
    
    // Remove hover animation from icon
    const icon = element.querySelector('.feature-card__icon');
    if (icon instanceof HTMLElement) {
      icon.classList.remove('feature-card__icon--hover');
    }
  };

  const handleMouseDown = () => {
    if (isClickable) {
      isPressed = true;
      element.classList.add('feature-card--pressed');
    }
  };

  const handleMouseUp = () => {
    if (isClickable && isPressed) {
      isPressed = false;
      element.classList.remove('feature-card--pressed');
    }
  };

  // Keyboard interactions
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      isPressed = true;
      element.classList.add('feature-card--pressed');
      focusedByKeyboard = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      isPressed = false;
      element.classList.remove('feature-card--pressed');
      
      // Trigger click for space key, enter is handled by browser
      if (event.code === 'Space') {
        element.click();
      }
    }
  };

  // Focus handling
  const handleFocus = () => {
    if (focusedByKeyboard) {
      element.classList.add('feature-card--focus-visible');
    }
  };

  const handleBlur = () => {
    element.classList.remove('feature-card--focus-visible', 'feature-card--pressed');
    focusedByKeyboard = false;
    isPressed = false;
  };

  // Click handling
  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    // Emit custom event for feature card clicks
    const customEvent = new CustomEvent('featurecard:click', {
      detail: { 
        element,
        variant: element.dataset.variant,
        title: element.querySelector('.feature-card__title')?.textContent,
        originalEvent: event
      }
    });
    element.dispatchEvent(customEvent);
  };

  // Intersection Observer for entrance animation
  const observeEntrance = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('feature-card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(element);
    return observer;
  };

  // Attach event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  if (isClickable) {
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('keyup', handleKeyUp);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('click', handleClick);
  }

  // Setup entrance animation observer
  const entranceObserver = observeEntrance();

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
    
    entranceObserver.disconnect();
  };
}

/**
 * Utilidad para animar contadores o valores numéricos en feature cards
 */
export class FeatureCardAnimator {
  static animateNumber(
    element: HTMLElement,
    targetNumber: number,
    duration: number = 2000,
    startNumber: number = 0
  ) {
    let startTime: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startNumber + (targetNumber - startNumber) * easeOut);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = targetNumber.toLocaleString();
      }
    };
    
    requestAnimationFrame(animate);
  }

  static fadeInUp(element: HTMLElement, delay: number = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }
}
