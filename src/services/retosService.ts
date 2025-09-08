// ===== RETOS DATA SERVICE =====

import type { Challenge, TimelineEvent, ChallengeStats } from '../types/retos';

export class RetosService {
  private static instance: RetosService;

  public static getInstance(): RetosService {
    if (!RetosService.instance) {
      RetosService.instance = new RetosService();
    }
    return RetosService.instance;
  }

  public getChallenges(): Challenge[] {
    return [
      {
        id: 1,
        title: "Sostenibilidad y Medio Ambiente",
        description: "Desarrolla soluciones tecnológicas innovadoras para combatir el cambio climático, promover energías renovables, gestionar residuos de forma inteligente o crear sistemas para la conservación del medio ambiente.",
        category: "Green Tech",
        icon: "🌱",
        color: "var(--accent-teal)",
        requirements: [
          "Innovación tecnológica aplicada a la sostenibilidad",
          "Impacto medible en el medio ambiente",
          "Viabilidad técnica y económica",
          "Escalabilidad de la solución",
          "Uso de tecnologías emergentes (IoT, IA, Blockchain)"
        ],
        prizes: {
          first: "S/ 20,000",
          second: "S/ 12,000",
          third: "S/ 8,000"
        },
        examples: [
          "Sistema IoT para monitoreo de calidad del aire",
          "App para optimización de consumo energético",
          "Plataforma de gestión inteligente de residuos",
          "Solución blockchain para certificación de carbono",
          "IA para predicción de fenómenos climáticos"
        ],
        tags: ["IoT", "Energías Renovables", "Smart Cities", "Blockchain", "IA"],
        totalPrize: "S/ 40,000"
      },
      {
        id: 2,
        title: "Inclusión Social y Accesibilidad",
        description: "Crea tecnologías que promuevan la inclusión social, mejoren la accesibilidad para personas con discapacidades, reduzcan la brecha digital o fomenten la igualdad de oportunidades.",
        category: "Social Impact",
        icon: "🤝",
        color: "var(--accent-purple)",
        requirements: [
          "Enfoque en inclusión y accesibilidad",
          "Impacto social demostrable",
          "Diseño universal y usabilidad",
          "Potencial de adopción masiva",
          "Sostenibilidad del modelo de negocio"
        ],
        prizes: {
          first: "S/ 20,000",
          second: "S/ 12,000",
          third: "S/ 8,000"
        },
        examples: [
          "App de comunicación para personas con discapacidad auditiva",
          "Plataforma de empleo inclusivo",
          "Sistema de navegación para personas con discapacidad visual",
          "Herramientas de aprendizaje adaptativo",
          "Red social para comunidades marginadas"
        ],
        tags: ["Accesibilidad", "UX/UI", "Comunicación", "Empleo", "Educación"],
        totalPrize: "S/ 40,000"
      },
      {
        id: 3,
        title: "Educación y Futuro del Trabajo",
        description: "Revoluciona la educación con nuevas metodologías de aprendizaje, herramientas para el desarrollo de habilidades del futuro, o sistemas que preparen a las personas para los empleos de mañana.",
        category: "EdTech",
        icon: "🎓",
        color: "var(--accent-pink)",
        requirements: [
          "Innovación en metodologías educativas",
          "Enfoque en habilidades del siglo XXI",
          "Escalabilidad educativa",
          "Personalización del aprendizaje",
          "Integración con tecnologías emergentes"
        ],
        prizes: {
          first: "S/ 20,000",
          second: "S/ 12,000",
          third: "S/ 8,000"
        },
        examples: [
          "Plataforma de aprendizaje con IA personalizada",
          "Simulador VR/AR para entrenamiento profesional",
          "Sistema de certificación blockchain",
          "Marketplace de habilidades y mentorías",
          "Herramientas de assessment adaptativo"
        ],
        tags: ["EdTech", "IA", "VR/AR", "Blockchain", "Personalización"],
        totalPrize: "S/ 40,000"
      }
    ];
  }

  public getTimeline(): TimelineEvent[] {
    return [
      {
        id: 1,
        time: "Viernes 15 Dic",
        event: "Apertura y Presentación de Retos",
        hour: "18:00",
        description: "Ceremonia inaugural con presentación detallada de cada categoría",
        icon: "🚀"
      },
      {
        id: 2,
        time: "Viernes 15 Dic",
        event: "Formación de Equipos",
        hour: "19:30",
        description: "Networking y conformación de equipos multidisciplinarios",
        icon: "🤝"
      },
      {
        id: 3,
        time: "Viernes 15 Dic",
        event: "Inicio del Desarrollo",
        hour: "21:00",
        description: "¡Empieza la maratón de desarrollo de 48 horas!",
        icon: "⚡"
      },
      {
        id: 4,
        time: "Sábado 16 Dic",
        event: "Mentorías y Workshops",
        hour: "10:00",
        description: "Sesiones con expertos de la industria y workshops técnicos",
        icon: "🎓"
      },
      {
        id: 5,
        time: "Sábado 16 Dic",
        event: "Check-in de Avances",
        hour: "16:00",
        description: "Revisión de progreso y feedback de mentores",
        icon: "📊"
      },
      {
        id: 6,
        time: "Domingo 17 Dic",
        event: "Entrega de Proyectos",
        hour: "14:00",
        description: "Fecha límite para subir proyectos y documentación",
        icon: "📤"
      },
      {
        id: 7,
        time: "Domingo 17 Dic",
        event: "Presentaciones Finales",
        hour: "15:00",
        description: "Pitch de 5 minutos por equipo ante el jurado",
        icon: "🎤"
      },
      {
        id: 8,
        time: "Domingo 17 Dic",
        event: "Premiación y Clausura",
        hour: "18:00",
        description: "Anuncio de ganadores y ceremonia de clausura",
        icon: "🏆"
      }
    ];
  }

  public getStats(): ChallengeStats {
    return {
      totalPrize: "S/ 120,000",
      categories: 3,
      maxTeamSize: 6,
      duration: "48 horas"
    };
  }

  public getChallengeById(id: number): Challenge | undefined {
    return this.getChallenges().find(challenge => challenge.id === id);
  }

  public getChallengesByCategory(category: string): Challenge[] {
    return this.getChallenges().filter(challenge => 
      challenge.category.toLowerCase().includes(category.toLowerCase())
    );
  }
}
