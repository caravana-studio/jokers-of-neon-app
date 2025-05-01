import { BigNumberish } from "starknet";
import { GameStateEnum } from "../dojo/typescript/custom";

export interface IGame {
  cash: number;
  id: number;
  len_common_cards: number;
  len_current_special_cards: number;
  len_max_current_special_cards: number;
  len_effect_cards: number;
  len_hand: number;
  level: number;
  max_discard: number;
  max_hands: number;
  owner: BigNumberish;
  player_name: BigNumberish;
  player_score: number;
  round: number;
  state: GameStateEnum;
}
