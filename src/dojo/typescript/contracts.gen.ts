import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_shop_system_buyBlisterPackItem_calldata = (gameId: BigNumberish, blisterPackItemId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_blister_pack_item",
			calldata: [gameId, blisterPackItemId],
		};
	};

	const shop_system_buyBlisterPackItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, blisterPackItemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buyBlisterPackItem_calldata(gameId, blisterPackItemId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyBurnItem_calldata = (gameId: BigNumberish, cardId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_burn_item",
			calldata: [gameId, cardId],
		};
	};

	const shop_system_buyBurnItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buyBurnItem_calldata(gameId, cardId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyCardItem_calldata = (gameId: BigNumberish, itemId: BigNumberish, cardItemType: models.CardItemType) => {
		// Workaround to fix problem with starknet.js enum management
		const itemIdToString = {
			0: 'None',
			1: 'Common',
			2: 'Modifier',
		}
		return {
			contractName: "shop_system",
			entrypoint: "buy_card_item",
			calldata: [gameId, itemId, new CairoCustomEnum({ [itemIdToString[cardItemType]]: '()' })],		};
	};

	const shop_system_buyCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, cardItemType: models.CardItemType) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buyCardItem_calldata(gameId, itemId, cardItemType),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPokerHandItem_calldata = (gameId: BigNumberish, itemId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_poker_hand_item",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPokerHandItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buyPokerHandItem_calldata(gameId, itemId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPowerUpItem_calldata = (gameId: BigNumberish, itemId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_power_up_item",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPowerUpItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buyPowerUpItem_calldata(gameId, itemId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySlotSpecialCardItem_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_slot_special_card_item",
			calldata: [gameId],
		};
	};

	const shop_system_buySlotSpecialCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buySlotSpecialCardItem_calldata(gameId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySpecialCardItem_calldata = (gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean) => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_special_card_item",
			calldata: [gameId, itemId, isTemporary],
		};
	};

	const shop_system_buySpecialCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_buySpecialCardItem_calldata(gameId, itemId, isTemporary),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_rage_system_calculate_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "rage_system",
			entrypoint: "calculate",
			calldata: [gameId],
		};
	};

	const rage_system_calculate = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_rage_system_calculate_calldata(gameId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_createGame_calldata = (modId: BigNumberish, playerName: BigNumberish) => {
		return {
			contractName: "game_system",
			entrypoint: "create_game",
			calldata: [modId, playerName],
		};
	};

	const game_system_createGame = async (snAccount: Account | AccountInterface, modId: BigNumberish, playerName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_system_createGame_calldata(modId, playerName),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_discard_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>) => {
		return {
			contractName: "game_system",
			entrypoint: "discard",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes],
		};
	};

	const game_system_discard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_system_discard_calldata(gameId, playedCardsIndexes, playedModifiersIndexes),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_discardEffectCard_calldata = (gameId: BigNumberish, playedCardsIndexes: BigNumberish) => {
		return {
			contractName: "game_system",
			entrypoint: "discard_effect_card",
			calldata: [gameId, playedCardsIndexes],
		};
	};

	const game_system_discardEffectCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_system_discardEffectCard_calldata(gameId, playedCardsIndexes),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_discardSpecialCard_calldata = (gameId: BigNumberish, specialCardIndex: BigNumberish) => {
		return {
			contractName: "game_system",
			entrypoint: "discard_special_card",
			calldata: [gameId, specialCardIndex],
		};
	};

	const game_system_discardSpecialCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, specialCardIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_system_discardSpecialCard_calldata(gameId, specialCardIndex),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_getGameConfig_calldata = (modId: BigNumberish) => {
		return {
			contractName: "game_system",
			entrypoint: "get_game_config",
			calldata: [modId],
		};
	};

	const game_system_getGameConfig = async (modId: BigNumberish) => {
		try {
			return await provider.call("jokers_of_neon_core", build_game_system_getGameConfig_calldata(modId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_getGameMods_calldata = () => {
		return {
			contractName: "game_system",
			entrypoint: "get_game_mods",
			calldata: [],
		};
	};

	const game_system_getGameMods = async () => {
		try {
			return await provider.call("jokers_of_neon_core", build_game_system_getGameMods_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_poker_hand_system_getPlayerPokerHands_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "poker_hand_system",
			entrypoint: "get_player_poker_hands",
			calldata: [gameId],
		};
	};

	const poker_hand_system_getPlayerPokerHands = async (gameId: BigNumberish) => {
		try {
			return await provider.call("jokers_of_neon_core", build_poker_hand_system_getPlayerPokerHands_calldata(gameId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_getShopItems_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "get_shop_items",
			calldata: [gameId],
		};
	};

	const shop_system_getShopItems = async (gameId: BigNumberish) => {
		try {
			return await provider.call("jokers_of_neon_core", build_shop_system_getShopItems_calldata(gameId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_play_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>) => {
		return {
			contractName: "game_system",
			entrypoint: "play",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes],
		};
	};

	const game_system_play = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_system_play_calldata(gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mod_manager_registrator_registerManagers_calldata = (modManagerAddress: string, rageManagerAddress: string, specialManagerAddress: string) => {
		return {
			contractName: "mod_manager_registrator",
			entrypoint: "register_managers",
			calldata: [modManagerAddress, rageManagerAddress, specialManagerAddress],
		};
	};

	const mod_manager_registrator_registerManagers = async (snAccount: Account | AccountInterface, modManagerAddress: string, rageManagerAddress: string, specialManagerAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_mod_manager_registrator_registerManagers_calldata(modManagerAddress, rageManagerAddress, specialManagerAddress),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_reroll_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "reroll",
			calldata: [gameId],
		};
	};

	const shop_system_reroll = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_reroll_calldata(gameId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_rage_system_reset_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "rage_system",
			entrypoint: "reset",
			calldata: [gameId],
		};
	};

	const rage_system_reset = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_rage_system_reset_calldata(gameId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_selectCardsFromBlister_calldata = (gameId: BigNumberish, cardsIndex: Array<BigNumberish>) => {
		return {
			contractName: "shop_system",
			entrypoint: "select_cards_from_blister",
			calldata: [gameId, cardsIndex],
		};
	};

	const shop_system_selectCardsFromBlister = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardsIndex: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_selectCardsFromBlister_calldata(gameId, cardsIndex),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_skipShop_calldata = (gameId: BigNumberish) => {
		return {
			contractName: "shop_system",
			entrypoint: "skip_shop",
			calldata: [gameId],
		};
	};

	const shop_system_skipShop = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_shop_system_skipShop_calldata(gameId),
				"jokers_of_neon_core",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		shop_system: {
			buyBlisterPackItem: shop_system_buyBlisterPackItem,
			buildBuyBlisterPackItemCalldata: build_shop_system_buyBlisterPackItem_calldata,
			buyBurnItem: shop_system_buyBurnItem,
			buildBuyBurnItemCalldata: build_shop_system_buyBurnItem_calldata,
			buyCardItem: shop_system_buyCardItem,
			buildBuyCardItemCalldata: build_shop_system_buyCardItem_calldata,
			buyPokerHandItem: shop_system_buyPokerHandItem,
			buildBuyPokerHandItemCalldata: build_shop_system_buyPokerHandItem_calldata,
			buyPowerUpItem: shop_system_buyPowerUpItem,
			buildBuyPowerUpItemCalldata: build_shop_system_buyPowerUpItem_calldata,
			buySlotSpecialCardItem: shop_system_buySlotSpecialCardItem,
			buildBuySlotSpecialCardItemCalldata: build_shop_system_buySlotSpecialCardItem_calldata,
			buySpecialCardItem: shop_system_buySpecialCardItem,
			buildBuySpecialCardItemCalldata: build_shop_system_buySpecialCardItem_calldata,
			getShopItems: shop_system_getShopItems,
			buildGetShopItemsCalldata: build_shop_system_getShopItems_calldata,
			reroll: shop_system_reroll,
			buildRerollCalldata: build_shop_system_reroll_calldata,
			selectCardsFromBlister: shop_system_selectCardsFromBlister,
			buildSelectCardsFromBlisterCalldata: build_shop_system_selectCardsFromBlister_calldata,
			skipShop: shop_system_skipShop,
			buildSkipShopCalldata: build_shop_system_skipShop_calldata,
		},
		rage_system: {
			calculate: rage_system_calculate,
			buildCalculateCalldata: build_rage_system_calculate_calldata,
			reset: rage_system_reset,
			buildResetCalldata: build_rage_system_reset_calldata,
		},
		game_system: {
			createGame: game_system_createGame,
			buildCreateGameCalldata: build_game_system_createGame_calldata,
			discard: game_system_discard,
			buildDiscardCalldata: build_game_system_discard_calldata,
			discardEffectCard: game_system_discardEffectCard,
			buildDiscardEffectCardCalldata: build_game_system_discardEffectCard_calldata,
			discardSpecialCard: game_system_discardSpecialCard,
			buildDiscardSpecialCardCalldata: build_game_system_discardSpecialCard_calldata,
			getGameConfig: game_system_getGameConfig,
			buildGetGameConfigCalldata: build_game_system_getGameConfig_calldata,
			getGameMods: game_system_getGameMods,
			buildGetGameModsCalldata: build_game_system_getGameMods_calldata,
			play: game_system_play,
			buildPlayCalldata: build_game_system_play_calldata,
		},
		poker_hand_system: {
			getPlayerPokerHands: poker_hand_system_getPlayerPokerHands,
			buildGetPlayerPokerHandsCalldata: build_poker_hand_system_getPlayerPokerHands_calldata,
		},
		mod_manager_registrator: {
			registerManagers: mod_manager_registrator_registerManagers,
			buildRegisterManagersCalldata: build_mod_manager_registrator_registerManagers_calldata,
		},
	};
}