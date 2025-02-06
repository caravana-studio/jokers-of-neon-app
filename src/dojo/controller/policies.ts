import { getContractByName } from "@dojoengine/core";
import manifest from "../../manifest.json";

const game_system_contract_address = getContractByName(
  manifest,
  "jokers_of_neon",
  "game_system"
)?.address;

const shop_system_contract_address = getContractByName(
  manifest,
  "jokers_of_neon",
  "shop_system"
)?.address;

const rage_system_contract_address = getContractByName(
  manifest,
  "jokers_of_neon",
  "rage_system"
)?.address;

export const policies = {
  contracts: {
    [game_system_contract_address]: {
      methods: [
        {
          name: "create game",
          entrypoint: "create_game",
        },
        {
          name: "play",
          entrypoint: "play",
        },
        {
          name: "discard",
          entrypoint: "discard",
        },
        {
          name: "check hand",
          entrypoint: "check_hand",
        },
        {
          name: "discard effect card",
          entrypoint: "discard_effect_card",
        },
        {
          name: "sell special card",
          entrypoint: "sell_special_card",
        },
      ],
    },
    [shop_system_contract_address]: {
      methods: [
        {
          name: "skip shop",
          entrypoint: "skip_shop",
        },
        {
          name: "buy card item",
          entrypoint: "buy_card_item",
        },
        {
          name: "buy poker hand item",
          entrypoint: "buy_poker_hand_item",
        },
        {
          name: "buy blister pack item",
          entrypoint: "buy_blister_pack_item",
        },
        {
          name: "select cards from blister",
          entrypoint: "select_cards_from_blister",
        },
        {
          name: "reroll",
          entrypoint: "reroll",
        },
      ],
    },
  },
};
