// ===== RETOS PAGE INTERACTIONS =====

class RetosPageManager {
  private challengeCards: NodeListOf<HTMLElement>;
  private timelineItems: NodeListOf<HTMLElement>;
  private selectedChallenge: number | null = null;

  constructor() {
    this.challengeCards = document.querySelectorAll('.challenge-card');
    this.timelineItems = document.querySelectorAll('.timeline-item');
    this.init();
  }

  private init(): void {
    this.setupChallengeCardInteractions();
    this.setupTimelineInteractions();
    this.setupScrollAnimations();
    this.setupKeyboardNavigation();
    this.loadSelectedChallenge();
  }

  private setupChallengeCardInteractions(): void {
    this.challengeCards.forEach((card, index) => {
      const selectButton = card.querySelector('[data-challenge-id]') as HTMLButtonElement;
      const moreInfoButton = card.querySelectorAll('[data-challenge-id]')[1] as HTMLButtonElement;
      
      if (selectButton) {
        selectButton.addEventListener('click', (e) => {
          e.preventDefault();
          const challengeId = parseInt(selectButton.dataset.challengeId || '0');
          this.selectChallenge(challengeId);
        });
      }
      
      if (moreInfoButton) {
        moreInfoButton.addEventListener('click', (e) => {
          e.preventDefault();
          const challengeId = parseInt(moreInfoButton.dataset.challengeId || '0');
          this.showChallengeDetails(challengeId);
        });
      }

      // Enhanced hover effects
      card.addEventListener('mouseenter', () => {
        this.highlightChallenge(index);
      });

      card.addEventListener('mouseleave', () => {
        this.removeHighlight(index);
      });

      // Touch support for mobile
      card.addEventListener('touchstart', () => {
        this.highlightChallenge(index);
      }, { passive: true });
    });
  }

