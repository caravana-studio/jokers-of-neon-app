import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {
  const shop_system_skipShop = async (snAccount: Account, gameId: number) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "skip_shop",
          calldata: [gameId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_buyCardItem = async (
    snAccount: Account,
    gameId: number,
    itemId: number,
    cardItemType: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "buy_card_item",
          calldata: [gameId, itemId, cardItemType],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_buyPokerHandItem = async (
    snAccount: Account,
    gameId: number,
    itemId: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "buy_poker_hand_item",
          calldata: [gameId, itemId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_buyBlisterPackItem = async (
    snAccount: Account,
    gameId: number,
    blisterPackItemId: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "buy_blister_pack_item",
          calldata: [gameId, blisterPackItemId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_selectCardsFromBlister = async (
    snAccount: Account,
    gameId: number,
    cardsIndex: Array<number>
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "select_cards_from_blister",
          calldata: [gameId, cardsIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_buySlotSpecialCardItem = async (
    snAccount: Account,
    gameId: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "buy_slot_special_card_item",
          calldata: [gameId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shop_system_reroll = async (snAccount: Account, gameId: number) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "shop_system",
          entrypoint: "reroll",
          calldata: [gameId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const poker_hand_system_getPlayerPokerHands = async (gameId: number) => {
    try {
      return await provider.call("jokers_of_neon", {
        contractName: "poker_hand_system",
        entrypoint: "get_player_poker_hands",
        calldata: [gameId],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_createGame = async (
    snAccount: Account,
    playerName: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "create_game",
          calldata: [playerName],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_play = async (
    snAccount: Account,
    gameId: number,
    cardsIndex: Array<number>,
    modifiersIndex: Array<number>
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "play",
          calldata: [gameId, cardsIndex, modifiersIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_discard = async (
    snAccount: Account,
    gameId: number,
    cardsIndex: Array<number>,
    modifiersIndex: Array<number>
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "discard",
          calldata: [gameId, cardsIndex, modifiersIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_checkHand = async (
    snAccount: Account,
    gameId: number,
    cardsIndex: Array<number>,
    modifiersIndex: Array<number>
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "check_hand",
          calldata: [gameId, cardsIndex, modifiersIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_discardEffectCard = async (
    snAccount: Account,
    gameId: number,
    cardIndex: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "discard_effect_card",
          calldata: [gameId, cardIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const game_system_discardSpecialCard = async (
    snAccount: Account,
    gameId: number,
    specialCardIndex: number
  ) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "game_system",
          entrypoint: "discard_special_card",
          calldata: [gameId, specialCardIndex],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const rage_system_calculate = async (snAccount: Account, gameId: number) => {
    try {
      return await provider.execute(
        snAccount,
        {
          contractName: "rage_system",
          entrypoint: "calculate",
          calldata: [gameId],
        },
        "jokers_of_neon"
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    shop_system: {
      skipShop: shop_system_skipShop,
      buyCardItem: shop_system_buyCardItem,
      buyPokerHandItem: shop_system_buyPokerHandItem,
      buyBlisterPackItem: shop_system_buyBlisterPackItem,
      selectCardsFromBlister: shop_system_selectCardsFromBlister,
      buySlotSpecialCardItem: shop_system_buySlotSpecialCardItem,
      reroll: shop_system_reroll,
    },
    poker_hand_system: {
      getPlayerPokerHands: poker_hand_system_getPlayerPokerHands,
    },
    game_system: {
      createGame: game_system_createGame,
      play: game_system_play,
      discard: game_system_discard,
      checkHand: game_system_checkHand,
      discardEffectCard: game_system_discardEffectCard,
      discardSpecialCard: game_system_discardSpecialCard,
    },
    rage_system: {
      calculate: rage_system_calculate,
    },
  };
}
