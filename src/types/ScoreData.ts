import { Suits } from "../enums/suits";

export interface PlayEvents {
  gameOver: boolean;
  levelPassed?: LevelPassedEvent;
  detailEarned?: DetailEarned;
}

export interface CheckHandEvents {
  checkHand: PlayEvent;
  play: MultiPoints;
  cards: CardScore[];
  specialCards?: CardScore[];
  levelEvent?: LevelEvent;
  specialSuitEvents?: SpecialSuitEvent[];
  modifierSuitEvents?: ModifierSuitEvent[];
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

export interface PlayEvent extends MultiPoints {
  play: number;
}

export interface CardScore extends MultiPoints {
  idx: number;
  special_idx?: number;
}

export interface SpecialSuitEvent {
  suit: Suits;
  special_idx?: number;
  idx: number[];
}

export interface ModifierSuitEvent {
  suit: Suits;
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
