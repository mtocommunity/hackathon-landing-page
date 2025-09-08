/**
 * ChallengeCard Component Types
 * Definiciones de tipos para el componente ChallengeCard
 */

import type { Challenge } from '../../types/retos';

export interface ChallengeCardProps {
  challenge: Challenge;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
  showExamples?: boolean;
  showPrizes?: boolean;
  showTags?: boolean;
  clickable?: boolean;
  class?: string;
}

export type ChallengeCardVariant = ChallengeCardProps['variant'];

export interface ChallengeCardState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isLoading: boolean;
}

export interface ChallengeCardActions {
  onSelect?: (challengeId: number) => void;
  onMoreInfo?: (challengeId: number) => void;
  onClick?: (challengeId: number) => void;
}

export interface ChallengeCardContent {
  title: string;
  description: string;
  category: string;
  requirements: string[];
  examples: string[];
  tags?: string[];
  icon: string;
}
