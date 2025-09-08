/**
 * Button Component - Barrel Export
 * Punto de entrada principal del componente Button
 */

export { default } from './Button.astro';
export type { ButtonProps, ButtonVariant, ButtonSize, IconPosition, ButtonState } from './Button.types';
export { ButtonController, createButtonHandler } from './Button.logic';
