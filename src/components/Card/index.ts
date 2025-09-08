/**
 * Card Component - Barrel Export
 * Punto de entrada principal del componente Card
 */

export { default } from './Card.astro';
export type { CardProps, CardVariant, CardSize, CardState, CardAnimationConfig } from './Card.types';
export { CardController, createCardHandler, CardLoadingManager } from './Card.logic';
