import { getContractByName } from "@dojoengine/core";
import manifest from "../../manifest.json";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const game_system_contract_address = getContractByName(
  manifest,
  DOJO_NAMESPACE,
  "game_system"
)?.address;

const shop_system_contract_address = getContractByName(
  manifest,
  DOJO_NAMESPACE,
  "shop_system"
)?.address;

const rage_system_contract_address = getContractByName(
  manifest,
  DOJO_NAMESPACE,
  "rage_system"
)?.address;

export const policies = {
  contracts: {
    [game_system_contract_address]: {
      methods: [
        {
          name: "Create game",
          entrypoint: "create_game",
        },
        {
          name: "Play",
          entrypoint: "play",
        },
        {
          name: "Discard",
          entrypoint: "discard",
        },
        {
          name: "Discard effect card",
          entrypoint: "discard_effect_card",
        },
        {
          name: "Sell special card",
          entrypoint: "sell_special_card",
        },
      ],
    },
    [shop_system_contract_address]: {
      methods: [
        {
          name: "Skip shop",
          entrypoint: "skip_shop",
        },
        {
          name: "Buy card",
          entrypoint: "buy_card_item",
        },
        {
          name: "Level up poker hand",
          entrypoint: "buy_poker_hand_item",
        },
        {
          name: "Buy loot box",
          entrypoint: "buy_blister_pack_item",
        },
        {
          name: "Burn item",
          entrypoint: "buy_burn_item",
        },
        {
          name: "Buy power-up",
          entrypoint: "buy_power_up_item",
        },
        {
          name: "Buy special card",
          entrypoint: "buy_special_card_item",
        },
        {
          name: "Select cards from loot box",
          entrypoint: "select_cards_from_blister",
        },
        {
          name: "Unlock special card slot",
          entrypoint: "buy_slot_special_card_item",
        },
        {
          name: "Reroll",
          entrypoint: "reroll",
        },
      ],
    },
  },
};
