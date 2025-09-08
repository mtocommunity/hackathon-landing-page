/**
 * FeatureCard Component Types
 * Definiciones de tipos para el componente FeatureCard
 */

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
  variant?: 'default' | 'premium' | 'highlight';
  class?: string;
  clickable?: boolean;
  href?: string;
  animate?: boolean;
}

export type FeatureCardVariant = FeatureCardProps['variant'];

export interface FeatureCardState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  animationComplete: boolean;
}

export interface FeatureCardContent {
  icon: string;
  title: string;
  description: string;
}
