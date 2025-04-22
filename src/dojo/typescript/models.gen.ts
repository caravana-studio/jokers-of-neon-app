import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum } from 'starknet';

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `jokers_of_neon_core::systems::mod_manager_registrator::ModManagerRegistrator` struct
export interface ModManagerRegistrator {
	mod_manager_key: number;
	owner: string;
	mod_manager_address: string;
	rage_manager_address: string;
	special_manager_address: string;
}

// Type definition for `jokers_of_neon_core::systems::mod_manager_registrator::ModManagerRegistratorValue` struct
export interface ModManagerRegistratorValue {
	owner: string;
	mod_manager_address: string;
	rage_manager_address: string;
	special_manager_address: string;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::DeckCard` struct
export interface DeckCard {
	game_id: number;
	index: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::DeckCardValue` struct
export interface DeckCardValue {
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::GameDeck` struct
export interface GameDeck {
	game_id: number;
	len: number;
	round_len: number;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::GameDeckValue` struct
export interface GameDeckValue {
	len: number;
	round_len: number;
}

// Type definition for `jokers_of_neon_lib::models::data::power_up::GamePowerUp` struct
export interface GamePowerUp {
	game_id: number;
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::data::power_up::GamePowerUpValue` struct
export interface GamePowerUpValue {
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::game::game::CurrentSpecialCards` struct
export interface CurrentSpecialCards {
	game_id: number;
	idx: number;
	effect_card_id: number;
	is_temporary: boolean;
	remaining: number;
	selling_price: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::game::CurrentSpecialCardsValue` struct
export interface CurrentSpecialCardsValue {
	effect_card_id: number;
	is_temporary: boolean;
	remaining: number;
	selling_price: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::game::Game` struct
export interface Game {
	id: number;
	mod_id: number;
	state: GameStateEnum;
	owner: string;
	player_name: number;
	player_score: number;
	level: number;
	hand_len: number;
	plays: number;
	discards: number;
	current_specials_len: number;
	special_slots: number;
	cash: number;
	shop_config_id: number;
	available_rerolls: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::game::GameValue` struct
export interface GameValue {
	mod_id: number;
	state: GameStateEnum;
	owner: string;
	player_name: number;
	player_score: number;
	level: number;
	hand_len: number;
	plays: number;
	discards: number;
	current_specials_len: number;
	special_slots: number;
	cash: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::player::PlayerLevelPokerHand` struct
export interface PlayerLevelPokerHand {
	game_id: number;
	poker_hand: PokerHandEnum;
	level: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::player::PlayerLevelPokerHandValue` struct
export interface PlayerLevelPokerHandValue {
	level: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::rage::RageRound` struct
export interface RageRound {
	game_id: number;
	is_active: boolean;
	current_probability: number;
	active_rage_ids: Array<number>;
	last_active_level: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::rage::RageRoundValue` struct
export interface RageRoundValue {
	is_active: boolean;
	current_probability: number;
	active_rage_ids: Array<number>;
	last_active_level: number;
}

// Type definition for `jokers_of_neon_lib::models::status::round::current_hand_card::CurrentHand` struct
export interface CurrentHand {
	game_id: number;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::round::current_hand_card::CurrentHandValue` struct
export interface CurrentHandValue {
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::round::round::Round` struct
export interface Round {
	game_id: number;
	player_score: number;
	level_score: number;
	remaining_plays: number;
	remaining_discards: number;
}

// Type definition for `jokers_of_neon_lib::models::status::round::round::RoundValue` struct
export interface RoundValue {
	player_score: number;
	level_score: number;
	remaining_plays: number;
	remaining_discards: number;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BlisterPackItem` struct
export interface BlisterPackItem {
	game_id: number;
	idx: number;
	blister_pack_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BlisterPackItemValue` struct
export interface BlisterPackItemValue {
	blister_pack_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BlisterPackResult` struct
export interface BlisterPackResult {
	game_id: number;
	cards_picked: boolean;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BlisterPackResultValue` struct
export interface BlisterPackResultValue {
	cards_picked: boolean;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BurnItem` struct
export interface BurnItem {
	game_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BurnItemValue` struct
export interface BurnItemValue {
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::CardItem` struct
export interface CardItem {
	game_id: number;
	idx: number;
	item_type: CardItemTypeEnum;
	card_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::CardItemValue` struct
export interface CardItemValue {
	card_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::PokerHandItem` struct
export interface PokerHandItem {
	game_id: number;
	idx: number;
	poker_hand: PokerHandEnum;
	level: number;
	multi: number;
	points: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::PokerHandItemValue` struct
export interface PokerHandItemValue {
	poker_hand: PokerHandEnum;
	level: number;
	multi: number;
	points: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::PowerUpItem` struct
export interface PowerUpItem {
	game_id: number;
	idx: number;
	power_up_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::PowerUpItemValue` struct
export interface PowerUpItemValue {
	power_up_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::ReRollItem` struct
export interface ReRollItem {
	game_id: number;
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::ReRollItemValue` struct
export interface ReRollItemValue {
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::SlotSpecialCardsItem` struct
export interface SlotSpecialCardsItem {
	game_id: number;
	cost: number;
	discount_cost: number;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::SlotSpecialCardsItemValue` struct
export interface SlotSpecialCardsItemValue {
	cost: number;
	discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::SpecialCardItem` struct
export interface SpecialCardItem {
	game_id: number;
	idx: number;
	card_id: number;
	cost: number;
	discount_cost: number;
	temporary_cost: number;
	temporary_discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::SpecialCardItemValue` struct
export interface SpecialCardItemValue {
	card_id: number;
	cost: number;
	discount_cost: number;
	temporary_cost: number;
	temporary_discount_cost: number;
	purchased: boolean;
}

// Type definition for `jokers_of_neon_lib::models::tracker::GameTracker` struct
export interface GameTracker {
	game_id: number;
	power_ups_used: number;
	highest_hand: number;
	rage_wins: number;
	special_cards_removed: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::GameTrackerValue` struct
export interface GameTrackerValue {
	power_ups_used: number;
	highest_hand: number;
	rage_wins: number;
	special_cards_removed: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::PokerHandTracker` struct
export interface PokerHandTracker {
	game_id: number;
	royal_flush: number;
	straight_flush: number;
	five_of_a_kind: number;
	four_of_a_kind: number;
	full_house: number;
	straight: number;
	flush: number;
	three_of_a_kind: number;
	two_pair: number;
	one_pair: number;
	high_card: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::PokerHandTrackerValue` struct
export interface PokerHandTrackerValue {
	royal_flush: number;
	straight_flush: number;
	five_of_a_kind: number;
	four_of_a_kind: number;
	full_house: number;
	straight: number;
	flush: number;
	three_of_a_kind: number;
	two_pair: number;
	one_pair: number;
	high_card: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::PurchaseTracker` struct
export interface PurchaseTracker {
	game_id: number;
	traditonal_cards_count: number;
	modifier_cards_count: number;
	special_cards_count: number;
	loot_boxes_count: number;
	power_up_count: number;
	level_poker_hands_count: number;
	burn_count: number;
	reroll_count: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::PurchaseTrackerValue` struct
export interface PurchaseTrackerValue {
	traditonal_cards_count: number;
	modifier_cards_count: number;
	special_cards_count: number;
	loot_boxes_count: number;
	power_up_count: number;
	level_poker_hands_count: number;
	burn_count: number;
	reroll_count: number;
}

// Type definition for `jokers_of_neon_mods::models::mod_config::ModConfig` struct
export interface ModConfig {
	mod_id: number;
	deck_address: string;
	specials_address: string;
	rages_address: string;
	loot_boxes_address: string;
	game_config_address: string;
	shop_config_address: string;
}

// Type definition for `jokers_of_neon_mods::models::mod_config::ModConfigValue` struct
export interface ModConfigValue {
	deck_address: string;
	specials_address: string;
	rages_address: string;
	loot_boxes_address: string;
	game_config_address: string;
	shop_config_address: string;
}

// Type definition for `jokers_of_neon_mods::models::mod_tracker::ModTracker` struct
export interface ModTracker {
	mod_tracker_key: number;
	total_mods: number;
}

// Type definition for `jokers_of_neon_mods::models::mod_tracker::ModTrackerValue` struct
export interface ModTrackerValue {
	total_mods: number;
}

// Type definition for `jokers_of_neon_mods::models::rage_data::RageData` struct
export interface RageData {
	mod_id: number;
	rage_id: number;
	contract_address: string;
}

// Type definition for `jokers_of_neon_mods::models::rage_data::RageDataValue` struct
export interface RageDataValue {
	contract_address: string;
}

// Type definition for `jokers_of_neon_mods::models::special_data::SpecialData` struct
export interface SpecialData {
	mod_id: number;
	special_id: number;
	contract_address: string;
}

// Type definition for `jokers_of_neon_mods::models::special_data::SpecialDataValue` struct
export interface SpecialDataValue {
	contract_address: string;
}

// Type definition for `jokers_of_neon_core::models::events::CardScoreEvent` struct
export interface CardScoreEvent {
	player: string;
	index: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_core::models::events::CardScoreEventValue` struct
export interface CardScoreEventValue {
	index: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_core::models::events::CreateGameEvent` struct
export interface CreateGameEvent {
	player: string;
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::CreateGameEventValue` struct
export interface CreateGameEventValue {
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::CurrentHandEvent` struct
export interface CurrentHandEvent {
	game_id: number;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_core::models::events::CurrentHandEventValue` struct
export interface CurrentHandEventValue {
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_core::models::events::DetailEarnedEvent` struct
export interface DetailEarnedEvent {
	player: string;
	game_id: number;
	round_defeat: number;
	level_bonus: number;
	hands_left: number;
	hands_left_cash: number;
	discard_left: number;
	discard_left_cash: number;
	rage_card_defeated: number;
	rage_card_defeated_cash: number;
	total: number;
}

// Type definition for `jokers_of_neon_core::models::events::DetailEarnedEventValue` struct
export interface DetailEarnedEventValue {
	game_id: number;
	round_defeat: number;
	level_bonus: number;
	hands_left: number;
	hands_left_cash: number;
	discard_left: number;
	discard_left_cash: number;
	rage_card_defeated: number;
	rage_card_defeated_cash: number;
	total: number;
}

// Type definition for `jokers_of_neon_core::models::events::GameEvent` struct
export interface GameEvent {
	id: number;
	mod_id: number;
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
	state: GameStateEnum;
	cash: number;
}

// Type definition for `jokers_of_neon_core::models::events::GameEventValue` struct
export interface GameEventValue {
	mod_id: number;
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
	state: GameStateEnum;
	cash: number;
}

// Type definition for `jokers_of_neon_core::models::events::GamePowerUpEvent` struct
export interface GamePowerUpEvent {
	player: string;
	game_id: number;
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon_core::models::events::GamePowerUpEventValue` struct
export interface GamePowerUpEventValue {
	game_id: number;
	power_ups: Array<number>;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierCardSuitEvent` struct
export interface ModifierCardSuitEvent {
	player: string;
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
	suit: SuitEnum;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierCardSuitEventValue` struct
export interface ModifierCardSuitEventValue {
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
	suit: SuitEnum;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierNeonCardEvent` struct
export interface ModifierNeonCardEvent {
	player: string;
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierNeonCardEventValue` struct
export interface ModifierNeonCardEventValue {
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierWildCardEvent` struct
export interface ModifierWildCardEvent {
	player: string;
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon_core::models::events::ModifierWildCardEventValue` struct
export interface ModifierWildCardEventValue {
	game_id: number;
	modifier_card_idx: number;
	current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon_core::models::events::PlayGameOverEvent` struct
export interface PlayGameOverEvent {
	player: string;
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::PlayGameOverEventValue` struct
export interface PlayGameOverEventValue {
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::PlayWinGameEvent` struct
export interface PlayWinGameEvent {
	player: string;
	game_id: number;
	level: number;
	player_score: number;
}

// Type definition for `jokers_of_neon_core::models::events::PlayWinGameEventValue` struct
export interface PlayWinGameEventValue {
	game_id: number;
	level: number;
	player_score: number;
}

// Type definition for `jokers_of_neon_core::models::events::PowerUpEvent` struct
export interface PowerUpEvent {
	player: string;
	index: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_core::models::events::PowerUpEventValue` struct
export interface PowerUpEventValue {
	index: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_core::models::events::RoundScoreEvent` struct
export interface RoundScoreEvent {
	player: string;
	game_id: number;
	player_score: number;
}

// Type definition for `jokers_of_neon_core::models::events::RoundScoreEventValue` struct
export interface RoundScoreEventValue {
	game_id: number;
	player_score: number;
}

// Type definition for `jokers_of_neon_lib::events::card_play_event::CardPlayEvent` struct
export interface CardPlayEvent {
	player: string;
	game_id: number;
	mod_id: number;
	event_type: EventTypeTypeEnum;
	special: Array<[number, number]>;
	hand: Array<[number, number]>;
}

// Type definition for `jokers_of_neon_lib::events::card_play_event::CardPlayEventValue` struct
export interface CardPlayEventValue {
	game_id: number;
	mod_id: number;
	event_type: EventTypeTypeEnum;
	special: Array<[number, number]>;
	hand: Array<[number, number]>;
}

// Type definition for `jokers_of_neon_lib::models::data::poker_hand::PokerHand` enum
export type PokerHand = {
	None: string;
	RoyalFlush: string;
	StraightFlush: string;
	FiveOfAKind: string;
	FourOfAKind: string;
	FullHouse: string;
	Straight: string;
	Flush: string;
	ThreeOfAKind: string;
	TwoPair: string;
	OnePair: string;
	HighCard: string;
}
export type PokerHandEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::status::game::game::GameState` enum
export type GameState = {
	IN_GAME: string;
	AT_SHOP: string;
	FINISHED: string;
	OPEN_BLISTER_PACK: string;
}
export type GameStateEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::CardItemType` enum
export type CardItemType = {
	None: string;
	Common: string;
	Modifier: string;
}
export type CardItemTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::events::card_play_event::EventType` enum
export type EventType = {
	Cash: string;
	Club: string;
	Diamond: string;
	Point: string;
	Multi: string;
	Neon: string;
	Spade: string;
	Heart: string;
}

export enum EventTypeEnum {
	Cash,
	Club,
	Diamond,
	Point,
	Multi,
	Neon,
	Spade,
	Heart,
  }

export type EventTypeTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::data::card::Suit` enum
export type Suit = {
	None: string;
	Clubs: string;
	Diamonds: string;
	Hearts: string;
	Spades: string;
	Joker: string;
	Wild: string;
}
export type SuitEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	jokers_of_neon_core: {
		ModManagerRegistrator: WithFieldOrder<ModManagerRegistrator>,
		ModManagerRegistratorValue: WithFieldOrder<ModManagerRegistratorValue>,
	},
	jokers_of_neon_lib: {
		DeckCard: WithFieldOrder<DeckCard>,
		DeckCardValue: WithFieldOrder<DeckCardValue>,
		GameDeck: WithFieldOrder<GameDeck>,
		GameDeckValue: WithFieldOrder<GameDeckValue>,
		GamePowerUp: WithFieldOrder<GamePowerUp>,
		GamePowerUpValue: WithFieldOrder<GamePowerUpValue>,
		CurrentSpecialCards: WithFieldOrder<CurrentSpecialCards>,
		CurrentSpecialCardsValue: WithFieldOrder<CurrentSpecialCardsValue>,
		Game: WithFieldOrder<Game>,
		GameValue: WithFieldOrder<GameValue>,
		PlayerLevelPokerHand: WithFieldOrder<PlayerLevelPokerHand>,
		PlayerLevelPokerHandValue: WithFieldOrder<PlayerLevelPokerHandValue>,
		RageRound: WithFieldOrder<RageRound>,
		RageRoundValue: WithFieldOrder<RageRoundValue>,
		CurrentHand: WithFieldOrder<CurrentHand>,
		CurrentHandValue: WithFieldOrder<CurrentHandValue>,
		Round: WithFieldOrder<Round>,
		RoundValue: WithFieldOrder<RoundValue>,
		BlisterPackItem: WithFieldOrder<BlisterPackItem>,
		BlisterPackItemValue: WithFieldOrder<BlisterPackItemValue>,
		BlisterPackResult: WithFieldOrder<BlisterPackResult>,
		BlisterPackResultValue: WithFieldOrder<BlisterPackResultValue>,
		BurnItem: WithFieldOrder<BurnItem>,
		BurnItemValue: WithFieldOrder<BurnItemValue>,
		CardItem: WithFieldOrder<CardItem>,
		CardItemValue: WithFieldOrder<CardItemValue>,
		PokerHandItem: WithFieldOrder<PokerHandItem>,
		PokerHandItemValue: WithFieldOrder<PokerHandItemValue>,
		PowerUpItem: WithFieldOrder<PowerUpItem>,
		PowerUpItemValue: WithFieldOrder<PowerUpItemValue>,
		ReRollItem: WithFieldOrder<ReRollItem>,
		ReRollItemValue: WithFieldOrder<ReRollItemValue>,
		SlotSpecialCardsItem: WithFieldOrder<SlotSpecialCardsItem>,
		SlotSpecialCardsItemValue: WithFieldOrder<SlotSpecialCardsItemValue>,
		SpecialCardItem: WithFieldOrder<SpecialCardItem>,
		SpecialCardItemValue: WithFieldOrder<SpecialCardItemValue>,
		GameTracker: WithFieldOrder<GameTracker>,
		GameTrackerValue: WithFieldOrder<GameTrackerValue>,
		PokerHandTracker: WithFieldOrder<PokerHandTracker>,
		PokerHandTrackerValue: WithFieldOrder<PokerHandTrackerValue>,
		PurchaseTracker: WithFieldOrder<PurchaseTracker>,
		PurchaseTrackerValue: WithFieldOrder<PurchaseTrackerValue>,
	},
	jokers_of_neon_mods: {
		ModConfig: WithFieldOrder<ModConfig>,
		ModConfigValue: WithFieldOrder<ModConfigValue>,
		ModTracker: WithFieldOrder<ModTracker>,
		ModTrackerValue: WithFieldOrder<ModTrackerValue>,
		RageData: WithFieldOrder<RageData>,
		RageDataValue: WithFieldOrder<RageDataValue>,
		SpecialData: WithFieldOrder<SpecialData>,
		SpecialDataValue: WithFieldOrder<SpecialDataValue>,
		CardScoreEvent: WithFieldOrder<CardScoreEvent>,
		CardScoreEventValue: WithFieldOrder<CardScoreEventValue>,
		CreateGameEvent: WithFieldOrder<CreateGameEvent>,
		CreateGameEventValue: WithFieldOrder<CreateGameEventValue>,
		CurrentHandEvent: WithFieldOrder<CurrentHandEvent>,
		CurrentHandEventValue: WithFieldOrder<CurrentHandEventValue>,
		DetailEarnedEvent: WithFieldOrder<DetailEarnedEvent>,
		DetailEarnedEventValue: WithFieldOrder<DetailEarnedEventValue>,
		GameEvent: WithFieldOrder<GameEvent>,
		GameEventValue: WithFieldOrder<GameEventValue>,
		GamePowerUpEvent: WithFieldOrder<GamePowerUpEvent>,
		GamePowerUpEventValue: WithFieldOrder<GamePowerUpEventValue>,
		ModifierCardSuitEvent: WithFieldOrder<ModifierCardSuitEvent>,
		ModifierCardSuitEventValue: WithFieldOrder<ModifierCardSuitEventValue>,
		ModifierNeonCardEvent: WithFieldOrder<ModifierNeonCardEvent>,
		ModifierNeonCardEventValue: WithFieldOrder<ModifierNeonCardEventValue>,
		ModifierWildCardEvent: WithFieldOrder<ModifierWildCardEvent>,
		ModifierWildCardEventValue: WithFieldOrder<ModifierWildCardEventValue>,
		PlayGameOverEvent: WithFieldOrder<PlayGameOverEvent>,
		PlayGameOverEventValue: WithFieldOrder<PlayGameOverEventValue>,
		PlayWinGameEvent: WithFieldOrder<PlayWinGameEvent>,
		PlayWinGameEventValue: WithFieldOrder<PlayWinGameEventValue>,
		PowerUpEvent: WithFieldOrder<PowerUpEvent>,
		PowerUpEventValue: WithFieldOrder<PowerUpEventValue>,
		RoundScoreEvent: WithFieldOrder<RoundScoreEvent>,
		RoundScoreEventValue: WithFieldOrder<RoundScoreEventValue>,
		CardPlayEvent: WithFieldOrder<CardPlayEvent>,
		CardPlayEventValue: WithFieldOrder<CardPlayEventValue>,
	},
}
export const schema: SchemaType = {
	jokers_of_neon_core: {
		ModManagerRegistrator: {
			fieldOrder: ['mod_manager_key', 'owner', 'mod_manager_address', 'rage_manager_address', 'special_manager_address'],
			mod_manager_key: 0,
			owner: "",
			mod_manager_address: "",
			rage_manager_address: "",
			special_manager_address: "",
		},
		ModManagerRegistratorValue: {
			fieldOrder: ['owner', 'mod_manager_address', 'rage_manager_address', 'special_manager_address'],
			owner: "",
			mod_manager_address: "",
			rage_manager_address: "",
			special_manager_address: "",
		},
	}, jokers_of_neon_lib: {
		DeckCard: {
			fieldOrder: ['game_id', 'index', 'card_id'],
			game_id: 0,
			index: 0,
			card_id: 0,
		},
		DeckCardValue: {
			fieldOrder: ['card_id'],
			card_id: 0,
		},
		GameDeck: {
			fieldOrder: ['game_id', 'len', 'round_len'],
			game_id: 0,
			len: 0,
			round_len: 0,
		},
		GameDeckValue: {
			fieldOrder: ['len', 'round_len'],
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
		CurrentSpecialCards: {
			fieldOrder: ['game_id', 'idx', 'effect_card_id', 'is_temporary', 'remaining', 'selling_price'],
			game_id: 0,
			idx: 0,
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
			selling_price: 0,
		},
		CurrentSpecialCardsValue: {
			fieldOrder: ['effect_card_id', 'is_temporary', 'remaining', 'selling_price'],
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
			selling_price: 0,
		},
		Game: {
			fieldOrder: ['id', 'mod_id', 'state', 'owner', 'player_name', 'player_score', 'level', 'hand_len', 'plays', 'discards', 'current_specials_len', 'special_slots', 'cash', 'shop_config_id', 'available_rerolls'],
			id: 0,
			mod_id: 0,
		state: new CairoCustomEnum({ 
					IN_GAME: "",
				AT_SHOP: undefined,
				FINISHED: undefined,
				OPEN_BLISTER_PACK: undefined, }),
			owner: "",
			player_name: 0,
			player_score: 0,
			level: 0,
			hand_len: 0,
			plays: 0,
			discards: 0,
			current_specials_len: 0,
			special_slots: 0,
			cash: 0,
			shop_config_id: 0,
			available_rerolls: 0,
		},
		GameValue: {
			fieldOrder: ['mod_id', 'state', 'owner', 'player_name', 'player_score', 'level', 'hand_len', 'plays', 'discards', 'current_specials_len', 'special_slots', 'cash', 'shop_config_id', 'available_rerolls'],
			mod_id: 0,
		state: new CairoCustomEnum({ 
					IN_GAME: "",
				AT_SHOP: undefined,
				FINISHED: undefined,
				OPEN_BLISTER_PACK: undefined, }),
			owner: "",
			player_name: 0,
			player_score: 0,
			level: 0,
			hand_len: 0,
			plays: 0,
			discards: 0,
			current_specials_len: 0,
			special_slots: 0,
			cash: 0,
		},
		PlayerLevelPokerHand: {
			fieldOrder: ['game_id', 'poker_hand', 'level'],
			game_id: 0,
		poker_hand: new CairoCustomEnum({ 
					None: "",
				RoyalFlush: undefined,
				StraightFlush: undefined,
				FiveOfAKind: undefined,
				FourOfAKind: undefined,
				FullHouse: undefined,
				Straight: undefined,
				Flush: undefined,
				ThreeOfAKind: undefined,
				TwoPair: undefined,
				OnePair: undefined,
				HighCard: undefined, }),
			level: 0,
		},
		PlayerLevelPokerHandValue: {
			fieldOrder: ['level'],
			level: 0,
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
		CurrentHand: {
			fieldOrder: ['game_id', 'cards'],
			game_id: 0,
			cards: [0],
		},
		CurrentHandValue: {
			fieldOrder: ['cards'],
			cards: [0],
		},
		Round: {
			fieldOrder: ['game_id', 'player_score', 'level_score', 'remaining_plays', 'remaining_discards'],
			game_id: 0,
			player_score: 0,
			level_score: 0,
			remaining_plays: 0,
			remaining_discards: 0,
		},
		RoundValue: {
			fieldOrder: ['player_score', 'level_score', 'remaining_plays', 'remaining_discards'],
			player_score: 0,
			level_score: 0,
			remaining_plays: 0,
			remaining_discards: 0,
		},
		BlisterPackItem: {
			fieldOrder: ['game_id', 'idx', 'blister_pack_id', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			idx: 0,
			blister_pack_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BlisterPackItemValue: {
			fieldOrder: ['blister_pack_id', 'cost', 'discount_cost', 'purchased'],
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
		BurnItem: {
			fieldOrder: ['game_id', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BurnItemValue: {
			fieldOrder: ['cost', 'discount_cost', 'purchased'],
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		CardItem: {
			fieldOrder: ['game_id', 'idx', 'item_type', 'card_id', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			idx: 0,
		item_type: new CairoCustomEnum({ 
					None: "",
				Common: undefined,
				Modifier: undefined, }),
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		CardItemValue: {
			fieldOrder: ['card_id', 'cost', 'discount_cost', 'purchased'],
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PokerHandItem: {
			fieldOrder: ['game_id', 'idx', 'poker_hand', 'level', 'multi', 'points', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			idx: 0,
		poker_hand: new CairoCustomEnum({ 
					None: "",
				RoyalFlush: undefined,
				StraightFlush: undefined,
				FiveOfAKind: undefined,
				FourOfAKind: undefined,
				FullHouse: undefined,
				Straight: undefined,
				Flush: undefined,
				ThreeOfAKind: undefined,
				TwoPair: undefined,
				OnePair: undefined,
				HighCard: undefined, }),
			level: 0,
			multi: 0,
			points: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PokerHandItemValue: {
			fieldOrder: ['poker_hand', 'level', 'multi', 'points', 'cost', 'discount_cost', 'purchased'],
		poker_hand: new CairoCustomEnum({ 
					None: "",
				RoyalFlush: undefined,
				StraightFlush: undefined,
				FiveOfAKind: undefined,
				FourOfAKind: undefined,
				FullHouse: undefined,
				Straight: undefined,
				Flush: undefined,
				ThreeOfAKind: undefined,
				TwoPair: undefined,
				OnePair: undefined,
				HighCard: undefined, }),
			level: 0,
			multi: 0,
			points: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PowerUpItem: {
			fieldOrder: ['game_id', 'idx', 'power_up_id', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			idx: 0,
			power_up_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PowerUpItemValue: {
			fieldOrder: ['power_up_id', 'cost', 'discount_cost', 'purchased'],
			power_up_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		ReRollItem: {
			fieldOrder: ['game_id', 'cost', 'discount_cost', 'purchased'],
			game_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		ReRollItemValue: {
			fieldOrder: ['cost', 'discount_cost', 'purchased'],
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		SlotSpecialCardsItem: {
			fieldOrder: ['game_id', 'cost', 'discount_cost'],
			game_id: 0,
			cost: 0,
			discount_cost: 0,
		},
		SlotSpecialCardsItemValue: {
			fieldOrder: ['cost', 'discount_cost', 'purchased'],
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		SpecialCardItem: {
			fieldOrder: ['game_id', 'idx', 'card_id', 'cost', 'discount_cost', 'temporary_cost', 'temporary_discount_cost', 'purchased'],
			game_id: 0,
			idx: 0,
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			temporary_cost: 0,
			temporary_discount_cost: 0,
			purchased: false,
		},
		SpecialCardItemValue: {
			fieldOrder: ['card_id', 'cost', 'discount_cost', 'temporary_cost', 'temporary_discount_cost', 'purchased'],
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			temporary_cost: 0,
			temporary_discount_cost: 0,
			purchased: false,
		},
		GameTracker: {
			fieldOrder: ['game_id', 'power_ups_used', 'highest_hand', 'rage_wins', 'special_cards_removed'],
			game_id: 0,
			power_ups_used: 0,
			highest_hand: 0,
			rage_wins: 0,
			special_cards_removed: 0,
		},
		GameTrackerValue: {
			fieldOrder: ['power_ups_used', 'highest_hand', 'rage_wins', 'special_cards_removed'],
			power_ups_used: 0,
			highest_hand: 0,
			rage_wins: 0,
			special_cards_removed: 0,
		},
		PokerHandTracker: {
			fieldOrder: ['game_id', 'royal_flush', 'straight_flush', 'five_of_a_kind', 'four_of_a_kind', 'full_house', 'straight', 'flush', 'three_of_a_kind', 'two_pair', 'one_pair', 'high_card'],
			game_id: 0,
			royal_flush: 0,
			straight_flush: 0,
			five_of_a_kind: 0,
			four_of_a_kind: 0,
			full_house: 0,
			straight: 0,
			flush: 0,
			three_of_a_kind: 0,
			two_pair: 0,
			one_pair: 0,
			high_card: 0,
		},
		PokerHandTrackerValue: {
			fieldOrder: ['royal_flush', 'straight_flush', 'five_of_a_kind', 'four_of_a_kind', 'full_house', 'straight', 'flush', 'three_of_a_kind', 'two_pair', 'one_pair', 'high_card'],
			royal_flush: 0,
			straight_flush: 0,
			five_of_a_kind: 0,
			four_of_a_kind: 0,
			full_house: 0,
			straight: 0,
			flush: 0,
			three_of_a_kind: 0,
			two_pair: 0,
			one_pair: 0,
			high_card: 0,
		},
		PurchaseTracker: {
			fieldOrder: ['game_id', 'traditonal_cards_count', 'modifier_cards_count', 'special_cards_count', 'loot_boxes_count', 'power_up_count', 'level_poker_hands_count', 'burn_count', 'reroll_count'],
			game_id: 0,
			traditonal_cards_count: 0,
			modifier_cards_count: 0,
			special_cards_count: 0,
			loot_boxes_count: 0,
			power_up_count: 0,
			level_poker_hands_count: 0,
			burn_count: 0,
			reroll_count: 0,
		},
		PurchaseTrackerValue: {
			fieldOrder: ['traditonal_cards_count', 'modifier_cards_count', 'special_cards_count', 'loot_boxes_count', 'power_up_count', 'level_poker_hands_count', 'burn_count', 'reroll_count'],
			traditonal_cards_count: 0,
			modifier_cards_count: 0,
			special_cards_count: 0,
			loot_boxes_count: 0,
			power_up_count: 0,
			level_poker_hands_count: 0,
			burn_count: 0,
			reroll_count: 0,
		},
	}, jokers_of_neon_mods: {
		ModConfig: {
			fieldOrder: ['mod_id', 'deck_address', 'specials_address', 'rages_address', 'loot_boxes_address', 'game_config_address', 'shop_config_address'],
			mod_id: 0,
			deck_address: "",
			specials_address: "",
			rages_address: "",
			loot_boxes_address: "",
			game_config_address: "",
			shop_config_address: "",
		},
		ModConfigValue: {
			fieldOrder: ['deck_address', 'specials_address', 'rages_address', 'loot_boxes_address', 'game_config_address', 'shop_config_address'],
			deck_address: "",
			specials_address: "",
			rages_address: "",
			loot_boxes_address: "",
			game_config_address: "",
			shop_config_address: "",
		},
		ModTracker: {
			fieldOrder: ['mod_tracker_key', 'total_mods'],
			mod_tracker_key: 0,
			total_mods: 0,
		},
		ModTrackerValue: {
			fieldOrder: ['total_mods'],
			total_mods: 0,
		},
		RageData: {
			fieldOrder: ['mod_id', 'rage_id', 'contract_address'],
			mod_id: 0,
			rage_id: 0,
			contract_address: "",
		},
		RageDataValue: {
			fieldOrder: ['contract_address'],
			contract_address: "",
		},
		SpecialData: {
			fieldOrder: ['mod_id', 'special_id', 'contract_address'],
			mod_id: 0,
			special_id: 0,
			contract_address: "",
		},
		SpecialDataValue: {
			fieldOrder: ['contract_address'],
			contract_address: "",
		},
		CardScoreEvent: {
			fieldOrder: ['player', 'index', 'multi', 'points'],
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		CardScoreEventValue: {
			fieldOrder: ['index', 'multi', 'points'],
			index: 0,
			multi: 0,
			points: 0,
		},
		CreateGameEvent: {
			fieldOrder: ['player', 'game_id'],
			player: "",
			game_id: 0,
		},
		CreateGameEventValue: {
			fieldOrder: ['game_id'],
			game_id: 0,
		},
		CurrentHandEvent: {
			fieldOrder: ['game_id', 'cards'],
			game_id: 0,
			cards: [0],
		},
		CurrentHandEventValue: {
			fieldOrder: ['cards'],
			cards: [0],
		},
		DetailEarnedEvent: {
			fieldOrder: ['player', 'game_id', 'round_defeat', 'level_bonus', 'hands_left', 'hands_left_cash', 'discard_left', 'discard_left_cash', 'rage_card_defeated', 'rage_card_defeated_cash', 'total'],
			player: "",
			game_id: 0,
			round_defeat: 0,
			level_bonus: 0,
			hands_left: 0,
			hands_left_cash: 0,
			discard_left: 0,
			discard_left_cash: 0,
			rage_card_defeated: 0,
			rage_card_defeated_cash: 0,
			total: 0,
		},
		DetailEarnedEventValue: {
			fieldOrder: ['game_id', 'round_defeat', 'level_bonus', 'hands_left', 'hands_left_cash', 'discard_left', 'discard_left_cash', 'rage_card_defeated', 'rage_card_defeated_cash', 'total'],
			game_id: 0,
			round_defeat: 0,
			level_bonus: 0,
			hands_left: 0,
			hands_left_cash: 0,
			discard_left: 0,
			discard_left_cash: 0,
			rage_card_defeated: 0,
			rage_card_defeated_cash: 0,
			total: 0,
		},
		GameEvent: {
			fieldOrder: ['id', 'mod_id', 'owner', 'player_name', 'max_hands', 'max_discard', 'max_jokers', 'round', 'player_score', 'level', 'len_hand', 'len_max_current_special_cards', 'len_current_special_cards', 'current_jokers', 'len_max_current_power_ups', 'state', 'cash'],
			id: 0,
			mod_id: 0,
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
		state: new CairoCustomEnum({ 
					IN_GAME: "",
				AT_SHOP: undefined,
				FINISHED: undefined,
				OPEN_BLISTER_PACK: undefined, }),
			cash: 0,
		},
		GameEventValue: {
			fieldOrder: ['mod_id', 'owner', 'player_name', 'max_hands', 'max_discard', 'max_jokers', 'round', 'player_score', 'level', 'len_hand', 'len_max_current_special_cards', 'len_current_special_cards', 'current_jokers', 'len_max_current_power_ups', 'state', 'cash'],
			mod_id: 0,
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
		state: new CairoCustomEnum({ 
					IN_GAME: "",
				AT_SHOP: undefined,
				FINISHED: undefined,
				OPEN_BLISTER_PACK: undefined, }),
			cash: 0,
		},
		GamePowerUpEvent: {
			fieldOrder: ['player', 'game_id', 'power_ups'],
			player: "",
			game_id: 0,
			power_ups: [0],
		},
		GamePowerUpEventValue: {
			fieldOrder: ['game_id', 'power_ups'],
			game_id: 0,
			power_ups: [0],
		},
		ModifierCardSuitEvent: {
			fieldOrder: ['player', 'game_id', 'modifier_card_idx', 'current_hand_card_idx', 'suit'],
			player: "",
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		suit: new CairoCustomEnum({ 
					None: "",
				Clubs: undefined,
				Diamonds: undefined,
				Hearts: undefined,
				Spades: undefined,
				Joker: undefined,
				Wild: undefined, }),
		},
		ModifierCardSuitEventValue: {
			fieldOrder: ['game_id', 'modifier_card_idx', 'current_hand_card_idx', 'suit'],
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		suit: new CairoCustomEnum({ 
					None: "",
				Clubs: undefined,
				Diamonds: undefined,
				Hearts: undefined,
				Spades: undefined,
				Joker: undefined,
				Wild: undefined, }),
		},
		ModifierNeonCardEvent: {
			fieldOrder: ['player', 'game_id', 'modifier_card_idx', 'current_hand_card_idx'],
			player: "",
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierNeonCardEventValue: {
			fieldOrder: ['game_id', 'modifier_card_idx', 'current_hand_card_idx'],
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierWildCardEvent: {
			fieldOrder: ['player', 'game_id', 'modifier_card_idx', 'current_hand_card_idx'],
			player: "",
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierWildCardEventValue: {
			fieldOrder: ['game_id', 'modifier_card_idx', 'current_hand_card_idx'],
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		PlayGameOverEvent: {
			fieldOrder: ['player', 'game_id'],
			player: "",
			game_id: 0,
		},
		PlayGameOverEventValue: {
			fieldOrder: ['game_id'],
			game_id: 0,
		},
		PlayWinGameEvent: {
			fieldOrder: ['player', 'game_id', 'level', 'player_score'],
			player: "",
			game_id: 0,
			level: 0,
			player_score: 0,
		},
		PlayWinGameEventValue: {
			fieldOrder: ['game_id', 'level', 'player_score'],
			game_id: 0,
			level: 0,
			player_score: 0,
		},
		PowerUpEvent: {
			fieldOrder: ['player', 'index', 'multi', 'points'],
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		PowerUpEventValue: {
			fieldOrder: ['index', 'multi', 'points'],
			index: 0,
			multi: 0,
			points: 0,
		},
		RoundScoreEvent: {
			fieldOrder: ['player', 'game_id', 'player_score'],
			player: "",
			game_id: 0,
			player_score: 0,
		},
		RoundScoreEventValue: {
			fieldOrder: ['game_id', 'player_score'],
			game_id: 0,
			player_score: 0,
		},
		CardPlayEvent: {
			fieldOrder: ['player', 'game_id', 'mod_id', 'event_type', 'special', 'hand'],
			player: "",
			game_id: 0,
			mod_id: 0,
		event_type: new CairoCustomEnum({ 
					Cash: "",
				Club: undefined,
				Diamond: undefined,
				Point: undefined,
				Multi: undefined,
				Neon: undefined,
				Spade: undefined,
				Heart: undefined, }),
			special: [[0, 0]],
			hand: [[0, 0]],
		},
		CardPlayEventValue: {
			fieldOrder: ['game_id', 'mod_id', 'event_type', 'special', 'hand'],
			game_id: 0,
			mod_id: 0,
		event_type: new CairoCustomEnum({ 
					Cash: "",
				Club: undefined,
				Diamond: undefined,
				Point: undefined,
				Multi: undefined,
				Neon: undefined,
				Spade: undefined,
				Heart: undefined, }),
			special: [[0, 0]],
			hand: [[0, 0]],
		},
	},
};
export enum ModelsMapping {
	ModManagerRegistrator = 'jokers_of_neon_core-ModManagerRegistrator',
	ModManagerRegistratorValue = 'jokers_of_neon_core-ModManagerRegistratorValue',
	DeckCard = 'jokers_of_neon_lib-DeckCard',
	DeckCardValue = 'jokers_of_neon_lib-DeckCardValue',
	GameDeck = 'jokers_of_neon_lib-GameDeck',
	GameDeckValue = 'jokers_of_neon_lib-GameDeckValue',
	PokerHand = 'jokers_of_neon_lib-PokerHand',
	GamePowerUp = 'jokers_of_neon_lib-GamePowerUp',
	GamePowerUpValue = 'jokers_of_neon_lib-GamePowerUpValue',
	CurrentSpecialCards = 'jokers_of_neon_lib-CurrentSpecialCards',
	CurrentSpecialCardsValue = 'jokers_of_neon_lib-CurrentSpecialCardsValue',
	Game = 'jokers_of_neon_lib-Game',
	GameState = 'jokers_of_neon_lib-GameState',
	GameValue = 'jokers_of_neon_lib-GameValue',
	PlayerLevelPokerHand = 'jokers_of_neon_lib-PlayerLevelPokerHand',
	PlayerLevelPokerHandValue = 'jokers_of_neon_lib-PlayerLevelPokerHandValue',
	RageRound = 'jokers_of_neon_lib-RageRound',
	RageRoundValue = 'jokers_of_neon_lib-RageRoundValue',
	CurrentHand = 'jokers_of_neon_lib-CurrentHand',
	CurrentHandValue = 'jokers_of_neon_lib-CurrentHandValue',
	Round = 'jokers_of_neon_lib-Round',
	RoundValue = 'jokers_of_neon_lib-RoundValue',
	BlisterPackItem = 'jokers_of_neon_lib-BlisterPackItem',
	BlisterPackItemValue = 'jokers_of_neon_lib-BlisterPackItemValue',
	BlisterPackResult = 'jokers_of_neon_lib-BlisterPackResult',
	BlisterPackResultValue = 'jokers_of_neon_lib-BlisterPackResultValue',
	BurnItem = 'jokers_of_neon_lib-BurnItem',
	BurnItemValue = 'jokers_of_neon_lib-BurnItemValue',
	CardItem = 'jokers_of_neon_lib-CardItem',
	CardItemType = 'jokers_of_neon_lib-CardItemType',
	CardItemValue = 'jokers_of_neon_lib-CardItemValue',
	PokerHandItem = 'jokers_of_neon_lib-PokerHandItem',
	PokerHandItemValue = 'jokers_of_neon_lib-PokerHandItemValue',
	PowerUpItem = 'jokers_of_neon_lib-PowerUpItem',
	PowerUpItemValue = 'jokers_of_neon_lib-PowerUpItemValue',
	ReRollItem = 'jokers_of_neon_lib-ReRollItem',
	ReRollItemValue = 'jokers_of_neon_lib-ReRollItemValue',
	SlotSpecialCardsItem = 'jokers_of_neon_lib-SlotSpecialCardsItem',
	SlotSpecialCardsItemValue = 'jokers_of_neon_lib-SlotSpecialCardsItemValue',
	SpecialCardItem = 'jokers_of_neon_lib-SpecialCardItem',
	SpecialCardItemValue = 'jokers_of_neon_lib-SpecialCardItemValue',
	GameTracker = 'jokers_of_neon_lib-GameTracker',
	GameTrackerValue = 'jokers_of_neon_lib-GameTrackerValue',
	PokerHandTracker = 'jokers_of_neon_lib-PokerHandTracker',
	PokerHandTrackerValue = 'jokers_of_neon_lib-PokerHandTrackerValue',
	PurchaseTracker = 'jokers_of_neon_lib-PurchaseTracker',
	PurchaseTrackerValue = 'jokers_of_neon_lib-PurchaseTrackerValue',
	ModConfig = 'jokers_of_neon_mods-ModConfig',
	ModConfigValue = 'jokers_of_neon_mods-ModConfigValue',
	ModTracker = 'jokers_of_neon_mods-ModTracker',
	ModTrackerValue = 'jokers_of_neon_mods-ModTrackerValue',
	RageData = 'jokers_of_neon_mods-RageData',
	RageDataValue = 'jokers_of_neon_mods-RageDataValue',
	SpecialData = 'jokers_of_neon_mods-SpecialData',
	SpecialDataValue = 'jokers_of_neon_mods-SpecialDataValue',
	CardScoreEvent = 'jokers_of_neon_core-CardScoreEvent',
	CardScoreEventValue = 'jokers_of_neon_core-CardScoreEventValue',
	CreateGameEvent = 'jokers_of_neon_core-CreateGameEvent',
	CreateGameEventValue = 'jokers_of_neon_core-CreateGameEventValue',
	CurrentHandEvent = 'jokers_of_neon_core-CurrentHandEvent',
	CurrentHandEventValue = 'jokers_of_neon_core-CurrentHandEventValue',
	DetailEarnedEvent = 'jokers_of_neon_core-DetailEarnedEvent',
	DetailEarnedEventValue = 'jokers_of_neon_core-DetailEarnedEventValue',
	GameEvent = 'jokers_of_neon_core-GameEvent',
	GameEventValue = 'jokers_of_neon_core-GameEventValue',
	GamePowerUpEvent = 'jokers_of_neon_core-GamePowerUpEvent',
	GamePowerUpEventValue = 'jokers_of_neon_core-GamePowerUpEventValue',
	ModifierCardSuitEvent = 'jokers_of_neon_core-ModifierCardSuitEvent',
	ModifierCardSuitEventValue = 'jokers_of_neon_core-ModifierCardSuitEventValue',
	ModifierNeonCardEvent = 'jokers_of_neon_core-ModifierNeonCardEvent',
	ModifierNeonCardEventValue = 'jokers_of_neon_core-ModifierNeonCardEventValue',
	ModifierWildCardEvent = 'jokers_of_neon_core-ModifierWildCardEvent',
	ModifierWildCardEventValue = 'jokers_of_neon_core-ModifierWildCardEventValue',
	PlayGameOverEvent = 'jokers_of_neon_core-PlayGameOverEvent',
	PlayGameOverEventValue = 'jokers_of_neon_core-PlayGameOverEventValue',
	PlayWinGameEvent = 'jokers_of_neon_core-PlayWinGameEvent',
	PlayWinGameEventValue = 'jokers_of_neon_core-PlayWinGameEventValue',
	PowerUpEvent = 'jokers_of_neon_core-PowerUpEvent',
	PowerUpEventValue = 'jokers_of_neon_core-PowerUpEventValue',
	RoundScoreEvent = 'jokers_of_neon_core-RoundScoreEvent',
	RoundScoreEventValue = 'jokers_of_neon_core-RoundScoreEventValue',
	CardPlayEvent = 'jokers_of_neon_lib-CardPlayEvent',
	CardPlayEventValue = 'jokers_of_neon_lib-CardPlayEventValue',
	EventType = 'jokers_of_neon_lib-EventType',
	Suit = 'jokers_of_neon_lib-Suit',
}