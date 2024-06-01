export interface PlayEvents {
  play: MultiPoints;
  cards: CardScore[];
  gameOver: boolean;
  levelPassed?: LevelPassedEvent;
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