  private setupTimelineInteractions(): void {
    this.timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.highlightTimelineItem(index);
      });

      // Add focus management
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `Evento ${index + 1} del cronograma`);
    });
  }

  private setupScrollAnimations(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger staggered animations for child elements
          const children = entry.target.querySelectorAll('[data-animate-delay]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll([
      '.challenge-card',
      '.timeline-item',
      '.stat-item',
      '.section-title',
      '.section-description'
    ].join(', '));

    animatableElements.forEach((el) => observer.observe(el));
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.navigateChallenge('prev');
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          this.navigateChallenge('next');
          break;
        case 'Enter':
        case ' ':
          if (document.activeElement?.classList.contains('challenge-card')) {
            e.preventDefault();
            const challengeId = this.getChallengeIdFromCard(document.activeElement as HTMLElement);
            if (challengeId) {
              this.selectChallenge(challengeId);
            }
          }
          break;
        case 'Escape':
          this.clearSelection();
          break;
      }
    });
  }

  private selectChallenge(challengeId: number): void {
    this.selectedChallenge = challengeId;
    
    // Update UI
    this.challengeCards.forEach((card) => {
      card.classList.remove('selected');
      const cardChallengeId = this.getChallengeIdFromCard(card);
      if (cardChallengeId === challengeId) {
        card.classList.add('selected');
        this.announceSelection(challengeId);
      }
    });

    // Store selection
    localStorage.setItem('selectedChallenge', challengeId.toString());

    // Dispatch custom event
    this.dispatchChallengeSelectedEvent(challengeId);

    // Show success feedback
    this.showSelectionFeedback(challengeId);
  }

  private showChallengeDetails(challengeId: number): void {
    const modal = this.createChallengeModal(challengeId);
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    // Focus management
    const closeButton = modal.querySelector('.modal__close') as HTMLElement;
    closeButton?.focus();
  }

  private createChallengeModal(challengeId: number): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'challenge-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-modal', 'true');
    
    modal.innerHTML = `
      <div class="modal__overlay" data-modal-close></div>
      <div class="modal__content">
        <header class="modal__header">
          <h2 id="modal-title" class="modal__title">Detalles del Reto</h2>
          <button class="modal__close" data-modal-close aria-label="Cerrar modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div class="modal__body">
          <div class="challenge-details-loading">
            <div class="loading-spinner"></div>
            <p>Cargando detalles del reto...</p>
          </div>
        </div>
      </div>
    `;

    // Setup modal interactions
    const closeElements = modal.querySelectorAll('[data-modal-close]');
    closeElements.forEach((el) => {
      el.addEventListener('click', () => {
        this.closeModal(modal);
      });
    });

    // Escape key to close
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
      }
    });

    // Load challenge details
    this.loadChallengeDetails(modal, challengeId);

    return modal;
  }

  private closeModal(modal: HTMLElement): void {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  private async loadChallengeDetails(modal: HTMLElement, challengeId: number): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const modalBody = modal.querySelector('.modal__body');
      if (modalBody) {
        modalBody.innerHTML = this.generateChallengeDetailsHTML(challengeId);
      }
    } catch (error) {
      console.error('Error loading challenge details:', error);
      const modalBody = modal.querySelector('.modal__body');
      if (modalBody) {
        modalBody.innerHTML = '<p class="error-message">Error al cargar los detalles. Intenta nuevamente.</p>';
      }
    }
  }

  private generateChallengeDetailsHTML(challengeId: number): string {
    // This would typically fetch from a service
    return `
      <div class="challenge-detail-content">
        <div class="challenge-meta">
          <span class="challenge-id">Reto #${challengeId}</span>
          <span class="challenge-difficulty">Dificultad: Alta</span>
        </div>
        
        <section class="detail-section">
          <h3>Tecnologías Recomendadas</h3>
          <div class="tech-stack">
            <span class="tech-tag">React</span>
            <span class="tech-tag">Node.js</span>
            <span class="tech-tag">MongoDB</span>
            <span class="tech-tag">TensorFlow</span>
          </div>
        </section>

        <section class="detail-section">
          <h3>Recursos Disponibles</h3>
          <ul class="resources-list">
            <li>📚 Documentación técnica</li>
            <li>🎥 Tutoriales en video</li>
            <li>👨‍💻 Sesiones de mentoría</li>
            <li>🛠️ APIs y herramientas</li>
          </ul>
        </section>

        <section class="detail-section">
          <h3>Criterios de Evaluación Detallados</h3>
          <div class="evaluation-criteria">
            <div class="criterion">
              <span class="criterion-name">Innovación</span>
              <span class="criterion-weight">30%</span>
            </div>
            <div class="criterion">
              <span class="criterion-name">Impacto</span>
              <span class="criterion-weight">25%</span>
            </div>
            <div class="criterion">
              <span class="criterion-name">Viabilidad</span>
              <span class="criterion-weight">25%</span>
            </div>
            <div class="criterion">
              <span class="criterion-name">Presentación</span>
              <span class="criterion-weight">20%</span>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  private highlightChallenge(index: number): void {
    this.challengeCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('highlighted');
      } else {
        card.classList.add('dimmed');
      }
    });
  }

  private removeHighlight(index: number): void {
    this.challengeCards.forEach((card) => {
      card.classList.remove('highlighted', 'dimmed');
    });
  }

  private highlightTimelineItem(index: number): void {
    this.timelineItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  private navigateChallenge(direction: 'prev' | 'next'): void {
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = Array.from(this.challengeCards).indexOf(activeElement);
    
    if (currentIndex === -1) return;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    nextIndex = Math.max(0, Math.min(nextIndex, this.challengeCards.length - 1));
    
    (this.challengeCards[nextIndex] as HTMLElement).focus();
  }

  private getChallengeIdFromCard(card: HTMLElement): number | null {
    const button = card.querySelector('[data-challenge-id]') as HTMLElement;
    return button ? parseInt(button.dataset.challengeId || '0') : null;
  }

  private loadSelectedChallenge(): void {
    const stored = localStorage.getItem('selectedChallenge');
    if (stored) {
      this.selectChallenge(parseInt(stored));
    }
  }

  private clearSelection(): void {
    this.selectedChallenge = null;
    this.challengeCards.forEach((card) => {
      card.classList.remove('selected');
    });
    localStorage.removeItem('selectedChallenge');
  }

  private announceSelection(challengeId: number): void {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Reto ${challengeId} seleccionado`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  private showSelectionFeedback(challengeId: number): void {
    const toast = document.createElement('div');
    toast.className = 'toast toast--success';
    toast.innerHTML = `
      <div class="toast__icon">✅</div>
      <div class="toast__message">
        <strong>¡Reto seleccionado!</strong>
        <p>Has elegido el Reto #${challengeId}</p>
      </div>
      <button class="toast__close" aria-label="Cerrar notificación">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('toast--removing');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Manual close
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn?.addEventListener('click', () => {
      toast.classList.add('toast--removing');
      setTimeout(() => toast.remove(), 300);
    });
  }

  private dispatchChallengeSelectedEvent(challengeId: number): void {
    const event = new CustomEvent('challengeSelected', {
      detail: { challengeId },
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  // Public methods for external interaction
  public selectChallengeById(challengeId: number): void {
    this.selectChallenge(challengeId);
  }

  public getSelectedChallenge(): number | null {
    return this.selectedChallenge;
  }

  public highlightChallengeById(challengeId: number): void {
    const card = Array.from(this.challengeCards).find(card => 
      this.getChallengeIdFromCard(card) === challengeId
    );
    
    if (card) {
      const index = Array.from(this.challengeCards).indexOf(card);
      this.highlightChallenge(index);
    }
  }
}

// Smooth scrolling utility
class SmoothScroll {
  public static scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  public static scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const retosManager = new RetosPageManager();
  
  // Make manager globally available
  (window as any).retosManager = retosManager;
  (window as any).smoothScroll = SmoothScroll;
  
  // Add scroll-to-top button
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '↑';
  scrollButton.setAttribute('aria-label', 'Volver arriba');
  scrollButton.addEventListener('click', () => SmoothScroll.scrollToTop());
  
  document.body.appendChild(scrollButton);
  
  // Show/hide scroll button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });
});

// Export for potential module use
export { RetosPageManager, SmoothScroll };
