/**
 * Card Component Types
 * Definiciones de tipos para el componente Card
 */

export interface CardProps {
  variant?: 'default' | 'elevated' | 'inset' | 'glass' | 'neon' | 'glow' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  hoverable?: boolean;
  clickable?: boolean;
  style?: string;
  loading?: boolean;
  animate?: boolean;
}

export type CardVariant = CardProps['variant'];
export type CardSize = CardProps['size'];

export interface CardState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isLoading: boolean;
}

export interface CardAnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}
