import { DojoCall, DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

const DOJO_NAMESPACE = import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

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
				snAccount as any,
				build_shop_system_buyBlisterPackItem_calldata(gameId, blisterPackItemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyBurnItem_calldata = (gameId: BigNumberish, cardId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_burn_item",
			calldata: [gameId, cardId],
		};
	};

	const shop_system_buyBurnItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyBurnItem_calldata(gameId, cardId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyCardItem_calldata = (gameId: BigNumberish, itemId: BigNumberish, cardItemType: CairoCustomEnum): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_card_item",
			calldata: [gameId, itemId, cardItemType],
		};
	};

	const shop_system_buyCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, cardItemType: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyCardItem_calldata(gameId, itemId, cardItemType),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPokerHandItem_calldata = (gameId: BigNumberish, itemId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_poker_hand_item",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPokerHandItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyPokerHandItem_calldata(gameId, itemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPowerUpItem_calldata = (gameId: BigNumberish, itemId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_power_up_item",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPowerUpItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyPowerUpItem_calldata(gameId, itemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySlotSpecialCardItem_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_slot_special_card_item",
			calldata: [gameId],
		};
	};

	const shop_system_buySlotSpecialCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buySlotSpecialCardItem_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySpecialCardItem_calldata = (gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_special_card_item",
			calldata: [gameId, itemId, isTemporary],
		};
	};

	const shop_system_buySpecialCardItem = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buySpecialCardItem_calldata(gameId, itemId, isTemporary),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_rage_system_calculate_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "rage_system",
			entrypoint: "calculate",
			calldata: [gameId],
		};
	};

	const rage_system_calculate = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_rage_system_calculate_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_changeModifierCard_calldata = (gameId: BigNumberish, modifierIndex: BigNumberish): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "change_modifier_card",
			calldata: [gameId, modifierIndex],
		};
	};

	const game_system_changeModifierCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, modifierIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_changeModifierCard_calldata(gameId, modifierIndex),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_createGame_calldata = (modId: BigNumberish, playerName: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "create_game",
			calldata: [modId, playerName],
		};
	};

	const game_system_createGame = async (snAccount: Account | AccountInterface, modId: BigNumberish, playerName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_createGame_calldata(modId, playerName),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_discard_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "discard",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes],
		};
	};

	const game_system_discard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_discard_calldata(gameId, playedCardsIndexes, playedModifiersIndexes),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_getGameConfig_calldata = (modId: BigNumberish): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_game_config",
			calldata: [modId],
		};
	};

	const game_system_getGameConfig = async (modId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_getGameConfig_calldata(modId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_getGameMods_calldata = (): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_game_mods",
			calldata: [],
		};
	};

	const game_system_getGameMods = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_getGameMods_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_poker_hand_system_getPlayerPokerHands_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "poker_hand_system",
			entrypoint: "get_player_poker_hands",
			calldata: [gameId],
		};
	};

	const poker_hand_system_getPlayerPokerHands = async (gameId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_poker_hand_system_getPlayerPokerHands_calldata(gameId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mods_info_system_getRageCardsIds_calldata = (modId: BigNumberish): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_rage_cards_ids",
			calldata: [modId],
		};
	};

	const mods_info_system_getRageCardsIds = async (modId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mods_info_system_getRageCardsIds_calldata(modId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mod_manager_registrator_getRegisteredManagers_calldata = (): DojoCall => {
		return {
			contractName: "mod_manager_registrator",
			entrypoint: "get_registered_managers",
			calldata: [],
		};
	};

	const mod_manager_registrator_getRegisteredManagers = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mod_manager_registrator_getRegisteredManagers_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_getShopItems_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "get_shop_items",
			calldata: [gameId],
		};
	};

	const shop_system_getShopItems = async (gameId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_shop_system_getShopItems_calldata(gameId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mods_info_system_getSpecialCardsIds_calldata = (modId: BigNumberish): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_special_cards_ids",
			calldata: [modId],
		};
	};

	const mods_info_system_getSpecialCardsIds = async (modId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mods_info_system_getSpecialCardsIds_calldata(modId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_play_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "play",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes],
		};
	};

	const game_system_play = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_play_calldata(gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mod_manager_registrator_registerManagers_calldata = (modManagerAddress: string, rageManagerAddress: string, specialManagerAddress: string): DojoCall => {
		return {
			contractName: "mod_manager_registrator",
			entrypoint: "register_managers",
			calldata: [modManagerAddress, rageManagerAddress, specialManagerAddress],
		};
	};

	const mod_manager_registrator_registerManagers = async (snAccount: Account | AccountInterface, modManagerAddress: string, rageManagerAddress: string, specialManagerAddress: string) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_mod_manager_registrator_registerManagers_calldata(modManagerAddress, rageManagerAddress, specialManagerAddress),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_reroll_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "reroll",
			calldata: [gameId],
		};
	};

	const shop_system_reroll = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_reroll_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_rage_system_reset_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "rage_system",
			entrypoint: "reset",
			calldata: [gameId],
		};
	};

	const rage_system_reset = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_rage_system_reset_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_selectCardsFromBlister_calldata = (gameId: BigNumberish, cardsIndex: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "select_cards_from_blister",
			calldata: [gameId, cardsIndex],
		};
	};

	const shop_system_selectCardsFromBlister = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardsIndex: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_selectCardsFromBlister_calldata(gameId, cardsIndex),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_sellSpecialCard_calldata = (gameId: BigNumberish, specialCardIndex: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "sell_special_card",
			calldata: [gameId, specialCardIndex],
		};
	};

	const game_system_sellSpecialCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, specialCardIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_sellSpecialCard_calldata(gameId, specialCardIndex),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_skipShop_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "skip_shop",
			calldata: [gameId],
		};
	};

	const shop_system_skipShop = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_skipShop_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_mint_calldata = (playerName: BigNumberish, settingsId: BigNumberish, start: CairoOption<BigNumberish>, end: CairoOption<BigNumberish>, to: string): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "mint",
			calldata: [playerName, settingsId, start, end, to],
		};
	};

	const game_system_mint = async (snAccount: Account | AccountInterface, playerName: BigNumberish, settingsId: BigNumberish, start: CairoOption<BigNumberish>, end: CairoOption<BigNumberish>, to: string) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_mint_calldata(playerName, settingsId, start, end, to),
				DOJO_NAMESPACE,
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
			changeModifierCard: game_system_changeModifierCard,
			buildChangeModifierCardCalldata: build_game_system_changeModifierCard_calldata,
			createGame: game_system_createGame,
			buildCreateGameCalldata: build_game_system_createGame_calldata,
			discard: game_system_discard,
			buildDiscardCalldata: build_game_system_discard_calldata,
			getGameConfig: game_system_getGameConfig,
			buildGetGameConfigCalldata: build_game_system_getGameConfig_calldata,
			getGameMods: game_system_getGameMods,
			buildGetGameModsCalldata: build_game_system_getGameMods_calldata,
			play: game_system_play,
			buildPlayCalldata: build_game_system_play_calldata,
			sellSpecialCard: game_system_sellSpecialCard,
			buildSellSpecialCardCalldata: build_game_system_sellSpecialCard_calldata,
			mint: game_system_mint,
		},
		poker_hand_system: {
			getPlayerPokerHands: poker_hand_system_getPlayerPokerHands,
			buildGetPlayerPokerHandsCalldata: build_poker_hand_system_getPlayerPokerHands_calldata,
		},
		mods_info_system: {
			getRageCardsIds: mods_info_system_getRageCardsIds,
			buildGetRageCardsIdsCalldata: build_mods_info_system_getRageCardsIds_calldata,
			getSpecialCardsIds: mods_info_system_getSpecialCardsIds,
			buildGetSpecialCardsIdsCalldata: build_mods_info_system_getSpecialCardsIds_calldata,
		},
		mod_manager_registrator: {
			getRegisteredManagers: mod_manager_registrator_getRegisteredManagers,
			buildGetRegisteredManagersCalldata: build_mod_manager_registrator_getRegisteredManagers_calldata,
			registerManagers: mod_manager_registrator_registerManagers,
			buildRegisterManagersCalldata: build_mod_manager_registrator_registerManagers_calldata,
		},
	};
}