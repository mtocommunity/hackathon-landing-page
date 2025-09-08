class RegistrationForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};
    this.teamSize = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadFormData();
  }

  bindEvents() {
    // Navegación entre pasos
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    // Envío del formulario
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });

    // Cambio en el tamaño del equipo
    const teamSizeSelect = document.getElementById('team-size');
    teamSizeSelect.addEventListener('change', (e) => {
      this.teamSize = parseInt(e.target.value) || 0;
      this.generateMemberForms();
    });

    // Auto-guardar datos
    inputs.forEach(input => {
      input.addEventListener('change', () => this.saveFormData());
    });

    // Navegación directa por pasos (click en indicador)
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      step.addEventListener('click', () => {
        const targetStep = index + 1;
        if (targetStep < this.currentStep || this.canNavigateToStep(targetStep)) {
          this.goToStep(targetStep);
        }
      });
    });
  }

  nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.hideStep(this.currentStep);
      this.currentStep++;
      this.showStep(this.currentStep);
      this.updateProgressIndicator();
      
      if (this.currentStep === 3) {
        this.generateMemberForms();
      }
      
      if (this.currentStep === 4) {
        this.generateConfirmationSummary();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.hideStep(this.currentStep);
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgressIndicator();
    }
  }

  showStep(step) {
    const stepElements = document.querySelectorAll('.form-step');
    stepElements.forEach(el => {
      el.classList.remove('active');
      el.classList.add('hidden');
    });
    
    const targetStep = document.querySelector(`[data-step="${step}"]`);
    if (targetStep) {
      targetStep.classList.remove('hidden');
      targetStep.classList.add('active');
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  hideStep(step) {
    const stepElement = document.querySelector(`[data-step="${step}"]`);
    if (stepElement) {
      stepElement.classList.remove('active');
      stepElement.classList.add('hidden');
    }
  }

  goToStep(targetStep) {
    if (targetStep >= 1 && targetStep <= this.totalSteps) {
      this.hideStep(this.currentStep);
      this.currentStep = targetStep;
      this.showStep(this.currentStep);
      this.updateProgressIndicator();
      
      if (this.currentStep === 3) {
        this.generateMemberForms();
      }
      
      if (this.currentStep === 4) {
        this.generateConfirmationSummary();
      }
    }
  }

  canNavigateToStep(targetStep) {
    // Permitir navegación hacia atrás siempre
    if (targetStep < this.currentStep) {
      return true;
    }
    
    // Para avanzar, validar todos los pasos anteriores
    for (let i = 1; i < targetStep; i++) {
      if (!this.validateStep(i)) {
        return false;
      }
    }
    
    return true;
  }

  updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index + 1;
      const numberEl = step.querySelector('.w-12');
      const labelEl = step.querySelector('span');
      
      // Reset classes
      step.classList.remove('active', 'completed');
      if (numberEl) {
        numberEl.className = 'w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center shadow-lg ring-4 ring-transparent group-hover:scale-110 transition-all duration-300';
      }
      
      if (stepNumber === this.currentStep) {
        step.classList.add('active');
        if (numberEl) {
          numberEl.classList.add('bg-gradient-to-br', 'from-magenta', 'to-pink-intense', 'text-white', 'ring-white/20');
        }
        if (labelEl) {
          labelEl.classList.add('text-magenta');
          labelEl.classList.remove('text-gray-500');
        }
      } else if (stepNumber < this.currentStep) {
        step.classList.add('completed');
        if (numberEl) {
          numberEl.classList.add('bg-gradient-to-br', 'from-cyan', 'to-aquamarine', 'text-white', 'ring-white/20');
        }
        if (labelEl) {
          labelEl.classList.add('text-cyan');
          labelEl.classList.remove('text-gray-500');
        }
      } else {
        if (numberEl) {
          numberEl.classList.add('bg-gray-200', 'text-gray-500');
        }
        if (labelEl) {
          labelEl.classList.add('text-gray-500');
          labelEl.classList.remove('text-magenta', 'text-cyan');
        }
      }
    });

    // Update progress line
    const progressLine = document.getElementById('progress-line');
    if (progressLine) {
      const progressPercentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      progressLine.style.width = `${progressPercentage}%`;
    }
  }

  validateStep(stepNumber) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (!stepElement) return true;
    
    const inputs = stepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateCurrentStep() {
    return this.validateStep(this.currentStep);
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';

    // Limpiar error previo
    this.clearError(field);

    // Validaciones específicas
    switch (type) {
      case 'email':
        if (!this.isValidEmail(value)) {
          errorMessage = 'Ingresa un email válido';
          isValid = false;
        }
        break;
        
      case 'tel':
        if (!this.isValidPhone(value)) {
          errorMessage = 'Ingresa un teléfono válido (8-15 dígitos)';
          isValid = false;
        }
        break;
        
      case 'text':
        if (name.includes('dni')) {
          if (!this.isValidDNI(value)) {
            errorMessage = 'El DNI debe tener exactamente 8 dígitos';
            isValid = false;
          }
        } else if (name.includes('name') || name.includes('Names') || name.includes('Surnames')) {
          if (value.length < 2) {
            errorMessage = 'Debe tener al menos 2 caracteres';
            isValid = false;
          }
        } else if (name.includes('team')) {
          if (value.length < 3) {
            errorMessage = 'El nombre del equipo debe tener al menos 3 caracteres';
            isValid = false;
          }
        }
        break;
    }

    // Validación de campo requerido
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'Este campo es requerido';
      isValid = false;
    }

    // Mostrar error si existe
    if (!isValid) {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  showError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.classList.add('error');
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    field.classList.remove('error');
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone);
  }

  isValidDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }

  generateMemberForms() {
    const container = document.getElementById('members-container');
    if (!container || !this.teamSize) return;

    container.innerHTML = '';

    for (let i = 1; i <= this.teamSize; i++) {
      const isLeader = i === 1;
      const memberDiv = this.createMemberForm(i, isLeader);
      container.appendChild(memberDiv);
    }

    // Pre-llenar datos del líder si existen
    this.fillLeaderData();
  }

  createMemberForm(memberNumber, isLeader) {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-card';
    memberDiv.innerHTML = `
      <div class="card" style="background: var(--gradient-card); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
        <div class="member-header">
          <div class="member-number">${memberNumber}</div>
          <h3 class="member-title">
            ${isLeader ? 'Líder del Equipo' : `Miembro ${memberNumber}`}
            ${isLeader ? '<span style="color: var(--accent-teal); font-size: var(--font-size-sm);"> (Datos pre-cargados)</span>' : ''}
          </h3>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="member-${memberNumber}-names" class="form-label">Nombres *</label>
            <input 
              type="text" 
              id="member-${memberNumber}-names" 
              name="member${memberNumber}Names" 
              class="form-input" 
              placeholder="Nombres completos"
              required
              ${isLeader ? 'readonly' : ''}
              minlength="2"
              maxlength="50"
            />
            <span class="form-error" id="member-${memberNumber}-names-error"></span>
          </div>

          <div class="form-group">
            <label for="member-${memberNumber}-surnames" class="form-label">Apellidos *</label>
            <input 
              type="text" 
              id="member-${memberNumber}-surnames" 
              name="member${memberNumber}Surnames" 
              class="form-input" 
              placeholder="Apellidos completos"
              required
              ${isLeader ? 'readonly' : ''}
              minlength="2"
              maxlength="50"
            />
            <span class="form-error" id="member-${memberNumber}-surnames-error"></span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="member-${memberNumber}-email" class="form-label">Correo Electrónico *</label>
            <input 
              type="email" 
              id="member-${memberNumber}-email" 
              name="member${memberNumber}Email" 
              class="form-input" 
              placeholder="correo@ejemplo.com"
              required
              ${isLeader ? 'readonly' : ''}
            />
            <span class="form-error" id="member-${memberNumber}-email-error"></span>
          </div>

          <div class="form-group">
            <label for="member-${memberNumber}-phone" class="form-label">Teléfono *</label>
            <input 
              type="tel" 
              id="member-${memberNumber}-phone" 
              name="member${memberNumber}Phone" 
              class="form-input" 
              placeholder="+51 999 888 777"
              required
              ${isLeader ? 'readonly' : ''}
              pattern="[+]?[\\d\\s\\-\\(\\)]{8,15}"
            />
            <span class="form-error" id="member-${memberNumber}-phone-error"></span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="member-${memberNumber}-dni" class="form-label">DNI *</label>
            <input 
              type="text" 
              id="member-${memberNumber}-dni" 
              name="member${memberNumber}Dni" 
              class="form-input" 
              placeholder="12345678"
              required
              ${isLeader ? 'readonly' : ''}
              pattern="\\d{8}"
              maxlength="8"
            />
            <span class="form-error" id="member-${memberNumber}-dni-error"></span>
          </div>

          <div class="form-group">
            <label for="member-${memberNumber}-cycle" class="form-label">Ciclo Académico *</label>
            <select 
              id="member-${memberNumber}-cycle" 
              name="member${memberNumber}Cycle" 
              class="form-select" 
              required
              ${isLeader ? 'disabled' : ''}
            >
              <option value="">Selecciona tu ciclo</option>
              <option value="1">1er Ciclo</option>
              <option value="2">2do Ciclo</option>
              <option value="3">3er Ciclo</option>
              <option value="4">4to Ciclo</option>
              <option value="5">5to Ciclo</option>
              <option value="6">6to Ciclo</option>
              <option value="7">7mo Ciclo</option>
              <option value="8">8vo Ciclo</option>
              <option value="9">9no Ciclo</option>
              <option value="10">10mo Ciclo</option>
              <option value="11">11vo Ciclo</option>
              <option value="12">12vo Ciclo</option>
              <option value="graduated">Egresado</option>
            </select>
            <span class="form-error" id="member-${memberNumber}-cycle-error"></span>
          </div>
        </div>

        <div class="form-group">
          <label for="member-${memberNumber}-university" class="form-label">Universidad *</label>
          <input 
            type="text" 
            id="member-${memberNumber}-university" 
            name="member${memberNumber}University" 
            class="form-input" 
            placeholder="Nombre de tu universidad"
            required
            ${isLeader ? 'readonly' : ''}
            minlength="3"
            maxlength="100"
          />
          <span class="form-error" id="member-${memberNumber}-university-error"></span>
        </div>
      </div>
    `;

    // Agregar event listeners a los nuevos campos
    const inputs = memberDiv.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (!input.readOnly && !input.disabled) {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
        input.addEventListener('change', () => this.saveFormData());
      }
    });

    return memberDiv;
  }

  fillLeaderData() {
    const leaderData = {
      names: document.getElementById('leader-names')?.value || '',
      surnames: document.getElementById('leader-surnames')?.value || '',
      email: document.getElementById('leader-email')?.value || '',
      phone: document.getElementById('leader-phone')?.value || '',
      dni: document.getElementById('leader-dni')?.value || '',
      cycle: document.getElementById('leader-cycle')?.value || '',
      university: document.getElementById('leader-university')?.value || ''
    };

    // Llenar datos del primer miembro (líder)
    if (leaderData.names) {
      document.getElementById('member-1-names').value = leaderData.names;
      document.getElementById('member-1-surnames').value = leaderData.surnames;
      document.getElementById('member-1-email').value = leaderData.email;
      document.getElementById('member-1-phone').value = leaderData.phone;
      document.getElementById('member-1-dni').value = leaderData.dni;
      document.getElementById('member-1-cycle').value = leaderData.cycle;
      document.getElementById('member-1-university').value = leaderData.university;
    }
  }

  generateConfirmationSummary() {
    const container = document.getElementById('confirmation-summary');
    if (!container) return;

    const formData = this.collectFormData();
    
    container.innerHTML = `
      <div class="card" style="background: var(--gradient-card); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-xl);">
        <h3 style="color: var(--accent-teal); margin-bottom: var(--spacing-lg);">Información del Equipo</h3>
        <div style="display: grid; gap: var(--spacing-md);">
          <p><strong>Nombre del Equipo:</strong> ${formData.teamName}</p>
          <p><strong>Categoría:</strong> ${this.getCategoryName(formData.category)}</p>
          <p><strong>Número de Integrantes:</strong> ${formData.teamSize}</p>
        </div>
      </div>

      <div class="card" style="background: var(--gradient-card); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-xl);">
        <h3 style="color: var(--accent-teal); margin-bottom: var(--spacing-lg);">Miembros del Equipo</h3>
        ${this.generateMembersSummary(formData)}
      </div>
    `;
  }

  generateMembersSummary(formData) {
    let html = '';
    
    for (let i = 1; i <= this.teamSize; i++) {
      const isLeader = i === 1;
      const member = formData[`member${i}`];
      
      if (member) {
        html += `
          <div style="margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: rgba(255,255,255,0.05); border-radius: var(--radius-sm); ${isLeader ? 'border-left: 4px solid var(--accent-teal);' : ''}">
            <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-sm);">
              ${isLeader ? '👑 ' : ''}${member.names} ${member.surnames} ${isLeader ? '(Líder)' : ''}
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--text-secondary);">
              <p><strong>Email:</strong> ${member.email}</p>
              <p><strong>Teléfono:</strong> ${member.phone}</p>
              <p><strong>DNI:</strong> ${member.dni}</p>
              <p><strong>Universidad:</strong> ${member.university}</p>
              <p><strong>Ciclo:</strong> ${this.getCycleName(member.cycle)}</p>
            </div>
          </div>
        `;
      }
    }
    
    return html;
  }

  getCategoryName(category) {
    const categories = {
      'sustainability': 'Sostenibilidad y Medio Ambiente',
      'inclusion': 'Inclusión Social y Accesibilidad',
      'education': 'Educación y Futuro del Trabajo'
    };
    return categories[category] || category;
  }

  getCycleName(cycle) {
    if (cycle === 'graduated') return 'Egresado';
    return `${cycle}° Ciclo`;
  }

  collectFormData() {
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);
    const data = {};

    // Datos básicos del equipo
    data.teamName = formData.get('teamName');
    data.category = formData.get('category');
    data.teamSize = parseInt(formData.get('teamSize'));

    // Datos de miembros
    for (let i = 1; i <= this.teamSize; i++) {
      data[`member${i}`] = {
        names: formData.get(`member${i}Names`),
        surnames: formData.get(`member${i}Surnames`),
        email: formData.get(`member${i}Email`),
        phone: formData.get(`member${i}Phone`),
        dni: formData.get(`member${i}Dni`),
        cycle: formData.get(`member${i}Cycle`),
        university: formData.get(`member${i}University`)
      };
    }

    return data;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateCurrentStep()) {
      return;
    }

    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    try {
      // Mostrar estado de carga
      submitBtn.textContent = 'Enviando';
      submitBtn.classList.add('loading');
      document.body.classList.add('loading-state');

      const formData = this.collectFormData();
      
      // Simular envío (aquí integrarías con tu API)
      await this.submitRegistration(formData);
      
      // Mostrar modal de éxito
      this.showSuccessModal(formData);
      
      // Limpiar datos guardados
      this.clearFormData();
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Hubo un error al enviar la inscripción. Por favor, inténtalo de nuevo.');
    } finally {
      // Restaurar estado del botón
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
      document.body.classList.remove('loading-state');
    }
  }

  async submitRegistration(formData) {
    // Aquí integrarías con tu backend o API
    // Por ahora simularemos con localStorage y una promesa
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simular guardado en "base de datos" (localStorage)
          const teams = JSON.parse(localStorage.getItem('mto_hackathon_teams') || '[]');
          
          const newTeam = {
            id: this.generateTeamId(),
            nombreEquipo: formData.teamName,
            categoria: formData.category,
            miembros: [],
            fechaInscripcion: new Date().toISOString(),
            status: 'pendiente'
          };

          // Convertir datos de miembros al formato esperado
          for (let i = 1; i <= formData.teamSize; i++) {
            const member = formData[`member${i}`];
            if (member) {
              newTeam.miembros.push({
                nombres: member.names,
                apellidos: member.surnames,
                telefono: member.phone,
                email: member.email,
                dni: member.dni,
                universidad: member.university,
                ciclo: member.cycle,
                isLeader: i === 1
              });
            }
          }

          teams.push(newTeam);
          localStorage.setItem('mto_hackathon_teams', JSON.stringify(teams));
          
          resolve({ teamId: newTeam.id });
        } catch (error) {
          reject(error);
        }
      }, 2000); // Simular latencia de red
    });
  }

  generateTeamId() {
    return 'MTO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  showSuccessModal(formData) {
    const modal = document.getElementById('success-modal');
    const teamIdElement = document.getElementById('team-id');
    
    // Generar ID del equipo
    const teamId = this.generateTeamId();
    teamIdElement.textContent = teamId;
    
    // Mostrar modal con animación
    modal.classList.remove('hidden');
    modal.classList.add('active');
    
    // Cerrar modal al hacer clic en el overlay
    const overlay = modal.querySelector('div[class*="absolute"]');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.hideSuccessModal();
      });
    }

    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
      this.hideSuccessModal();
    }, 10000);
  }

  hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
    modal.classList.add('hidden');
    
    // Limpiar datos guardados
    localStorage.removeItem('mto_hackathon_form_data');
  }

  saveFormData() {
    // Guardar progreso en localStorage para recuperación
    const formData = {};
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      if (input.value) {
        formData[input.name] = input.value;
      }
    });
    
    formData.currentStep = this.currentStep;
    formData.teamSize = this.teamSize;
    
    localStorage.setItem('mto_form_progress', JSON.stringify(formData));
  }

  loadFormData() {
    // Cargar progreso guardado
    const savedData = localStorage.getItem('mto_form_progress');
    if (!savedData) return;
    
    try {
      const formData = JSON.parse(savedData);
      
      // Restaurar valores de campos
      Object.keys(formData).forEach(key => {
        if (key !== 'currentStep' && key !== 'teamSize') {
          const field = document.querySelector(`[name="${key}"]`);
          if (field) {
            field.value = formData[key];
          }
        }
      });
      
      // Restaurar tamaño del equipo
      if (formData.teamSize) {
        this.teamSize = formData.teamSize;
      }
      
    } catch (error) {
      console.warn('Error al cargar datos guardados:', error);
    }
  }

  clearFormData() {
    localStorage.removeItem('mto_form_progress');
  }
}

// Inicializar formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationForm();
});
