// ===== RETOS DATA TYPES =====

export interface Prize {
  first: string;
  second: string;
  third: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  requirements: string[];
  prizes: Prize;
  examples: string[];
  tags: string[];
  totalPrize: string;
}

export interface TimelineEvent {
  id: number;
  time: string;
  event: string;
  hour: string;
  description?: string;
  icon?: string;
}

export interface ChallengeStats {
  totalPrize: string;
  categories: number;
  maxTeamSize: number;
  duration: string;
}
