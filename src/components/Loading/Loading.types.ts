/**
 * Loading Component Types
 * Definiciones de tipos para el componente Loading
 */

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'dots' | 'pulse' | 'wave';
  text?: string;
  class?: string;
  fullscreen?: boolean;
  overlay?: boolean;
  progress?: number; // 0-100 for progress indicators
}

export type LoadingSize = LoadingProps['size'];
export type LoadingVariant = LoadingProps['variant'];

export interface LoadingState {
  isVisible: boolean;
  progress: number;
  text: string;
}

export interface LoadingConfig {
  duration: number;
  easing: string;
  direction: 'normal' | 'reverse' | 'alternate';
}
