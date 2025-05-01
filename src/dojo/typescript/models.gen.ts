import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, CairoOption, CairoOptionVariant } from 'starknet';

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

// Type definition for `jokers_of_neon_lib::models::data::map::LevelMap` struct
export interface LevelMap {
	game_id: number;
	level: number;
	stages: Array<NodeTypeEnum>;
	level_nodes: Array<Array<number>>;
	latest_level_node_id: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::LevelMapValue` struct
export interface LevelMapValue {
	stages: Array<NodeTypeEnum>;
	level_nodes: Array<Array<number>>;
	latest_level_node_id: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::Node` struct
export interface Node {
	game_id: number;
	id: number;
	node_type: NodeTypeEnum;
	data: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::NodeChilds` struct
export interface NodeChilds {
	game_id: number;
	node_id: number;
	childs: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::data::map::NodeChildsValue` struct
export interface NodeChildsValue {
	childs: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::data::map::NodeValue` struct
export interface NodeValue {
	node_type: NodeTypeEnum;
	data: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::TraveledNodes` struct
export interface TraveledNodes {
	game_id: number;
	level: number;
	nodes: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::data::map::TraveledNodesValue` struct
export interface TraveledNodesValue {
	nodes: Array<number>;
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
	current_node_id: number;
	hand_len: number;
	plays: number;
	discards: number;
	current_specials_len: number;
	special_slots: number;
	cash: number;
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
	current_node_id: number;
	hand_len: number;
	plays: number;
	discards: number;
	current_specials_len: number;
	special_slots: number;
	cash: number;
	available_rerolls: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::player::PlayerLevelPokerHand` struct
export interface PlayerLevelPokerHand {
	game_id: number;
	poker_hand: PokerHandEnum;
	level: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_lib::models::status::game::player::PlayerLevelPokerHandValue` struct
export interface PlayerLevelPokerHandValue {
	level: number;
	multi: number;
	points: number;
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
	current_score: number;
	target_score: number;
	remaining_plays: number;
	remaining_discards: number;
	rages: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::status::round::round::RoundValue` struct
export interface RoundValue {
	current_score: number;
	target_score: number;
	remaining_plays: number;
	remaining_discards: number;
	rages: Array<number>;
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
	poker_hands_address: string;
}

// Type definition for `jokers_of_neon_mods::models::mod_config::ModConfigValue` struct
export interface ModConfigValue {
	deck_address: string;
	specials_address: string;
	rages_address: string;
	loot_boxes_address: string;
	game_config_address: string;
	shop_config_address: string;
	poker_hands_address: string;
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

// Type definition for `tournaments::components::models::game::GameCounter` struct
export interface GameCounter {
	key: number;
	count: number;
}

// Type definition for `tournaments::components::models::game::GameCounterValue` struct
export interface GameCounterValue {
	count: number;
}

// Type definition for `tournaments::components::models::game::GameMetadata` struct
export interface GameMetadata {
	contract_address: string;
	creator_address: string;
	name: number;
	description: string;
	developer: number;
	publisher: number;
	genre: number;
	image: string;
}

// Type definition for `tournaments::components::models::game::GameMetadataValue` struct
export interface GameMetadataValue {
	creator_address: string;
	name: number;
	description: string;
	developer: number;
	publisher: number;
	genre: number;
	image: string;
}

// Type definition for `tournaments::components::models::game::Score` struct
export interface Score {
	game_id: number;
	score: number;
}

// Type definition for `tournaments::components::models::game::ScoreValue` struct
export interface ScoreValue {
	score: number;
}

// Type definition for `tournaments::components::models::game::Settings` struct
export interface Settings {
	id: number;
	name: number;
	value: number;
}

// Type definition for `tournaments::components::models::game::SettingsCounter` struct
export interface SettingsCounter {
	key: number;
	count: number;
}

// Type definition for `tournaments::components::models::game::SettingsCounterValue` struct
export interface SettingsCounterValue {
	count: number;
}

// Type definition for `tournaments::components::models::game::SettingsDetails` struct
export interface SettingsDetails {
	id: number;
	name: number;
	description: string;
	exists: boolean;
}

// Type definition for `tournaments::components::models::game::SettingsDetailsValue` struct
export interface SettingsDetailsValue {
	name: number;
	description: string;
	exists: boolean;
}

// Type definition for `tournaments::components::models::game::SettingsValue` struct
export interface SettingsValue {
	value: number;
}

// Type definition for `tournaments::components::models::game::TokenMetadata` struct
export interface TokenMetadata {
	token_id: number;
	minted_by: string;
	player_name: number;
	settings_id: number;
	lifecycle: Lifecycle;
}

// Type definition for `tournaments::components::models::game::TokenMetadataValue` struct
export interface TokenMetadataValue {
	minted_by: string;
	player_name: number;
	settings_id: number;
	lifecycle: Lifecycle;
}

// Type definition for `tournaments::components::models::lifecycle::Lifecycle` struct
export interface Lifecycle {
	mint: number;
	start: CairoOption<number>;
	end: CairoOption<number>;
}

// Type definition for `achievement::events::index::TrophyCreation` struct
export interface TrophyCreation {
	id: number;
	hidden: boolean;
	index: number;
	points: number;
	start: number;
	end: number;
	group: number;
	icon: number;
	title: number;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyCreationValue` struct
export interface TrophyCreationValue {
	hidden: boolean;
	index: number;
	points: number;
	start: number;
	end: number;
	group: number;
	icon: number;
	title: number;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyProgression` struct
export interface TrophyProgression {
	player_id: number;
	task_id: number;
	count: number;
	time: number;
}

// Type definition for `achievement::events::index::TrophyProgressionValue` struct
export interface TrophyProgressionValue {
	count: number;
	time: number;
}

// Type definition for `achievement::types::index::Task` struct
export interface Task {
	id: number;
	total: number;
	description: string;
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

// Type definition for `jokers_of_neon_lib::events::card_activate_event::CardActivateEvent` struct
export interface CardActivateEvent {
	player: string;
	game_id: number;
	special_id: number;
}

// Type definition for `jokers_of_neon_lib::events::card_activate_event::CardActivateEventValue` struct
export interface CardActivateEventValue {
	game_id: number;
	special_id: number;
}

// Type definition for `jokers_of_neon_lib::events::card_play_event::CardPlayEvent` struct
export interface CardPlayEvent {
	player: string;
	game_id: number;
	mod_id: number;
	event_type: EventTypeEnum;
	special: Array<[number, number]>;
	hand: Array<[number, number]>;
}

// Type definition for `jokers_of_neon_lib::events::card_play_event::CardPlayEventValue` struct
export interface CardPlayEventValue {
	game_id: number;
	mod_id: number;
	event_type: EventTypeEnum;
	special: Array<[number, number]>;
	hand: Array<[number, number]>;
}

// Type definition for `jokers_of_neon_lib::models::data::map::NodeType` enum
export type NodeType = {
	None: string;
	Round: string;
	Rage: string;
	Reward: string;
	Store: string;
}
export type NodeTypeEnum = CairoCustomEnum;

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
	Round: string;
	Rage: string;
	Reward: string;
	Challenge: string;
	Map: string;
	Store: string;
	Lootbox: string;
	GameOver: string;
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
	Joker: string;
	Wild: string;
	None: string;
}
export type EventTypeEnum = CairoCustomEnum;

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
		ModManagerRegistrator: ModManagerRegistrator,
		ModManagerRegistratorValue: ModManagerRegistratorValue,
	},
	jokers_of_neon_lib: {
		DeckCard: DeckCard,
		DeckCardValue: DeckCardValue,
		GameDeck: GameDeck,
		GameDeckValue: GameDeckValue,
		LevelMap: LevelMap,
		LevelMapValue: LevelMapValue,
		Node: Node,
		NodeChilds: NodeChilds,
		NodeChildsValue: NodeChildsValue,
		NodeValue: NodeValue,
		TraveledNodes: TraveledNodes,
		TraveledNodesValue: TraveledNodesValue,
		GamePowerUp: GamePowerUp,
		GamePowerUpValue: GamePowerUpValue,
		CurrentSpecialCards: CurrentSpecialCards,
		CurrentSpecialCardsValue: CurrentSpecialCardsValue,
		Game: Game,
		GameValue: GameValue,
		PlayerLevelPokerHand: PlayerLevelPokerHand,
		PlayerLevelPokerHandValue: PlayerLevelPokerHandValue,
		RageRound: RageRound,
		RageRoundValue: RageRoundValue,
		CurrentHand: CurrentHand,
		CurrentHandValue: CurrentHandValue,
		Round: Round,
		RoundValue: RoundValue,
		BlisterPackItem: BlisterPackItem,
		BlisterPackItemValue: BlisterPackItemValue,
		BlisterPackResult: BlisterPackResult,
		BlisterPackResultValue: BlisterPackResultValue,
		BurnItem: BurnItem,
		BurnItemValue: BurnItemValue,
		CardItem: CardItem,
		CardItemValue: CardItemValue,
		PokerHandItem: PokerHandItem,
		PokerHandItemValue: PokerHandItemValue,
		PowerUpItem: PowerUpItem,
		PowerUpItemValue: PowerUpItemValue,
		SlotSpecialCardsItem: SlotSpecialCardsItem,
		SlotSpecialCardsItemValue: SlotSpecialCardsItemValue,
		SpecialCardItem: SpecialCardItem,
		SpecialCardItemValue: SpecialCardItemValue,
		GameTracker: GameTracker,
		GameTrackerValue: GameTrackerValue,
		PokerHandTracker: PokerHandTracker,
		PokerHandTrackerValue: PokerHandTrackerValue,
		PurchaseTracker: PurchaseTracker,
		PurchaseTrackerValue: PurchaseTrackerValue,
	},
	jokers_of_neon_mods: {
		ModConfig: ModConfig,
		ModConfigValue: ModConfigValue,
		ModTracker: ModTracker,
		ModTrackerValue: ModTrackerValue,
		RageData: RageData,
		RageDataValue: RageDataValue,
		SpecialData: SpecialData,
		SpecialDataValue: SpecialDataValue,
	},
	tournaments: {
		GameCounter: GameCounter,
		GameCounterValue: GameCounterValue,
		GameMetadata: GameMetadata,
		GameMetadataValue: GameMetadataValue,
		Score: Score,
		ScoreValue: ScoreValue,
		Settings: Settings,
		SettingsCounter: SettingsCounter,
		SettingsCounterValue: SettingsCounterValue,
		SettingsDetails: SettingsDetails,
		SettingsDetailsValue: SettingsDetailsValue,
		SettingsValue: SettingsValue,
		TokenMetadata: TokenMetadata,
		TokenMetadataValue: TokenMetadataValue,
		Lifecycle: Lifecycle,
	},
	achievement: {
		TrophyCreation: TrophyCreation,
		TrophyCreationValue: TrophyCreationValue,
		TrophyProgression: TrophyProgression,
		TrophyProgressionValue: TrophyProgressionValue,
		Task: Task,
		CardScoreEvent: CardScoreEvent,
		CardScoreEventValue: CardScoreEventValue,
		CreateGameEvent: CreateGameEvent,
		CreateGameEventValue: CreateGameEventValue,
		CurrentHandEvent: CurrentHandEvent,
		CurrentHandEventValue: CurrentHandEventValue,
		DetailEarnedEvent: DetailEarnedEvent,
		DetailEarnedEventValue: DetailEarnedEventValue,
		GameEvent: GameEvent,
		GameEventValue: GameEventValue,
		GamePowerUpEvent: GamePowerUpEvent,
		GamePowerUpEventValue: GamePowerUpEventValue,
		ModifierCardSuitEvent: ModifierCardSuitEvent,
		ModifierCardSuitEventValue: ModifierCardSuitEventValue,
		ModifierNeonCardEvent: ModifierNeonCardEvent,
		ModifierNeonCardEventValue: ModifierNeonCardEventValue,
		ModifierWildCardEvent: ModifierWildCardEvent,
		ModifierWildCardEventValue: ModifierWildCardEventValue,
		PlayGameOverEvent: PlayGameOverEvent,
		PlayGameOverEventValue: PlayGameOverEventValue,
		PlayWinGameEvent: PlayWinGameEvent,
		PlayWinGameEventValue: PlayWinGameEventValue,
		PowerUpEvent: PowerUpEvent,
		PowerUpEventValue: PowerUpEventValue,
		RoundScoreEvent: RoundScoreEvent,
		RoundScoreEventValue: RoundScoreEventValue,
		CardActivateEvent: CardActivateEvent,
		CardActivateEventValue: CardActivateEventValue,
		CardPlayEvent: CardPlayEvent,
		CardPlayEventValue: CardPlayEventValue,
	},
}
export const schema: SchemaType = {
	jokers_of_neon_core: {
		ModManagerRegistrator: {
			mod_manager_key: 0,
			owner: "",
			mod_manager_address: "",
			rage_manager_address: "",
			special_manager_address: "",
		},
		ModManagerRegistratorValue: {
			owner: "",
			mod_manager_address: "",
			rage_manager_address: "",
			special_manager_address: "",
		},
	},
	jokers_of_neon_lib: {
		DeckCard: {
			game_id: 0,
			index: 0,
			card_id: 0,
		},
		DeckCardValue: {
			card_id: 0,
		},
		GameDeck: {
			game_id: 0,
			len: 0,
			round_len: 0,
		},
		GameDeckValue: {
			len: 0,
			round_len: 0,
		},
		LevelMap: {
			game_id: 0,
			level: 0,
			stages: [new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Store: undefined, })],
			level_nodes: [[0]],
			latest_level_node_id: 0,
		},
		LevelMapValue: {
			stages: [new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Store: undefined, })],
			level_nodes: [[0]],
			latest_level_node_id: 0,
		},
		Node: {
			game_id: 0,
			id: 0,
		node_type: new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Store: undefined, }),
			data: 0,
		},
		NodeChilds: {
			game_id: 0,
			node_id: 0,
			childs: [0],
		},
		NodeChildsValue: {
			childs: [0],
		},
		NodeValue: {
		node_type: new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Store: undefined, }),
			data: 0,
		},
		TraveledNodes: {
			game_id: 0,
			level: 0,
			nodes: [0],
		},
		TraveledNodesValue: {
			nodes: [0],
		},
		GamePowerUp: {
			game_id: 0,
			power_ups: [0],
		},
		GamePowerUpValue: {
			power_ups: [0],
		},
		CurrentSpecialCards: {
			game_id: 0,
			idx: 0,
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
			selling_price: 0,
		},
		CurrentSpecialCardsValue: {
			effect_card_id: 0,
			is_temporary: false,
			remaining: 0,
			selling_price: 0,
		},
		Game: {
			id: 0,
			mod_id: 0,
		state: new CairoCustomEnum({ 
					Round: "",
				Rage: undefined,
				Reward: undefined,
				Challenge: undefined,
				Map: undefined,
				Store: undefined,
				Lootbox: undefined,
				GameOver: undefined, }),
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
		},
		GameValue: {
			mod_id: 0,
		state: new CairoCustomEnum({ 
					Round: "",
				Rage: undefined,
				Reward: undefined,
				Challenge: undefined,
				Map: undefined,
				Store: undefined,
				Lootbox: undefined,
				GameOver: undefined, }),
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
		},
		PlayerLevelPokerHand: {
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
			multi: 0,
			points: 0,
		},
		PlayerLevelPokerHandValue: {
			level: 0,
			multi: 0,
			points: 0,
		},
		RageRound: {
			game_id: 0,
			is_active: false,
			current_probability: 0,
			active_rage_ids: [0],
			last_active_level: 0,
		},
		RageRoundValue: {
			is_active: false,
			current_probability: 0,
			active_rage_ids: [0],
			last_active_level: 0,
		},
		CurrentHand: {
			game_id: 0,
			cards: [0],
		},
		CurrentHandValue: {
			cards: [0],
		},
		Round: {
			game_id: 0,
			current_score: 0,
			target_score: 0,
			remaining_plays: 0,
			remaining_discards: 0,
			rages: [0],
		},
		RoundValue: {
			current_score: 0,
			target_score: 0,
			remaining_plays: 0,
			remaining_discards: 0,
			rages: [0],
		},
		BlisterPackItem: {
			game_id: 0,
			idx: 0,
			blister_pack_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BlisterPackItemValue: {
			blister_pack_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BlisterPackResult: {
			game_id: 0,
			cards_picked: false,
			cards: [0],
		},
		BlisterPackResultValue: {
			cards_picked: false,
			cards: [0],
		},
		BurnItem: {
			game_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		BurnItemValue: {
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		CardItem: {
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
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PokerHandItem: {
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
			game_id: 0,
			idx: 0,
			power_up_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		PowerUpItemValue: {
			power_up_id: 0,
			cost: 0,
			discount_cost: 0,
			purchased: false,
		},
		SlotSpecialCardsItem: {
			game_id: 0,
			cost: 0,
			discount_cost: 0,
		},
		SlotSpecialCardsItemValue: {
			cost: 0,
			discount_cost: 0,
		},
		SpecialCardItem: {
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
			card_id: 0,
			cost: 0,
			discount_cost: 0,
			temporary_cost: 0,
			temporary_discount_cost: 0,
			purchased: false,
		},
		GameTracker: {
			game_id: 0,
			power_ups_used: 0,
			highest_hand: 0,
			rage_wins: 0,
			special_cards_removed: 0,
		},
		GameTrackerValue: {
			power_ups_used: 0,
			highest_hand: 0,
			rage_wins: 0,
			special_cards_removed: 0,
		},
		PokerHandTracker: {
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
			mod_id: 0,
			deck_address: "",
			specials_address: "",
			rages_address: "",
			loot_boxes_address: "",
			game_config_address: "",
			shop_config_address: "",
			poker_hands_address: "",
		},
		ModConfigValue: {
			deck_address: "",
			specials_address: "",
			rages_address: "",
			loot_boxes_address: "",
			game_config_address: "",
			shop_config_address: "",
			poker_hands_address: "",
		},
		ModTracker: {
			mod_tracker_key: 0,
			total_mods: 0,
		},
		ModTrackerValue: {
			total_mods: 0,
		},
		RageData: {
			mod_id: 0,
			rage_id: 0,
			contract_address: "",
		},
		RageDataValue: {
			contract_address: "",
		},
		SpecialData: {
			mod_id: 0,
			special_id: 0,
			contract_address: "",
		},
		SpecialDataValue: {
			contract_address: "",
		},
	},
	tournaments: {
		GameCounter: {
			key: 0,
			count: 0,
		},
		GameCounterValue: {
			count: 0,
		},
		GameMetadata: {
			contract_address: "",
			creator_address: "",
			name: 0,
		description: "",
			developer: 0,
			publisher: 0,
			genre: 0,
		image: "",
		},
		GameMetadataValue: {
			creator_address: "",
			name: 0,
		description: "",
			developer: 0,
			publisher: 0,
			genre: 0,
		image: "",
		},
		Score: {
			game_id: 0,
			score: 0,
		},
		ScoreValue: {
			score: 0,
		},
		Settings: {
			id: 0,
			name: 0,
			value: 0,
		},
		SettingsCounter: {
			key: 0,
			count: 0,
		},
		SettingsCounterValue: {
			count: 0,
		},
		SettingsDetails: {
			id: 0,
			name: 0,
		description: "",
			exists: false,
		},
		SettingsDetailsValue: {
			name: 0,
		description: "",
			exists: false,
		},
		SettingsValue: {
			value: 0,
		},
		TokenMetadata: {
			token_id: 0,
			minted_by: "",
			player_name: 0,
			settings_id: 0,
		lifecycle: { mint: 0, start: new CairoOption(CairoOptionVariant.None), end: new CairoOption(CairoOptionVariant.None), },
		},
		TokenMetadataValue: {
			minted_by: "",
			player_name: 0,
			settings_id: 0,
		lifecycle: { mint: 0, start: new CairoOption(CairoOptionVariant.None), end: new CairoOption(CairoOptionVariant.None), },
		},
		Lifecycle: {
			mint: 0,
		start: new CairoOption(CairoOptionVariant.None),
		end: new CairoOption(CairoOptionVariant.None),
		},
	}, 
	achievement: {
		TrophyCreation: {
			id: 0,
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyCreationValue: {
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyProgression: {
			player_id: 0,
			task_id: 0,
			count: 0,
			time: 0,
		},
		TrophyProgressionValue: {
			count: 0,
			time: 0,
		},
		Task: {
			id: 0,
			total: 0,
		description: "",
		},
		CardScoreEvent: {
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		CardScoreEventValue: {
			index: 0,
			multi: 0,
			points: 0,
		},
		CreateGameEvent: {
			player: "",
			game_id: 0,
		},
		CreateGameEventValue: {
			game_id: 0,
		},
		CurrentHandEvent: {
			game_id: 0,
			cards: [0],
		},
		CurrentHandEventValue: {
			cards: [0],
		},
		DetailEarnedEvent: {
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
					Round: "",
				Rage: undefined,
				Reward: undefined,
				Challenge: undefined,
				Map: undefined,
				Store: undefined,
				Lootbox: undefined,
				GameOver: undefined, }),
			cash: 0,
		},
		GameEventValue: {
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
					Round: "",
				Rage: undefined,
				Reward: undefined,
				Challenge: undefined,
				Map: undefined,
				Store: undefined,
				Lootbox: undefined,
				GameOver: undefined, }),
			cash: 0,
		},
		GamePowerUpEvent: {
			player: "",
			game_id: 0,
			power_ups: [0],
		},
		GamePowerUpEventValue: {
			game_id: 0,
			power_ups: [0],
		},
		ModifierCardSuitEvent: {
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
			player: "",
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierNeonCardEventValue: {
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierWildCardEvent: {
			player: "",
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		ModifierWildCardEventValue: {
			game_id: 0,
			modifier_card_idx: 0,
			current_hand_card_idx: 0,
		},
		PlayGameOverEvent: {
			player: "",
			game_id: 0,
		},
		PlayGameOverEventValue: {
			game_id: 0,
		},
		PlayWinGameEvent: {
			player: "",
			game_id: 0,
			level: 0,
			player_score: 0,
		},
		PlayWinGameEventValue: {
			game_id: 0,
			level: 0,
			player_score: 0,
		},
		PowerUpEvent: {
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		PowerUpEventValue: {
			index: 0,
			multi: 0,
			points: 0,
		},
		RoundScoreEvent: {
			player: "",
			game_id: 0,
			player_score: 0,
		},
		RoundScoreEventValue: {
			game_id: 0,
			player_score: 0,
		},
		CardActivateEvent: {
			player: "",
			game_id: 0,
			special_id: 0,
		},
		CardActivateEventValue: {
			game_id: 0,
			special_id: 0,
		},
		CardPlayEvent: {
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
				Heart: undefined,
				Joker: undefined,
				Wild: undefined,
				None: undefined, }),
			special: [[0, 0]],
			hand: [[0, 0]],
		},
		CardPlayEventValue: {
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
				Heart: undefined,
				Joker: undefined,
				Wild: undefined,
				None: undefined, }),
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
	LevelMap = 'jokers_of_neon_lib-LevelMap',
	LevelMapValue = 'jokers_of_neon_lib-LevelMapValue',
	Node = 'jokers_of_neon_lib-Node',
	NodeChilds = 'jokers_of_neon_lib-NodeChilds',
	NodeChildsValue = 'jokers_of_neon_lib-NodeChildsValue',
	NodeType = 'jokers_of_neon_lib-NodeType',
	NodeValue = 'jokers_of_neon_lib-NodeValue',
	TraveledNodes = 'jokers_of_neon_lib-TraveledNodes',
	TraveledNodesValue = 'jokers_of_neon_lib-TraveledNodesValue',
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
	GameCounter = 'tournaments-GameCounter',
	GameCounterValue = 'tournaments-GameCounterValue',
	GameMetadata = 'tournaments-GameMetadata',
	GameMetadataValue = 'tournaments-GameMetadataValue',
	Score = 'tournaments-Score',
	ScoreValue = 'tournaments-ScoreValue',
	Settings = 'tournaments-Settings',
	SettingsCounter = 'tournaments-SettingsCounter',
	SettingsCounterValue = 'tournaments-SettingsCounterValue',
	SettingsDetails = 'tournaments-SettingsDetails',
	SettingsDetailsValue = 'tournaments-SettingsDetailsValue',
	SettingsValue = 'tournaments-SettingsValue',
	TokenMetadata = 'tournaments-TokenMetadata',
	TokenMetadataValue = 'tournaments-TokenMetadataValue',
	Lifecycle = 'tournaments-Lifecycle',
	TrophyCreation = 'achievement-TrophyCreation',
	TrophyCreationValue = 'achievement-TrophyCreationValue',
	TrophyProgression = 'achievement-TrophyProgression',
	TrophyProgressionValue = 'achievement-TrophyProgressionValue',
	Task = 'achievement-Task',
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
	CardActivateEvent = 'jokers_of_neon_lib-CardActivateEvent',
	CardActivateEventValue = 'jokers_of_neon_lib-CardActivateEventValue',
	CardPlayEvent = 'jokers_of_neon_lib-CardPlayEvent',
	CardPlayEventValue = 'jokers_of_neon_lib-CardPlayEventValue',
	EventType = 'jokers_of_neon_lib-EventType',
	Suit = 'jokers_of_neon_lib-Suit',
}