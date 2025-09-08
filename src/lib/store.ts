// Store para manejar datos en memoria de la aplicación
// Usando localStorage para persistencia básica

export interface TeamMember {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  dni: string;
  universidad: string;
  ciclo: string;
  isLeader: boolean;
}

export interface Team {
  id: string;
  nombreEquipo: string;
  miembros: TeamMember[];
  fechaInscripcion: Date;
  status: 'pendiente' | 'confirmado' | 'rechazado';
}

export interface StaffMember {
  id: string;
  nombre: string;
  apellidos: string;
  cargo: string;
  area: string;
  bio: string;
  imagen: string;
  redes: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  especialidades: string[];
}

// Store class para manejar el estado
class AppStore {
  private teams: Team[] = [];
  private staff: StaffMember[] = [];
  
  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  // Métodos para Teams
  getTeams(): Team[] {
    return this.teams;
  }

  addTeam(team: Omit<Team, 'id' | 'fechaInscripcion' | 'status'>): Team {
    const newTeam: Team = {
      ...team,
      id: this.generateId(),
      fechaInscripcion: new Date(),
      status: 'pendiente'
    };
    
    this.teams.push(newTeam);
    this.saveToStorage();
    return newTeam;
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(team => team.id === id);
  }

  updateTeamStatus(id: string, status: Team['status']): boolean {
    const team = this.getTeamById(id);
    if (team) {
      team.status = status;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteTeam(id: string): boolean {
    const index = this.teams.findIndex(team => team.id === id);
    if (index !== -1) {
      this.teams.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Métodos para Staff
  getStaff(): StaffMember[] {
    return this.staff;
  }

  addStaffMember(member: Omit<StaffMember, 'id'>): StaffMember {
    const newMember: StaffMember = {
      ...member,
      id: this.generateId()
    };
    
    this.staff.push(newMember);
    this.saveToStorage();
    return newMember;
  }

  getStaffById(id: string): StaffMember | undefined {
    return this.staff.find(member => member.id === id);
  }

  updateStaffMember(id: string, updates: Partial<Omit<StaffMember, 'id'>>): boolean {
    const member = this.getStaffById(id);
    if (member) {
      Object.assign(member, updates);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteStaffMember(id: string): boolean {
    const index = this.staff.findIndex(member => member.id === id);
    if (index !== -1) {
      this.staff.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Validaciones
  validateTeam(team: Omit<Team, 'id' | 'fechaInscripcion' | 'status'>): string[] {
    const errors: string[] = [];

    if (!team.nombreEquipo || team.nombreEquipo.trim().length < 3) {
      errors.push('El nombre del equipo debe tener al menos 3 caracteres');
    }

    if (team.miembros.length < 4 || team.miembros.length > 6) {
      errors.push('El equipo debe tener entre 4 y 6 integrantes');
    }

    const leaders = team.miembros.filter(m => m.isLeader);
    if (leaders.length !== 1) {
      errors.push('El equipo debe tener exactamente un líder');
    }

    team.miembros.forEach((member, index) => {
      const memberErrors = this.validateTeamMember(member);
      memberErrors.forEach(error => {
        errors.push(`Miembro ${index + 1}: ${error}`);
      });
    });

    // Verificar emails únicos
    const emails = team.miembros.map(m => m.email.toLowerCase());
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      errors.push('Todos los emails deben ser únicos');
    }

    // Verificar DNIs únicos
    const dnis = team.miembros.map(m => m.dni);
    const uniqueDnis = new Set(dnis);
    if (dnis.length !== uniqueDnis.size) {
      errors.push('Todos los DNIs deben ser únicos');
    }

    return errors;
  }

  validateTeamMember(member: TeamMember): string[] {
    const errors: string[] = [];

    if (!member.nombres || member.nombres.trim().length < 2) {
      errors.push('Los nombres son requeridos (mínimo 2 caracteres)');
    }

    if (!member.apellidos || member.apellidos.trim().length < 2) {
      errors.push('Los apellidos son requeridos (mínimo 2 caracteres)');
    }

    if (!member.telefono || !/^\+?[\d\s-()]{8,15}$/.test(member.telefono)) {
      errors.push('El teléfono debe tener un formato válido');
    }

    if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      errors.push('El email debe tener un formato válido');
    }

    if (!member.dni || !/^\d{8}$/.test(member.dni)) {
      errors.push('El DNI debe tener 8 dígitos');
    }

    if (!member.universidad || member.universidad.trim().length < 3) {
      errors.push('La universidad es requerida');
    }

    if (!member.ciclo || !/^\d+$/.test(member.ciclo) || parseInt(member.ciclo) < 1 || parseInt(member.ciclo) > 12) {
      errors.push('El ciclo debe ser un número entre 1 y 12');
    }

    return errors;
  }

  // Estadísticas
  getStats() {
    const totalTeams = this.teams.length;
    const totalParticipants = this.teams.reduce((sum, team) => sum + team.miembros.length, 0);
    const confirmedTeams = this.teams.filter(team => team.status === 'confirmado').length;
    const pendingTeams = this.teams.filter(team => team.status === 'pendiente').length;

    const universidades = new Set();
    this.teams.forEach(team => {
      team.miembros.forEach(member => {
        universidades.add(member.universidad);
      });
    });

    return {
      totalTeams,
      totalParticipants,
      confirmedTeams,
      pendingTeams,
      totalUniversities: universidades.size,
      staffMembers: this.staff.length
    };
  }

  // Métodos privados
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mto_hackathon_teams', JSON.stringify(this.teams));
        localStorage.setItem('mto_hackathon_staff', JSON.stringify(this.staff));
      } catch (error) {
        console.warn('No se pudo guardar en localStorage:', error);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const teamsData = localStorage.getItem('mto_hackathon_teams');
        const staffData = localStorage.getItem('mto_hackathon_staff');
        
        if (teamsData) {
          this.teams = JSON.parse(teamsData);
          // Convertir fechas de string a Date
          this.teams.forEach(team => {
            team.fechaInscripcion = new Date(team.fechaInscripcion);
          });
        }
        
        if (staffData) {
          this.staff = JSON.parse(staffData);
        }
      } catch (error) {
        console.warn('No se pudo cargar desde localStorage:', error);
      }
    }
  }

  private initializeDefaultData(): void {
    // Inicializar datos del staff si no existen
    if (this.staff.length === 0) {
      this.staff = [
        {
          id: 'staff_001',
          nombre: 'Luis',
          apellidos: 'García Mendoza',
          cargo: 'Director General',
          area: 'Dirección',
          bio: 'Ingeniero de Sistemas con más de 10 años de experiencia en organización de eventos tecnológicos. Fundador de la comunidad Many To One.',
          imagen: '/images/staff/luis-garcia.jpg',
          redes: {
            linkedin: '#',
            twitter: '#',
            github: '#'
          },
          especialidades: ['Gestión de Eventos', 'Liderazgo', 'Estrategia']
        },
        {
          id: 'staff_002',
          nombre: 'María',
          apellidos: 'Rodríguez Silva',
          cargo: 'Coordinadora de Logística',
          area: 'Operaciones',
          bio: 'Especialista en logística de eventos con experiencia en hackathons internacionales. Encargada de que todo funcione perfectamente.',
          imagen: '/images/staff/maria-rodriguez.jpg',
          redes: {
            linkedin: '#',
            instagram: '#'
          },
          especialidades: ['Logística', 'Coordinación', 'Gestión de Recursos']
        },
        {
          id: 'staff_003',
          nombre: 'Carlos',
          apellidos: 'Fernández Torres',
          cargo: 'Lead Developer',
          area: 'Tecnología',
          bio: 'Desarrollador Full Stack especializado en arquitecturas cloud. Responsable de la infraestructura tecnológica del evento.',
          imagen: '/images/staff/carlos-fernandez.jpg',
          redes: {
            github: '#',
            linkedin: '#',
            twitter: '#'
          },
          especialidades: ['Full Stack', 'Cloud Architecture', 'DevOps']
        },
        {
          id: 'staff_004',
          nombre: 'Ana',
          apellidos: 'Martínez López',
          cargo: 'Community Manager',
          area: 'Marketing',
          bio: 'Especialista en comunicación digital y gestión de comunidades tech. Encargada de mantener conectada a nuestra comunidad.',
          imagen: '/images/staff/ana-martinez.jpg',
          redes: {
            instagram: '#',
            twitter: '#',
            linkedin: '#'
          },
          especialidades: ['Marketing Digital', 'Comunidades', 'Redes Sociales']
        },
        {
          id: 'staff_005',
          nombre: 'Diego',
          apellidos: 'Vargas Herrera',
          cargo: 'Mentor Técnico',
          area: 'Mentoría',
          bio: 'Ingeniero de Software con experiencia en startups tecnológicas. Mentor especializado en desarrollo ágil y arquitectura de software.',
          imagen: '/images/staff/diego-vargas.jpg',
          redes: {
            github: '#',
            linkedin: '#'
          },
          especialidades: ['Mentoring', 'Software Architecture', 'Agile']
        },
        {
          id: 'staff_006',
          nombre: 'Sofía',
          apellidos: 'Ramírez Castro',
          cargo: 'UX Design Lead',
          area: 'Diseño',
          bio: 'Diseñadora UX/UI con enfoque en design thinking. Lidera los workshops de diseño centrado en el usuario durante el evento.',
          imagen: '/images/staff/sofia-ramirez.jpg',
          redes: {
            linkedin: '#',
            instagram: '#'
          },
          especialidades: ['UX Design', 'Design Thinking', 'Prototipado']
        }
      ];
      this.saveToStorage();
    }
  }

  // Método para resetear datos (útil para desarrollo)
  reset(): void {
    this.teams = [];
    this.staff = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mto_hackathon_teams');
      localStorage.removeItem('mto_hackathon_staff');
    }
    this.initializeDefaultData();
  }
}

// Instancia global del store
export const store = new AppStore();

// Funciones helper para uso en componentes
export const useTeams = () => ({
  getAll: () => store.getTeams(),
  add: (team: Omit<Team, 'id' | 'fechaInscripcion' | 'status'>) => store.addTeam(team),
  getById: (id: string) => store.getTeamById(id),
  updateStatus: (id: string, status: Team['status']) => store.updateTeamStatus(id, status),
  delete: (id: string) => store.deleteTeam(id),
  validate: (team: Omit<Team, 'id' | 'fechaInscripcion' | 'status'>) => store.validateTeam(team)
});

export const useStaff = () => ({
  getAll: () => store.getStaff(),
  add: (member: Omit<StaffMember, 'id'>) => store.addStaffMember(member),
  getById: (id: string) => store.getStaffById(id),
  update: (id: string, updates: Partial<Omit<StaffMember, 'id'>>) => store.updateStaffMember(id, updates),
  delete: (id: string) => store.deleteStaffMember(id)
});

export const useStats = () => store.getStats();
