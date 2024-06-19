import { Suits } from "../enums/suits";

export interface PlayEvents {
  play: MultiPoints;
  cards: CardScore[];
  gameOver: boolean;
  levelPassed?: LevelPassedEvent;
  detailEarned?: DetailEarned;
  specialCards?: CardScore[];
  levelEvent?: LevelEvent;
  suitEvents?: SuitEvent[];
}

export interface LevelPassedEvent {
  level: number;
  score: number;
}

export interface LevelEvent {
  special_idx: number;
  multi: number;
  points: number;
}

export interface MultiPoints {
  multi?: number;
  points?: number;
}

export interface CardScore extends MultiPoints {
  idx: number;
  special_idx?: number;
}

export interface SuitEvent {
  suit: Suits;
  special_idx?: number;
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
