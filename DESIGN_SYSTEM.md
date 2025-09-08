# MTO Hackathon 2025 - Diseño Neomórfico Moderno

## 🎨 Transformación Completa del Diseño

Este proyecto ha sido completamente rediseñado con un enfoque neomórfico moderno en **modo claro**, utilizando una paleta de colores tecnológica y elegante con efectos neon y animaciones avanzadas.

## ✨ Características Principales

### 🎯 Diseño Neomórfico
- **Modo claro** con sombras suaves y efectos de profundidad
- Elementos que parecen "salir" de la superficie
- Bordes suaves y transiciones elegantes
- Efectos de hover y estados interactivos

### 🌈 Paleta de Colores
- **Fondos**: Blancos y grises claros (`#f8fafc`, `#f1f5f9`, `#e2e8f0`)
- **Acentos**: Azul (`#3b82f6`), Púrpura (`#8b5cf6`), Rosa (`#ec4899`), Cian (`#06b6d4`)
- **Texto**: Grises oscuros para contraste (`#0f172a`, `#475569`, `#64748b`)

### 🚀 Sistema de Animaciones
- **Animaciones de entrada**: `slide-in-up`, `fade-in-scale`
- **Efectos hover**: `hover-lift`, `hover-glow`, `hover-shimmer`
- **Animaciones continuas**: `float`, `pulse-glow`, `gradient-shift`
- **Efectos neon**: Brillos y sombras de colores

### 📱 Componentes Modernos

#### Button.astro
- Diseño neomórfico con sombras profundas
- 4 variantes: `primary`, `secondary`, `outline`, `ghost`
- 3 tamaños: `sm`, `md`, `lg`
- Efectos de brillo interno y animaciones de pulso
- Estados de carga y disabled

#### Card.astro
- Múltiples variantes: `default`, `elevated`, `inset`, `glass`, `neon`
- Efectos de hover con elevación
- Bordes animados con gradientes
- Estados premium con efectos especiales

#### Header.astro
- Navegación fija con backdrop blur
- Menú móvil animado
- Botón CTA especial para inscripción
- Efectos de scroll dinámicos

#### FeatureCard.astro (Nuevo)
- Tarjetas especializadas para características
- 3 variantes: `default`, `premium`, `highlight`
- Iconos con efectos neomórficos
- Animaciones de entrada escalonadas

#### StatsGrid.astro (Nuevo)
- Grid responsive de estadísticas
- 3 variantes: `default`, `compact`, `featured`
- Efectos de glow y animaciones
- Iconos opcionales

#### Loading.astro (Nuevo)
- Indicador de carga animado
- Múltiples círculos con efectos
- Respeta `prefers-reduced-motion`

### 🎭 Efectos Especiales

#### Efectos de Glow y Neon
```css
--glow-blue: 0 0 30px rgba(59, 130, 246, 0.3);
--glow-purple: 0 0 30px rgba(139, 92, 246, 0.3);
--glow-pink: 0 0 30px rgba(236, 72, 153, 0.3);
```

#### Sombras Neomórficas
```css
--shadow-neumorphism: 
  20px 20px 40px rgba(15, 23, 42, 0.08),
  -20px -20px 40px rgba(255, 255, 255, 0.8);
```

#### Gradientes Tecnológicos
```css
--gradient-hero: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
--gradient-button: linear-gradient(135deg, #3b82f6, #8b5cf6);
```

### 📐 Sistema de Design Tokens

#### Espaciado Coherente
- Sistema de 8px base con múltiplos lógicos
- Desde `--spacing-px` (1px) hasta `--spacing-32` (8rem)

#### Tipografía Escalable
- Fuente principal: Inter con fallbacks del sistema
- Escalas de tamaño de `xs` (12px) a `7xl` (72px)
- Pesos de fuente de `thin` (100) a `black` (900)

#### Animaciones Optimizadas
- Curvas de animación personalizadas
- Duraciones coherentes
- Soporte para `prefers-reduced-motion`

### 🏗️ Arquitectura Clean Code

#### Separación de Responsabilidades
- **Componentes UI** reutilizables y modulares
- **Páginas** que componen componentes
- **Estilos globales** con sistema de tokens
- **Animaciones** centralizadas y consistentes

#### Principios SOLID Aplicados
- **Single Responsibility**: Cada componente tiene una función específica
- **Open/Closed**: Componentes extensibles via props
- **Liskov Substitution**: Variantes intercambiables
- **Interface Segregation**: Props específicas por componente
- **Dependency Inversion**: Componentes independientes

### 🎨 UX/UI Mejorado

#### Experiencia de Usuario
- Feedback visual inmediato en todas las interacciones
- Estados de loading y transiciones suaves
- Navegación intuitiva con indicadores visuales
- Responsive design para todos los dispositivos

#### Interfaz de Usuario
- Jerarquía visual clara con tipografía escalable
- Contraste optimizado para accesibilidad
- Espaciado consistente y ritmo vertical
- Elementos interactivos claramente identificables

### 🔧 Optimizaciones Técnicas

#### Performance
- CSS optimizado con variables nativas
- Animaciones con `transform` y `opacity`
- Lazy loading de animaciones
- Componentes ligeros y reutilizables

#### Accesibilidad
- Estados de focus visibles
- Soporte para `prefers-reduced-motion`
- Contraste de colores WCAG AA
- Navegación por teclado funcional

#### SEO y Semántica
- HTML semántico correcto
- Meta tags optimizados
- Estructura de headings lógica
- Enlaces descriptivos

## 🚀 Tecnologías Utilizadas

- **Astro**: Framework principal
- **TypeScript**: Tipado estático
- **CSS3**: Variables nativas, Grid, Flexbox
- **Animaciones CSS**: Keyframes y transiciones
- **Mobile First**: Diseño responsive

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: < 768px  
- **Desktop**: > 768px

### Adaptaciones
- Grid responsive con `auto-fit` y `minmax`
- Menú móvil con animaciones
- Tipografía escalable con `clamp()`
- Touch targets optimizados

## 🎯 Próximos Pasos

1. **Completar todas las páginas** con el nuevo diseño
2. **Agregar formularios** interactivos
3. **Implementar animaciones** de página completa
4. **Optimizar performance** con lazy loading
5. **Testing** en múltiples dispositivos

## 🔗 Enlaces Importantes

- **Desarrollo**: `http://localhost:4321/`
- **Documentación**: Este README
- **Componentes**: `/src/components/`
- **Páginas**: `/src/pages/`
- **Estilos**: `/src/styles/global.css`

---

**Desarrollado con ❤️ y mucha creatividad para MTO Hackathon 2025**
