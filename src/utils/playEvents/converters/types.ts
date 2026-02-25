import { Card } from "../../../types/Card";
import { CardPlayEvent } from "../../../types/ScoreData";

export interface BuildOptimisticConverterEventsParams {
  hand: Card[];
  preSelectedCards: number[];
  specialCards: Card[];
  preSelectedModifiers: { [key: number]: number[] };
  specialCard: Card;
}

export interface OptimisticConverterBehavior {
  deterministic: boolean;
  buildEvents: (
    params: BuildOptimisticConverterEventsParams
  ) => CardPlayEvent[];
}
