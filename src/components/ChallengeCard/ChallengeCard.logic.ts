/**
 * ChallengeCard Component Logic
 * Lógica y utilidades para el componente ChallengeCard
 */

import type { ChallengeCardProps, ChallengeCardActions } from './ChallengeCard.types';
import type { Challenge } from '../../types/retos';

export class ChallengeCardController {
  /**
   * Genera las clases CSS para la challenge card basado en las props
   */
  static generateClasses(props: ChallengeCardProps): string {
    const { 
      variant = 'default',
      class: className = '',
      clickable = false
    } = props;

    const classes = [
      'challenge-card',
      `challenge-card--${variant}`,
      clickable && 'challenge-card--clickable',
      className
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Genera el estilo de animación con delay escalonado
   */
  static generateAnimationStyle(index: number = 0): string {
    const delay = index * 0.2;
    return `animation-delay: ${delay}s`;
  }

  /**
   * Genera atributos para la challenge card
   */
  static generateAttributes(props: ChallengeCardProps) {
    return {
      'data-component': 'challenge-card',
      'data-variant': props.variant,
      'data-challenge-id': props.challenge.id.toString(),
      'data-category': props.challenge.category,
      role: props.clickable ? 'button' : undefined,
      tabindex: props.clickable ? 0 : undefined,
      'aria-label': props.clickable ? `Seleccionar reto: ${props.challenge.title}` : undefined
    };
  }

  /**
   * Valida el contenido de la challenge
   */
  static validateChallenge(challenge: Challenge): boolean {
    const requiredFields = ['id', 'title', 'description', 'category', 'requirements'];
    
    for (const field of requiredFields) {
      if (!challenge[field as keyof Challenge]) {
        console.warn(`ChallengeCard: Missing required field '${field}' in challenge`);
        return false;
      }
    }

    if (challenge.requirements.length === 0) {
      console.warn('ChallengeCard: Challenge should have at least one requirement');
      return false;
    }

    return true;
  }

  /**
   * Procesa y sanitiza el contenido del challenge
   */
  static processChallenge(challenge: Challenge): Challenge {
    return {
      ...challenge,
      title: this.truncateText(challenge.title, 80),
      description: this.truncateText(challenge.description, 200),
      requirements: challenge.requirements.slice(0, 5), // Max 5 requirements
      examples: challenge.examples?.slice(0, 4) || [], // Max 4 examples
      tags: challenge.tags?.slice(0, 6) || [] // Max 6 tags
    };
  }

  /**
   * Trunca texto con elipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Genera el HTML para los badges de categoría
   */
  static generateCategoryBadge(category: string): string {
    const categoryClasses = `challenge__category challenge__category--${category.toLowerCase().replace(/\s+/g, '-')}`;
    return `<span class="${categoryClasses}" data-category="${category}">${category}</span>`;
  }

  /**
   * Genera el HTML para la lista de requirements
   */
  static generateRequirementsList(requirements: string[]): string {
    const items = requirements
      .map(req => `<li>${this.escapeHtml(req)}</li>`)
      .join('');
    
    return `<ul class="challenge__requirements-list">${items}</ul>`;
  }

  /**
   * Genera el HTML para los ejemplos
   */
  static generateExamples(examples: string[]): string {
    if (examples.length === 0) return '';
    
    const exampleItems = examples
      .map(example => `
        <div class="example-tag">
          ${this.escapeHtml(example)}
        </div>
      `)
      .join('');
    
    return `
      <section class="challenge__examples">
        <h4>Ideas de Soluciones</h4>
        <div class="examples-grid">
          ${exampleItems}
        </div>
      </section>
    `;
  }

  /**
   * Genera el HTML para los tags tecnológicos
   */
  static generateTechTags(tags: string[]): string {
    if (tags.length === 0) return '';
    
    const tagItems = tags
      .map(tag => `
        <span class="tech-tag" data-tag="${tag}">
          ${this.escapeHtml(tag)}
        </span>
      `)
      .join('');
    
    return `
      <section class="challenge__tags">
        <div class="tags-grid">
          ${tagItems}
        </div>
      </section>
    `;
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Calcula el color del icono basado en la categoría
   */
  static getCategoryColor(category: string): string {
    const colors = {
      'Desarrollo Web': '#3b82f6',
      'Inteligencia Artificial': '#8b5cf6',
      'Blockchain': '#ec4899',
      'IoT': '#14b8a6',
      'Ciberseguridad': '#f59e0b',
      'Data Science': '#10b981',
      'Mobile': '#6366f1',
      'Gaming': '#ef4444'
    };
    
    return colors[category as keyof typeof colors] || '#3b82f6';
  }
}

/**
 * Hook para manejar interacciones de la challenge card
 */
export function createChallengeCardHandler(element: HTMLElement, actions: ChallengeCardActions = {}) {
  const challengeId = parseInt(element.dataset.challengeId || '0');
  const isClickable = element.classList.contains('challenge-card--clickable');
  
  let isPressed = false;
  let focusedByKeyboard = false;

  // Mouse interactions
  const handleMouseEnter = () => {
    element.classList.add('challenge-card--hover');
  };

  const handleMouseLeave = () => {
    element.classList.remove('challenge-card--hover', 'challenge-card--pressed');
    isPressed = false;
  };

  const handleMouseDown = () => {
    if (isClickable) {
      isPressed = true;
      element.classList.add('challenge-card--pressed');
    }
  };

  const handleMouseUp = () => {
    if (isClickable && isPressed) {
      isPressed = false;
      element.classList.remove('challenge-card--pressed');
    }
  };

  // Keyboard interactions
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      isPressed = true;
      element.classList.add('challenge-card--pressed');
      focusedByKeyboard = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!isClickable) return;

    if (event.code === 'Space' || event.code === 'Enter') {
      isPressed = false;
      element.classList.remove('challenge-card--pressed');
      
      if (event.code === 'Space') {
        element.click();
      }
    }
  };

  // Focus handling
  const handleFocus = () => {
    if (focusedByKeyboard) {
      element.classList.add('challenge-card--focus-visible');
    }
  };

  const handleBlur = () => {
    element.classList.remove('challenge-card--focus-visible', 'challenge-card--pressed');
    focusedByKeyboard = false;
    isPressed = false;
  };

  // Button click handlers
  const handleSelectClick = (event: Event) => {
    event.stopPropagation();
    actions.onSelect?.(challengeId);
    
    // Visual feedback
    element.classList.add('challenge-card--selected');
    setTimeout(() => {
      element.classList.remove('challenge-card--selected');
    }, 2000);
  };

  const handleMoreInfoClick = (event: Event) => {
    event.stopPropagation();
    actions.onMoreInfo?.(challengeId);
  };

  // Card click handler
  const handleCardClick = (event: MouseEvent) => {
    if (isClickable) {
      actions.onClick?.(challengeId);
      
      // Emit custom event
      const customEvent = new CustomEvent('challengecard:click', {
        detail: { 
          challengeId,
          element,
          variant: element.dataset.variant,
          category: element.dataset.category,
          originalEvent: event
        }
      });
      element.dispatchEvent(customEvent);
    }
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
    element.addEventListener('click', handleCardClick);
  }

  // Button event listeners
  const selectBtn = element.querySelector('[data-action="select"]');
  const moreInfoBtn = element.querySelector('[data-action="more-info"]');
  
  if (selectBtn) {
    selectBtn.addEventListener('click', handleSelectClick);
  }
  
  if (moreInfoBtn) {
    moreInfoBtn.addEventListener('click', handleMoreInfoClick);
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
    element.removeEventListener('click', handleCardClick);
    
    if (selectBtn) {
      selectBtn.removeEventListener('click', handleSelectClick);
    }
    
    if (moreInfoBtn) {
      moreInfoBtn.removeEventListener('click', handleMoreInfoClick);
    }
  };
}

/**
 * Utilidad para filtrar y buscar challenges
 */
export class ChallengeCardFilter {
  static filterByCategory(challenges: Challenge[], category: string): Challenge[] {
    if (!category) return challenges;
    return challenges.filter(challenge => 
      challenge.category.toLowerCase() === category.toLowerCase()
    );
  }

  static searchByText(challenges: Challenge[], query: string): Challenge[] {
    if (!query) return challenges;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return challenges.filter(challenge => {
      const searchContent = [
        challenge.title,
        challenge.description,
        challenge.category,
        ...challenge.requirements,
        ...(challenge.examples || []),
        ...(challenge.tags || [])
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchContent.includes(term));
    });
  }

  static sortChallenges(challenges: Challenge[], sortBy: 'title' | 'category' | 'difficulty'): Challenge[] {
    return [...challenges].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'difficulty':
          // Assuming challenges have a difficulty property
          const difficultyOrder = ['Fácil', 'Medio', 'Difícil'];
          const aDiff = difficultyOrder.indexOf((a as any).difficulty || 'Medio');
          const bDiff = difficultyOrder.indexOf((b as any).difficulty || 'Medio');
          return aDiff - bDiff;
        default:
          return 0;
      }
    });
  }
}
