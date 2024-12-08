import type { SchemaType } from "@dojoengine/sdk";

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackItemValue` struct
export interface BlisterPackItemValue {
	fieldOrder: string[];
	blister_pack_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackItem` struct
export interface BlisterPackItem {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	blister_pack_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackResult` struct
export interface BlisterPackResult {
	fieldOrder: string[];
	game_id: number;
	cards_picked: boolean;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackResultValue` struct
export interface BlisterPackResultValue {
	fieldOrder: string[];
	cards_picked: boolean;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BurnItemValue` struct
export interface BurnItemValue {
	fieldOrder: string[];
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BurnItem` struct
export interface BurnItem {
	fieldOrder: string[];
	game_id: number;
	cost: number;
	purchased: boolean;
  discount_cost: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItem` struct
export interface CardItem {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	item_type: CardItemType;
	card_id: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItemValue` struct
export interface CardItemValue {
	fieldOrder: string[];
	card_id: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::round::current_hand_card::CurrentHand` struct
export interface CurrentHand {
	fieldOrder: string[];
	game_id: number;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::round::current_hand_card::CurrentHandValue` struct
export interface CurrentHandValue {
	fieldOrder: string[];
	cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::game::game::CurrentSpecialCards` struct
export interface CurrentSpecialCards {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	effect_card_id: number;
	is_temporary: boolean;
	remaining: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::CurrentSpecialCardsValue` struct
export interface CurrentSpecialCardsValue {
	fieldOrder: string[];
	effect_card_id: number;
	is_temporary: boolean;
	remaining: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::DeckCardValue` struct
export interface DeckCardValue {
	fieldOrder: string[];
	card_id: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::DeckCard` struct
export interface DeckCard {
	fieldOrder: string[];
	game_id: number;
	index: number;
	card_id: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::GameValue` struct
export interface GameValue {
	fieldOrder: string[];
	owner: string;
	player_name: number;
	max_hands: number;
	max_discard: number;
	max_jokers: number;
	round: number;
	player_score: number;
	level: number;
	len_hand: number;
	len_max_current_special_cards: number;
	len_current_special_cards: number;
	current_jokers: number;
	len_max_current_power_ups: number;
	state: GameState;
	cash: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::Game` struct
export interface Game {
	fieldOrder: string[];
	id: number;
	owner: string;
	player_name: number;
	max_hands: number;
	max_discard: number;
	max_jokers: number;
	round: number;
	player_score: number;
	level: number;
	len_hand: number;
	len_max_current_special_cards: number;
	len_current_special_cards: number;
	current_jokers: number;
	len_max_current_power_ups: number;
	state: GameState;
	cash: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::GameDeckValue` struct
export interface GameDeckValue {
	fieldOrder: string[];
	len: number;
	round_len: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::GameDeck` struct
export interface GameDeck {
	fieldOrder: string[];
	game_id: number;
	len: number;
	round_len: number;
}

// Type definition for `jokers_of_neon::models::data::power_up::GamePowerUp` struct
export interface GamePowerUp {
	fieldOrder: string[];
	game_id: number;
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::power_up::GamePowerUpValue` struct
export interface GamePowerUpValue {
	fieldOrder: string[];
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::game::player::PlayerLevelPokerHandValue` struct
export interface PlayerLevelPokerHandValue {
	fieldOrder: string[];
	level: number;
}

// Type definition for `jokers_of_neon::models::status::game::player::PlayerLevelPokerHand` struct
export interface PlayerLevelPokerHand {
	fieldOrder: string[];
	game_id: number;
	poker_hand: PokerHand;
	level: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PokerHandItemValue` struct
export interface PokerHandItemValue {
	fieldOrder: string[];
	poker_hand: PokerHand;
	level: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PokerHandItem` struct
export interface PokerHandItem {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	poker_hand: PokerHand;
	level: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PowerUpItemValue` struct
export interface PowerUpItemValue {
	fieldOrder: string[];
	power_up_id: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PowerUpItem` struct
export interface PowerUpItem {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	power_up_id: number;
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::game::rage::RageRound` struct
export interface RageRound {
	fieldOrder: string[];
	game_id: number;
	is_active: boolean;
	current_probability: number;
	active_rage_ids: Array<number>;
	last_active_level: number;
}

// Type definition for `jokers_of_neon::models::status::game::rage::RageRoundValue` struct
export interface RageRoundValue {
	fieldOrder: string[];
	is_active: boolean;
	current_probability: number;
	active_rage_ids: Array<number>;
	last_active_level: number;
}

// Type definition for `jokers_of_neon::models::status::round::round::Round` struct
export interface Round {
	fieldOrder: string[];
	game_id: number;
	player_score: number;
	level_score: number;
	hands: number;
	discard: number;
}

// Type definition for `jokers_of_neon::models::status::round::round::RoundValue` struct
export interface RoundValue {
	fieldOrder: string[];
	player_score: number;
	level_score: number;
	hands: number;
	discard: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::ShopValue` struct
export interface ShopValue {
	fieldOrder: string[];
	reroll_cost: number;
	reroll_executed: boolean;
	len_item_common_cards: number;
	len_item_modifier_cards: number;
	len_item_special_cards: number;
	len_item_poker_hands: number;
	len_item_blister_pack: number;
	len_item_power_ups: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::Shop` struct
export interface Shop {
	fieldOrder: string[];
	game_id: number;
	reroll_cost: number;
	reroll_executed: boolean;
	len_item_common_cards: number;
	len_item_modifier_cards: number;
	len_item_special_cards: number;
	len_item_poker_hands: number;
	len_item_blister_pack: number;
	len_item_power_ups: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::ShopTracker` struct
export interface ShopTracker {
	fieldOrder: string[];
	game_id: number;
	count_reroll: number;
	count_burn: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::ShopTrackerValue` struct
export interface ShopTrackerValue {
	fieldOrder: string[];
	count_reroll: number;
	count_burn: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SlotSpecialCardsItemValue` struct
export interface SlotSpecialCardsItemValue {
	fieldOrder: string[];
	cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SlotSpecialCardsItem` struct
export interface SlotSpecialCardsItem {
	fieldOrder: string[];
	game_id: number;
	cost: number;
	purchased: boolean;
  discount_cost: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SpecialCardItemValue` struct
export interface SpecialCardItemValue {
	fieldOrder: string[];
	card_id: number;
	cost: number;
	temporary_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SpecialCardItem` struct
export interface SpecialCardItem {
	fieldOrder: string[];
	game_id: number;
	idx: number;
	card_id: number;
	cost: number;
	temporary_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItemType` enum
export enum CardItemType {
	None,
	Common,
	Modifier,
}

// Type definition for `jokers_of_neon::models::status::game::game::GameState` enum
export enum GameState {
	IN_GAME,
	AT_SHOP,
	FINISHED,
	OPEN_BLISTER_PACK,
}

// Type definition for `jokers_of_neon::models::data::poker_hand::PokerHand` enum
export enum PokerHand {
	None,
	RoyalFlush,
	StraightFlush,
	FiveOfAKind,
	FourOfAKind,
	FullHouse,
	Straight,
	Flush,
	ThreeOfAKind,
	TwoPair,
	OnePair,
	HighCard,
}

export interface JokersOfNeonSchemaType extends SchemaType {
	jokers_of_neon: {
		BlisterPackItemValue: BlisterPackItemValue,
		BlisterPackItem: BlisterPackItem,
		BlisterPackResult: BlisterPackResult,
		BlisterPackResultValue: BlisterPackResultValue,
		BurnItemValue: BurnItemValue,
		BurnItem: BurnItem,
		CardItem: CardItem,
		CardItemValue: CardItemValue,
		CurrentHand: CurrentHand,
		CurrentHandValue: CurrentHandValue,
		CurrentSpecialCards: CurrentSpecialCards,
		CurrentSpecialCardsValue: CurrentSpecialCardsValue,
		DeckCardValue: DeckCardValue,
		DeckCard: DeckCard,
		GameValue: GameValue,
		Game: Game,
		GameDeckValue: GameDeckValue,
		GameDeck: GameDeck,
		GamePowerUp: GamePowerUp,
		GamePowerUpValue: GamePowerUpValue,
		PlayerLevelPokerHandValue: PlayerLevelPokerHandValue,
		PlayerLevelPokerHand: PlayerLevelPokerHand,
		PokerHandItemValue: PokerHandItemValue,
		PokerHandItem: PokerHandItem,
		PowerUpItemValue: PowerUpItemValue,
		PowerUpItem: PowerUpItem,
		RageRound: RageRound,
		RageRoundValue: RageRoundValue,
		Round: Round,
		RoundValue: RoundValue,
		ShopValue: ShopValue,
		Shop: Shop,
		ShopTracker: ShopTracker,
		ShopTrackerValue: ShopTrackerValue,
		SlotSpecialCardsItemValue: SlotSpecialCardsItemValue,
		SlotSpecialCardsItem: SlotSpecialCardsItem,
		SpecialCardItemValue: SpecialCardItemValue,
		SpecialCardItem: SpecialCardItem,
		ERC__Balance: ERC__Balance,
		ERC__Token: ERC__Token,
		ERC__Transfer: ERC__Transfer,
	},
}
export const schema: JokersOfNeonSchemaType = {
	jokers_of_neon: {
		BlisterPackItemValue: {
			fieldOrder: ['blister_pack_id', 'cost', 'cost_discount', 'purchased'],
			blister_pack_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BlisterPackItem: {
			fieldOrder: ['game_id', 'idx', 'blister_pack_id', 'cost', 'cost_discount', 'purchased'],
			game_id: 0,
			idx: 0,
			blister_pack_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BlisterPackResult: {
			fieldOrder: ['game_id', 'cards_picked', 'cards'],
			game_id: 0,
			cards_picked: false,
			cards: [0],
		},
		BlisterPackResultValue: {
			fieldOrder: ['cards_picked', 'cards'],
			cards_picked: false,
			cards: [0],
		},
		BurnItemValue: {
			fieldOrder: ['cost', 'purchased'],
			cost: 0,
			purchased: false,
		},
		BurnItem: {
			fieldOrder: ['game_id', 'cost', 'purchased'],
			game_id: 0,
			cost: 0,
			purchased: false,
			discount_cost: 0,
		},
		CardItem: {
			fieldOrder: ['game_id', 'idx', 'item_type', 'card_id', 'cost', 'purchased'],
			game_id: 0,
			idx: 0,
			item_type: CardItemType.None,
			card_id: 0,
			cost: 0,
			purchased: false,
		},
		CardItemValue: {
			fieldOrder: ['card_id', 'cost', 'purchased'],
			card_id: 0,
			cost: 0,
			purchased: false,
		},
		CurrentHand: {
			fieldOrder: ['game_id', 'cards'],
			game_id: 0,
			cards: [0],
		},
		CurrentHandValue: {
			fieldOrder: ['cards'],
			cards: [0],
		},
		CurrentSpecialCards: {
			fieldOrder: ['game_id', 'idx', 'effect_card_id', 'is_temporary', 'remaining'],
			game_id: 0,
			idx: 0,
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
		},
		CurrentSpecialCardsValue: {
			fieldOrder: ['effect_card_id', 'is_temporary', 'remaining'],
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
		},
		DeckCardValue: {
			fieldOrder: ['card_id'],
			card_id: 0,
		},
		DeckCard: {
			fieldOrder: ['game_id', 'index', 'card_id'],
			game_id: 0,
			index: 0,
			card_id: 0,
		},
		GameValue: {
			fieldOrder: ['owner', 'player_name', 'max_hands', 'max_discard', 'max_jokers', 'round', 'player_score', 'level', 'len_hand', 'len_max_current_special_cards', 'len_current_special_cards', 'current_jokers', 'len_max_current_power_ups', 'state', 'cash'],
			owner: "",
			player_name: 0,
			max_hands: 0,
			max_discard: 0,
			max_jokers: 0,
			round: 0,
			player_score: 0,
			level: 0,
			len_hand: 0,
			len_max_current_special_cards: 0,
			len_current_special_cards: 0,
			current_jokers: 0,
			len_max_current_power_ups: 0,
			state: GameState.IN_GAME,
			cash: 0,
		},
		Game: {
			fieldOrder: ['id', 'owner', 'player_name', 'max_hands', 'max_discard', 'max_jokers', 'round', 'player_score', 'level', 'len_hand', 'len_max_current_special_cards', 'len_current_special_cards', 'current_jokers', 'len_max_current_power_ups', 'state', 'cash'],
			id: 0,
			owner: "",
			player_name: 0,
			max_hands: 0,
			max_discard: 0,
			max_jokers: 0,
			round: 0,
			player_score: 0,
			level: 0,
			len_hand: 0,
			len_max_current_special_cards: 0,
			len_current_special_cards: 0,
			current_jokers: 0,
			len_max_current_power_ups: 0,
			state: GameState.IN_GAME,
			cash: 0,
		},
		GameDeckValue: {
			fieldOrder: ['len', 'round_len'],
			len: 0,
			round_len: 0,
		},
		GameDeck: {
			fieldOrder: ['game_id', 'len', 'round_len'],
			game_id: 0,
			len: 0,
			round_len: 0,
		},
		GamePowerUp: {
			fieldOrder: ['game_id', 'power_ups'],
			game_id: 0,
			power_ups: [0],
		},
		GamePowerUpValue: {
			fieldOrder: ['power_ups'],
			power_ups: [0],
		},
		PlayerLevelPokerHandValue: {
			fieldOrder: ['level'],
			level: 0,
		},
		PlayerLevelPokerHand: {
			fieldOrder: ['game_id', 'poker_hand', 'level'],
			game_id: 0,
			poker_hand: PokerHand.None,
			level: 0,
		},
		PokerHandItemValue: {
			fieldOrder: ['poker_hand', 'level', 'cost', 'purchased'],
			poker_hand: PokerHand.None,
			level: 0,
			cost: 0,
			purchased: false,
		},
		PokerHandItem: {
			fieldOrder: ['game_id', 'idx', 'poker_hand', 'level', 'cost', 'purchased'],
			game_id: 0,
			idx: 0,
			poker_hand: PokerHand.None,
			level: 0,
			cost: 0,
			purchased: false,
		},
		PowerUpItemValue: {
			fieldOrder: ['power_up_id', 'cost', 'purchased'],
			power_up_id: 0,
			cost: 0,
			purchased: false,
		},
		PowerUpItem: {
			fieldOrder: ['game_id', 'idx', 'power_up_id', 'cost', 'purchased'],
			game_id: 0,
			idx: 0,
			power_up_id: 0,
			cost: 0,
			purchased: false,
		},
		RageRound: {
			fieldOrder: ['game_id', 'is_active', 'current_probability', 'active_rage_ids', 'last_active_level'],
			game_id: 0,
			is_active: false,
			current_probability: 0,
			active_rage_ids: [0],
			last_active_level: 0,
		},
		RageRoundValue: {
			fieldOrder: ['is_active', 'current_probability', 'active_rage_ids', 'last_active_level'],
			is_active: false,
			current_probability: 0,
			active_rage_ids: [0],
			last_active_level: 0,
		},
		Round: {
			fieldOrder: ['game_id', 'player_score', 'level_score', 'hands', 'discard'],
			game_id: 0,
			player_score: 0,
			level_score: 0,
			hands: 0,
			discard: 0,
		},
		RoundValue: {
			fieldOrder: ['player_score', 'level_score', 'hands', 'discard'],
			player_score: 0,
			level_score: 0,
			hands: 0,
			discard: 0,
		},
		ShopValue: {
			fieldOrder: ['reroll_cost', 'reroll_executed', 'len_item_common_cards', 'len_item_modifier_cards', 'len_item_special_cards', 'len_item_poker_hands', 'len_item_blister_pack', 'len_item_power_ups'],
			reroll_cost: 0,
			reroll_executed: false,
			len_item_common_cards: 0,
			len_item_modifier_cards: 0,
			len_item_special_cards: 0,
			len_item_poker_hands: 0,
			len_item_blister_pack: 0,
			len_item_power_ups: 0,
		},
		Shop: {
			fieldOrder: ['game_id', 'reroll_cost', 'reroll_executed', 'len_item_common_cards', 'len_item_modifier_cards', 'len_item_special_cards', 'len_item_poker_hands', 'len_item_blister_pack', 'len_item_power_ups'],
			game_id: 0,
			reroll_cost: 0,
			reroll_executed: false,
			len_item_common_cards: 0,
			len_item_modifier_cards: 0,
			len_item_special_cards: 0,
			len_item_poker_hands: 0,
			len_item_blister_pack: 0,
			len_item_power_ups: 0,
		},
		ShopTracker: {
			fieldOrder: ['game_id', 'count_reroll', 'count_burn'],
			game_id: 0,
			count_reroll: 0,
			count_burn: 0,
		},
		ShopTrackerValue: {
			fieldOrder: ['count_reroll', 'count_burn'],
			count_reroll: 0,
			count_burn: 0,
		},
		SlotSpecialCardsItemValue: {
			fieldOrder: ['cost', 'purchased'],
			cost: 0,
			purchased: false,
		},
		SlotSpecialCardsItem: {
			fieldOrder: ['game_id', 'cost', 'purchased'],
			game_id: 0,
			cost: 0,
			purchased: false,
			discount_cost: 0,
		},
		SpecialCardItemValue: {
			fieldOrder: ['card_id', 'cost', 'temporary_cost', 'purchased'],
			card_id: 0,
			cost: 0,
			temporary_cost: 0,
			purchased: false,
		},
		SpecialCardItem: {
			fieldOrder: ['game_id', 'idx', 'card_id', 'cost', 'temporary_cost', 'purchased'],
			game_id: 0,
			idx: 0,
			card_id: 0,
			cost: 0,
			temporary_cost: 0,
			purchased: false,
		},
		ERC__Balance: {
			fieldOrder: ['balance', 'type', 'tokenmetadata'],
			balance: '',
			type: 'ERC20',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
		},
		ERC__Token: {
			fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
			name: '',
			symbol: '',
			tokenId: '',
			decimals: '',
			contractAddress: '',
		},
		ERC__Transfer: {
			fieldOrder: ['from', 'to', 'amount', 'type', 'executed', 'tokenMetadata'],
			from: '',
			to: '',
			amount: '',
			type: 'ERC20',
			executedAt: '',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
			transactionHash: '',
		},

	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}