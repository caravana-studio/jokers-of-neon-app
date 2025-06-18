import { DojoCall, DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoCustomEnum, CairoOption, CallData } from "starknet";
import { getVrfTx } from "../vrfTx";

const DOJO_NAMESPACE = import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const isDev = import.meta.env.VITE_DEV === "true";

export function setupWorld(provider: DojoProvider) {

	const build_map_system_advanceNode_calldata = (gameId: BigNumberish, nodeId: BigNumberish): DojoCall => {
		return {
			contractName: "map_system",
			entrypoint: "advance_node",
			calldata: [gameId, nodeId],
		};
	};

	const map_system_advanceNode = async (snAccount: Account | AccountInterface, gameId: BigNumberish, nodeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_map_system_advanceNode_calldata(gameId, nodeId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_approve_calldata = (to: string, tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "approve",
			calldata: [to, tokenId],
		};
	};

	const game_system_approve = async (snAccount: Account | AccountInterface, to: string, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_approve_calldata(to, tokenId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_balanceOf_calldata = (account: string): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "balanceOf",
			calldata: [account],
		};
	};

	const game_system_balanceOf = async (account: string) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_balanceOf_calldata(account));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_burnCard_calldata = (gameId: BigNumberish, cardId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "burn_card",
			calldata: [gameId, cardId],
		};
	};

	const shop_system_burnCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_burnCard_calldata(gameId, cardId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyCard_calldata = (gameId: BigNumberish, itemId: BigNumberish, cardItemType: CairoCustomEnum): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_card",
			calldata: [gameId, itemId, cardItemType],
		};
	};

	const shop_system_buyCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, cardItemType: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyCard_calldata(gameId, itemId, cardItemType),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyLootBox_calldata = (gameId: BigNumberish, lootBoxItemId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_loot_box",
			calldata: [gameId, lootBoxItemId],
		};
	};

	const shop_system_buyLootBox = async (snAccount: Account | AccountInterface, gameId: BigNumberish, lootBoxItemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyLootBox_calldata(gameId, lootBoxItemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPokerHand_calldata = (gameId: BigNumberish, itemId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_poker_hand",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPokerHand = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyPokerHand_calldata(gameId, itemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buyPowerUp_calldata = (gameId: BigNumberish, itemId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_power_up",
			calldata: [gameId, itemId],
		};
	};

	const shop_system_buyPowerUp = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buyPowerUp_calldata(gameId, itemId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySpecialCard_calldata = (gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_special_card",
			calldata: [gameId, itemId, isTemporary],
		};
	};

	const shop_system_buySpecialCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, itemId: BigNumberish, isTemporary: boolean) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buySpecialCard_calldata(gameId, itemId, isTemporary),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_buySpecialSlot_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "buy_special_slot",
			calldata: [gameId],
		};
	};

	const shop_system_buySpecialSlot = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_buySpecialSlot_calldata(gameId),
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

	const build_action_system_changeModifierCard_calldata = (gameId: BigNumberish, modifierIndex: BigNumberish): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "change_modifier_card",
			calldata: [gameId, modifierIndex],
		};
	};

	const action_system_changeModifierCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, modifierIndex: BigNumberish) => {
		try {
			console.log('vrf tx ', getVrfTx("action_system", snAccount))
			return await provider.execute(
				snAccount as any,
				isDev ? build_action_system_changeModifierCard_calldata(gameId, modifierIndex) : 
				[getVrfTx("action_system", snAccount), 
				build_action_system_changeModifierCard_calldata(gameId, modifierIndex)],
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_map_system_createMapLevel_calldata = (gameId: BigNumberish, seed: CairoOption<BigNumberish>): DojoCall => {
		return {
			contractName: "map_system",
			entrypoint: "create_map_level",
			calldata: [gameId, seed],
		};
	};

	const map_system_createMapLevel = async (snAccount: Account | AccountInterface, gameId: BigNumberish, seed: CairoOption<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_map_system_createMapLevel_calldata(gameId, seed),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_action_system_discard_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "discard",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes],
		};
	};

	const action_system_discard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>) => {
		try {
			console.log('vrf tx', getVrfTx("action_system", snAccount))
			return await provider.execute(
				snAccount as any,
				isDev ? build_action_system_discard_calldata(gameId, playedCardsIndexes, playedModifiersIndexes) :
				[getVrfTx("action_system", snAccount), 
				build_action_system_discard_calldata(gameId, playedCardsIndexes, playedModifiersIndexes)],
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_emitMetadataUpdate_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "emit_metadata_update",
			calldata: [gameId],
		};
	};

	const game_system_emitMetadataUpdate = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_emitMetadataUpdate_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_gameCount_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "game_count",
			calldata: [],
		};
	};

	const game_system_gameCount = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_gameCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_gameMetadata_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "game_metadata",
			calldata: [],
		};
	};

	const game_system_gameMetadata = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_gameMetadata_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_getApproved_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "getApproved",
			calldata: [tokenId],
		};
	};

	const game_system_getApproved = async (tokenId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_getApproved_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mods_info_system_getCumulativeInfo_calldata = (modId: BigNumberish, gameId: BigNumberish, specialCardId: BigNumberish): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_cumulative_info",
			calldata: [modId, gameId, specialCardId],
		};
	};

	const mods_info_system_getCumulativeInfo = async (modId: BigNumberish, gameId: BigNumberish, specialCardId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mods_info_system_getCumulativeInfo_calldata(modId, gameId, specialCardId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mods_info_system_getGameConfig_calldata = (modId: BigNumberish): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_game_config",
			calldata: [modId],
		};
	};

	const mods_info_system_getGameConfig = async (modId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mods_info_system_getGameConfig_calldata(modId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_mods_info_system_getGameMods_calldata = (): DojoCall => {
		return {
			contractName: "mods_info_system",
			entrypoint: "get_game_mods",
			calldata: [],
		};
	};

	const mods_info_system_getGameMods = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_mods_info_system_getGameMods_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_map_system_getLevelMap_calldata = (gameId: BigNumberish, level: BigNumberish): DojoCall => {
		return {
			contractName: "map_system",
			entrypoint: "get_level_map",
			calldata: [gameId, level],
		};
	};

	const map_system_getLevelMap = async (gameId: BigNumberish, level: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_map_system_getLevelMap_calldata(gameId, level));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_map_system_getNode_calldata = (gameId: BigNumberish, nodeId: BigNumberish): DojoCall => {
		return {
			contractName: "map_system",
			entrypoint: "get_node",
			calldata: [gameId, nodeId],
		};
	};

	const map_system_getNode = async (gameId: BigNumberish, nodeId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_map_system_getNode_calldata(gameId, nodeId));
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

	const build_game_system_isApprovedForAll_calldata = (owner: string, operator: string): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "isApprovedForAll",
			calldata: [owner, operator],
		};
	};

	const game_system_isApprovedForAll = async (owner: string, operator: string) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_isApprovedForAll_calldata(owner, operator));
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

	const build_game_system_name_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "name",
			calldata: [],
		};
	};

	const game_system_name = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_name_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_ownerOf_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "ownerOf",
			calldata: [tokenId],
		};
	};

	const game_system_ownerOf = async (tokenId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_ownerOf_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_action_system_play_calldata = (gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "action_system",
			entrypoint: "play",
			calldata: [gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes],
		};
	};

	const action_system_play = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playedCardsIndexes: Array<BigNumberish>, playedModifiersIndexes: Array<BigNumberish>, playedPowerUpsIndexes: Array<BigNumberish>) => {
		try {
			console.log('vrf tx', getVrfTx("action_system", snAccount))
			return await provider.execute(
				snAccount as any,
				isDev ? build_action_system_play_calldata(gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes) :
				[getVrfTx("action_system", snAccount), 
				build_action_system_play_calldata(gameId, playedCardsIndexes, playedModifiersIndexes, playedPowerUpsIndexes)],
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
			console.log('vrf tx', getVrfTx("shop_system", snAccount))
			return await provider.execute(
				snAccount as any,
				isDev ? build_shop_system_reroll_calldata(gameId) :
				[getVrfTx("shop_system", snAccount), 
				build_shop_system_reroll_calldata(gameId)],
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

	const build_game_system_safeTransferFrom_calldata = (from: string, to: string, tokenId: BigNumberish, data: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "safeTransferFrom",
			calldata: [from, to, tokenId, data],
		};
	};

	const game_system_safeTransferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: BigNumberish, data: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_safeTransferFrom_calldata(from, to, tokenId, data),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_score_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "score",
			calldata: [gameId],
		};
	};

	const game_system_score = async (gameId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_score_calldata(gameId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_scoreAttribute_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "score_attribute",
			calldata: [],
		};
	};

	const game_system_scoreAttribute = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_scoreAttribute_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_scoreModel_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "score_model",
			calldata: [],
		};
	};

	const game_system_scoreModel = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_scoreModel_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_selectCardsFromLootBox_calldata = (gameId: BigNumberish, cardsIndex: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "select_cards_from_loot_box",
			calldata: [gameId, cardsIndex],
		};
	};

	const shop_system_selectCardsFromLootBox = async (snAccount: Account | AccountInterface, gameId: BigNumberish, cardsIndex: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_selectCardsFromLootBox_calldata(gameId, cardsIndex),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_shop_system_sellSpecialCard_calldata = (gameId: BigNumberish, specialCardIndex: BigNumberish): DojoCall => {
		return {
			contractName: "shop_system",
			entrypoint: "sell_special_card",
			calldata: [gameId, specialCardIndex],
		};
	};

	const shop_system_sellSpecialCard = async (snAccount: Account | AccountInterface, gameId: BigNumberish, specialCardIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_shop_system_sellSpecialCard_calldata(gameId, specialCardIndex),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_setApprovalForAll_calldata = (operator: string, approved: boolean): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "setApprovalForAll",
			calldata: [operator, approved],
		};
	};

	const game_system_setApprovalForAll = async (snAccount: Account | AccountInterface, operator: string, approved: boolean) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_setApprovalForAll_calldata(operator, approved),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_settingExists_calldata = (settingsId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "setting_exists",
			calldata: [settingsId],
		};
	};

	const game_system_settingExists = async (settingsId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_settingExists_calldata(settingsId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_settingsModel_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "settings_model",
			calldata: [],
		};
	};

	const game_system_settingsModel = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_settingsModel_calldata());
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

	const build_game_system_startGame_calldata = (gameId: BigNumberish, playerName: BigNumberish, seed: CairoOption<BigNumberish>): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "start_game",
			calldata: [gameId, playerName, seed],
		};
	};

	const game_system_startGame = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playerName: BigNumberish, seed: CairoOption<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount as any,
				isDev ? build_game_system_startGame_calldata(gameId, playerName, seed) :
				[getVrfTx("game_system", snAccount),  build_game_system_startGame_calldata(gameId, playerName, seed)],
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_supportsInterface_calldata = (interfaceId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "supports_interface",
			calldata: [interfaceId],
		};
	};

	const game_system_supportsInterface = async (interfaceId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_supportsInterface_calldata(interfaceId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_symbol_calldata = (): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "symbol",
			calldata: [],
		};
	};

	const game_system_symbol = async () => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_symbol_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_tokenUri_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "tokenURI",
			calldata: [tokenId],
		};
	};

	const game_system_tokenUri = async (tokenId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_tokenUri_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_tokenMetadata_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "token_metadata",
			calldata: [tokenId],
		};
	};

	const game_system_tokenMetadata = async (tokenId: BigNumberish) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_game_system_tokenMetadata_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_transferFrom_calldata = (from: string, to: string, tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "transferFrom",
			calldata: [from, to, tokenId],
		};
	};

	const game_system_transferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_transferFrom_calldata(from, to, tokenId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_system_surrender_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "game_system",
			entrypoint: "surrender",
			calldata: [gameId],
		};
	};

	const game_system_surrender = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_system_surrender_calldata(gameId),
				DOJO_NAMESPACE,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const gg_sync_system_getQuestsCompleted = async (playerAddress: string) => {
		try {
			return await provider.call(DOJO_NAMESPACE, build_gg_sync_system_getQuestsCompleted_calldata(playerAddress));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	const build_gg_sync_system_getQuestsCompleted_calldata = (playerAddress: string): DojoCall => {
		return {
			contractName: "gg_sync_system",
			entrypoint: "get_quests_completed",
			calldata: [playerAddress],
		};
	};

	return {
		gg_sync_system: {
			getQuestsCompleted: gg_sync_system_getQuestsCompleted,
			buildGetQuestsCompletedCalldata: build_gg_sync_system_getQuestsCompleted_calldata,
		},
		map_system: {
			advanceNode: map_system_advanceNode,
			buildAdvanceNodeCalldata: build_map_system_advanceNode_calldata,
			createMapLevel: map_system_createMapLevel,
			buildCreateMapLevelCalldata: build_map_system_createMapLevel_calldata,
			getLevelMap: map_system_getLevelMap,
			buildGetLevelMapCalldata: build_map_system_getLevelMap_calldata,
			getNode: map_system_getNode,
			buildGetNodeCalldata: build_map_system_getNode_calldata,
		},
		game_system: {
			approve: game_system_approve,
			buildApproveCalldata: build_game_system_approve_calldata,
			balanceOf: game_system_balanceOf,
			buildBalanceOfCalldata: build_game_system_balanceOf_calldata,
			emitMetadataUpdate: game_system_emitMetadataUpdate,
			buildEmitMetadataUpdateCalldata: build_game_system_emitMetadataUpdate_calldata,
			gameCount: game_system_gameCount,
			buildGameCountCalldata: build_game_system_gameCount_calldata,
			gameMetadata: game_system_gameMetadata,
			buildGameMetadataCalldata: build_game_system_gameMetadata_calldata,
			getApproved: game_system_getApproved,
			buildGetApprovedCalldata: build_game_system_getApproved_calldata,
			isApprovedForAll: game_system_isApprovedForAll,
			buildIsApprovedForAllCalldata: build_game_system_isApprovedForAll_calldata,
			mint: game_system_mint,
			buildMintCalldata: build_game_system_mint_calldata,
			name: game_system_name,
			buildNameCalldata: build_game_system_name_calldata,
			ownerOf: game_system_ownerOf,
			buildOwnerOfCalldata: build_game_system_ownerOf_calldata,
			safeTransferFrom: game_system_safeTransferFrom,
			buildSafeTransferFromCalldata: build_game_system_safeTransferFrom_calldata,
			score: game_system_score,
			buildScoreCalldata: build_game_system_score_calldata,
			scoreAttribute: game_system_scoreAttribute,
			buildScoreAttributeCalldata: build_game_system_scoreAttribute_calldata,
			scoreModel: game_system_scoreModel,
			buildScoreModelCalldata: build_game_system_scoreModel_calldata,
			setApprovalForAll: game_system_setApprovalForAll,
			buildSetApprovalForAllCalldata: build_game_system_setApprovalForAll_calldata,
			settingExists: game_system_settingExists,
			buildSettingExistsCalldata: build_game_system_settingExists_calldata,
			settingsModel: game_system_settingsModel,
			buildSettingsModelCalldata: build_game_system_settingsModel_calldata,
			startGame: game_system_startGame,
			buildStartGameCalldata: build_game_system_startGame_calldata,
			supportsInterface: game_system_supportsInterface,
			buildSupportsInterfaceCalldata: build_game_system_supportsInterface_calldata,
			surrender: game_system_surrender,
			buildSurrenderCalldata: build_game_system_surrender_calldata,
			symbol: game_system_symbol,
			buildSymbolCalldata: build_game_system_symbol_calldata,
			tokenUri: game_system_tokenUri,
			buildTokenUriCalldata: build_game_system_tokenUri_calldata,
			tokenMetadata: game_system_tokenMetadata,
			buildTokenMetadataCalldata: build_game_system_tokenMetadata_calldata,
			transferFrom: game_system_transferFrom,
			buildTransferFromCalldata: build_game_system_transferFrom_calldata,
		},
		shop_system: {
			burnCard: shop_system_burnCard,
			buildBurnCardCalldata: build_shop_system_burnCard_calldata,
			buyCard: shop_system_buyCard,
			buildBuyCardCalldata: build_shop_system_buyCard_calldata,
			buyLootBox: shop_system_buyLootBox,
			buildBuyLootBoxCalldata: build_shop_system_buyLootBox_calldata,
			buyPokerHand: shop_system_buyPokerHand,
			buildBuyPokerHandCalldata: build_shop_system_buyPokerHand_calldata,
			buyPowerUp: shop_system_buyPowerUp,
			buildBuyPowerUpCalldata: build_shop_system_buyPowerUp_calldata,
			buySpecialCard: shop_system_buySpecialCard,
			buildBuySpecialCardCalldata: build_shop_system_buySpecialCard_calldata,
			buySpecialSlot: shop_system_buySpecialSlot,
			buildBuySpecialSlotCalldata: build_shop_system_buySpecialSlot_calldata,
			getShopItems: shop_system_getShopItems,
			buildGetShopItemsCalldata: build_shop_system_getShopItems_calldata,
			reroll: shop_system_reroll,
			buildRerollCalldata: build_shop_system_reroll_calldata,
			selectCardsFromLootBox: shop_system_selectCardsFromLootBox,
			buildSelectCardsFromLootBoxCalldata: build_shop_system_selectCardsFromLootBox_calldata,
			sellSpecialCard: shop_system_sellSpecialCard,
			buildSellSpecialCardCalldata: build_shop_system_sellSpecialCard_calldata,
			skipShop: shop_system_skipShop,
			buildSkipShopCalldata: build_shop_system_skipShop_calldata,
		},
		rage_system: {
			calculate: rage_system_calculate,
			buildCalculateCalldata: build_rage_system_calculate_calldata,
			reset: rage_system_reset,
			buildResetCalldata: build_rage_system_reset_calldata,
		},
		action_system: {
			changeModifierCard: action_system_changeModifierCard,
			buildChangeModifierCardCalldata: build_action_system_changeModifierCard_calldata,
			discard: action_system_discard,
			buildDiscardCalldata: build_action_system_discard_calldata,
			play: action_system_play,
			buildPlayCalldata: build_action_system_play_calldata,
		},
		mods_info_system: {
			getCumulativeInfo: mods_info_system_getCumulativeInfo,
			buildGetCumulativeInfoCalldata: build_mods_info_system_getCumulativeInfo_calldata,
			getGameConfig: mods_info_system_getGameConfig,
			buildGetGameConfigCalldata: build_mods_info_system_getGameConfig_calldata,
			getGameMods: mods_info_system_getGameMods,
			buildGetGameModsCalldata: build_mods_info_system_getGameMods_calldata,
			getRageCardsIds: mods_info_system_getRageCardsIds,
			buildGetRageCardsIdsCalldata: build_mods_info_system_getRageCardsIds_calldata,
			getSpecialCardsIds: mods_info_system_getSpecialCardsIds,
			buildGetSpecialCardsIdsCalldata: build_mods_info_system_getSpecialCardsIds_calldata,
		},
		poker_hand_system: {
			getPlayerPokerHands: poker_hand_system_getPlayerPokerHands,
			buildGetPlayerPokerHandsCalldata: build_poker_hand_system_getPlayerPokerHands_calldata,
		},
		mod_manager_registrator: {
			getRegisteredManagers: mod_manager_registrator_getRegisteredManagers,
			buildGetRegisteredManagersCalldata: build_mod_manager_registrator_getRegisteredManagers_calldata,
			registerManagers: mod_manager_registrator_registerManagers,
			buildRegisterManagersCalldata: build_mod_manager_registrator_registerManagers_calldata,
		},
	};
}
