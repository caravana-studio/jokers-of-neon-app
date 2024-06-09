export interface PlayEvents {
  play: MultiPoints;
  cards: CardScore[];
  gameOver: boolean;
  levelPassed?: LevelPassedEvent;
  detailEarned?: DetailEarned;
}

export interface LevelPassedEvent {
  level: number;
  score: number;
}

export interface MultiPoints {
  multi?: number;
  points: number;
}

export interface CardScore extends MultiPoints {
  idx: number;
}

export interface DetailEarned {
  round_defeat: number;
  level_bonus: number;
  hands_left: number;
  hands_left_cash: number;
  discard_left: number;
  discard_left_cash: number;
  total: number;
}
