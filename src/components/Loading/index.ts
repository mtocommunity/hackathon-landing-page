/**
 * Loading Component - Barrel Export
 * Punto de entrada principal del componente Loading
 */

export { default } from './Loading.astro';
export type { 
  LoadingProps, 
  LoadingSize, 
  LoadingVariant, 
  LoadingState, 
  LoadingConfig 
} from './Loading.types';
export { 
  LoadingController, 
  LoadingManager, 
  createLoadingHandler, 
  ProgressiveLoader 
} from './Loading.logic';
