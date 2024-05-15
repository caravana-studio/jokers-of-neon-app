export interface ScoreData {
  play: MultiPoints;
  cards: CardScore[];
}

export interface MultiPoints {
  multi?: number;
  points: number;
}

export interface CardScore extends MultiPoints {
  idx: number;
}
