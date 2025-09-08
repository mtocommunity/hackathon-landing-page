/**
 * ChallengeCard Component - Barrel Export
 * Punto de entrada principal del componente ChallengeCard
 */

export { default } from './ChallengeCard.astro';
export type { 
  ChallengeCardProps, 
  ChallengeCardVariant, 
  ChallengeCardState, 
  ChallengeCardActions, 
  ChallengeCardContent 
} from './ChallengeCard.types';
export { 
  ChallengeCardController, 
  createChallengeCardHandler, 
  ChallengeCardFilter 
} from './ChallengeCard.logic';
