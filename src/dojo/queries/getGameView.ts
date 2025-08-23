import { shortString } from "starknet";
import { GameStateEnum } from "../typescript/custom";
import { Round } from "../typescript/models.gen";

export const DEFAULT_GAME_VIEW: GameView = {
  game: {
    id: 0,
    mod_id: "",
    owner: "",
    player_name: 0,
    player_score: 0,
    level: 0,
    current_node_id: 0,
    hand_len: 0,
    plays: 0,
    discards: 0,
    current_specials_len: 0,
    special_slots: 0,
    cash: 0,
    available_rerolls: 0,
    seed: 0,
    state: GameStateEnum.NotStarted,
  },
  round: {
    game_id: 0,
    current_score: 0,
    target_score: 0,
    remaining_plays: 0,
    remaining_discards: 0,
    rages: [],
  },
};

export interface GameView {
  game: {
    id: number;
    mod_id: string;
    state: GameStateEnum;
    owner: string;
    player_name: number;
    player_score: number;
    level: number;
    current_node_id: number;
    hand_len: number;
    plays: number;
    discards: number;
    current_specials_len: number;
    special_slots: number;
    cash: number;
    available_rerolls: number;
    seed: number;
  };
  round: Round;
}

interface StateCairo {
  Challenge: any;
  GameOver: any;
  Lootbox: any;
  Map: any;
  Rage: any;
  Reward: any;
  Round: any;
  Store: any;
}

const getState = (state: StateCairo): GameStateEnum => {
  if (state.Challenge !== undefined) {
    return GameStateEnum.Challenge;
  } else if (state.GameOver !== undefined) {
    return GameStateEnum.GameOver;
  } else if (state.Lootbox !== undefined) {
    return GameStateEnum.Lootbox;
  } else if (state.Map !== undefined) {
    return GameStateEnum.Map;
  } else if (state.Rage !== undefined) {
    return GameStateEnum.Rage;
  } else if (state.Reward !== undefined) {
    return GameStateEnum.Reward;
  } else if (state.Round !== undefined) {
    return GameStateEnum.Round;
  } else if (state.Store !== undefined) {
    return GameStateEnum.Store;
  } else {
    return GameStateEnum.NotStarted;
  }
};

export const getGameView = async (
  client: any,
  gameId: number
): Promise<GameView> => {
  try {
    let tx_result: any = await client.game_views.getGameData(gameId);

    console.log("game data", tx_result);
    return {
      game: {
        id: gameId,
        mod_id: shortString.decodeShortString(tx_result["0"].mod_id),
        owner: tx_result["0"].owner,
        player_name: Number(tx_result["0"].player_name),
        player_score: Number(tx_result["0"].player_score),
        level: Number(tx_result["0"].level),
        current_node_id: Number(tx_result["0"].current_node_id),
        hand_len: Number(tx_result["0"].hand_len),
        plays: Number(tx_result["0"].plays),
        discards: Number(tx_result["0"].discards),
        current_specials_len: Number(tx_result["0"].current_specials_len),
        special_slots: Number(tx_result["0"].special_slots),
        cash: Number(tx_result["0"].cash),
        available_rerolls: Number(tx_result["0"].available_rerolls),
        seed: Number(tx_result["0"].seed),
        state: getState(tx_result["0"]?.state?.variant),
      },
      round: {
        game_id: gameId,
        current_score: Number(tx_result["1"].current_score),
        target_score: Number(tx_result["1"].target_score),
        remaining_plays: Number(tx_result["1"].remaining_plays),
        remaining_discards: Number(tx_result["1"].remaining_discards),
        rages: tx_result["1"].rages.map((id: BigInt) => Number(id)),
      },
    };
  } catch (e) {
    console.error("error getting game view", e);
    return DEFAULT_GAME_VIEW;
  }
};
