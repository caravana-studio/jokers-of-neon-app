import { getContractByName } from "@dojoengine/core";
import manifest from "../manifest.json";

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

export const policies = [
  {
    target: game_system_contract_address,
    method: "create_game",
  },
  {
    target: game_system_contract_address,
    method: "play",
  },
  {
    target: game_system_contract_address,
    method: "discard",
  },
  {
    target: game_system_contract_address,
    method: "check_hand",
  },
  {
    target: game_system_contract_address,
    method: "discard_effect_card",
  },
  {
    target: game_system_contract_address,
    method: "discard_special_card",
  },
  {
    target: shop_system_contract_address,
    method: "skip_shop",
  },
  {
    target: shop_system_contract_address,
    method: "buy_card_item",
  },
  {
    target: shop_system_contract_address,
    method: "buy_poker_hand_item",
  },
  {
    target: shop_system_contract_address,
    method: "buy_blister_pack_item",
  },
  {
    target: shop_system_contract_address,
    method: "select_cards_from_blister",
  },
  {
    target: shop_system_contract_address,
    method: "reroll",
  },
  {
    target: rage_system_contract_address,
    method: "calculate",
  },
];
