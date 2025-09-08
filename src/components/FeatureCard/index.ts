/**
 * FeatureCard Component - Barrel Export
 * Punto de entrada principal del componente FeatureCard
 */

export { default } from './FeatureCard.astro';
export type { 
  FeatureCardProps, 
  FeatureCardVariant, 
  FeatureCardState, 
  FeatureCardContent 
} from './FeatureCard.types';
export { 
  FeatureCardController, 
  createFeatureCardHandler, 
  FeatureCardAnimator 
} from './FeatureCard.logic';
