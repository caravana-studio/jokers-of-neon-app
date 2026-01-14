import { EventTypeEnum } from "../dojo/typescript/custom";
import { Suits } from "../enums/suits";
import { Card } from "./Card";

export interface PlayEvents {
  play: MultiPoints;
  gameOver: boolean;
  levelPassed?: LevelPassedEvent;
  detailEarned?: DetailEarned;
  neonPlayEvent?: NeonPlayEvent;
  cards: Card[];
  score: number;
  secondChanceEvent?: boolean;
  powerUpEvents?: PowerUpScore[];
  cardPlayChangeEvents?: CardPlayEvent[];
  cardActivateEvent?: CardActivateEvent;
  acumulativeEvents?: CardPlayEvent[];
  cardPlayEvents?: CardPlayEvent[];
}

export interface CardPlayEvent {
  hand: CardPlayEventValue[];
  specials: CardPlayEventValue[];
  eventType: EventTypeEnum;
}

export interface CardPlayEventValue {
  idx: number;
  quantity: number;
}

export interface LevelPassedEvent {
  level: number;
  player_score: number;
  round: number;
  level_passed: number;
}

export interface LevelEvent {
  special_idx: number;
  multi: number;
  points: number;
}

export interface MultiPoints {
  multi?: number;
  points?: number;
  negative?: boolean;
}

export interface CardScore extends MultiPoints {
  idx: number;
  special_idx?: number;
}

export interface PowerUpScore extends MultiPoints {
  idx: number;
  special_idx?: number;
}

export interface NeonPlayEvent extends MultiPoints {
  neon_cards_idx: number[];
}

export interface SpecialSuitEvent {
  suit: Suits;
  special_idx?: number;
  idx: number[];
}

export interface SpecialNeonCardEvent {
  idx: number;
  special_idx: number;
}

export interface ModifierSuitEvent {
  suit: Suits;
  idx: number;
}

export interface ModifierNeonEvent {
  idx: number;
}

export interface CardActivateEvent {
  special_id: number;
}

export interface DetailEarned {
  round_defeat: number;
  level_bonus: number;
  hands_left: number;
  hands_left_cash: number;
  discard_left: number;
  discard_left_cash: number;
  rage_card_defeated: number;
  rage_card_defeated_cash: number;
  rerolls: number;
  total: number;
}

export interface CashEvent {
  cash: number;
  idx: number;
  special_idx: number;
}

export interface DailyMissionCompleted {
  player: string;
  dailyMissionId: string;
}

export interface LevelCompleteEvent {
  level: number;
  completion_count: number;
  base_xp: number;
}
