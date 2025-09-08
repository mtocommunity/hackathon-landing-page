/**
 * Button Component Types
 * Definiciones de tipos para el componente Button
 */

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export type ButtonVariant = ButtonProps['variant'];
export type ButtonSize = ButtonProps['size'];
export type IconPosition = ButtonProps['iconPosition'];

export interface ButtonState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isLoading: boolean;
}
