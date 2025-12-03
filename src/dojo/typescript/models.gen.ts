import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum } from 'starknet';

// Type definition for `jokers_of_neon_core::models::achievements_tracker::AchievementsTracker` struct
export interface AchievementsTracker {
	player: string;
	id: number;
	completed: boolean;
}

// Type definition for `jokers_of_neon_core::models::daily_missions::DailyMissionTracker` struct
export interface DailyMissionTracker {
	player: string;
	day: number;
	mission_id: number;
	completed: boolean;
}

// Type definition for `jokers_of_neon_core::models::daily_missions::DailyMissionsForDay` struct
export interface DailyMissionsForDay {
	day: number;
	easy_mission_id: number;
	medium_mission_id: number;
	hard_mission_id: number;
}

// Type definition for `jokers_of_neon_core::models::game_specials::GameSpecials` struct
export interface GameSpecials {
	game_id: number;
	specials: Array<Array<number>>;
}

// Type definition for `jokers_of_neon_core::models::lives::LivesConfig` struct
export interface LivesConfig {
	key: number;
	max_lives: number;
	max_lives_battle_pass: number;
	lives_cooldown: number;
	lives_cooldown_season_pass: number;
}

// Type definition for `jokers_of_neon_core::models::lives::PlayerLives` struct
export interface PlayerLives {
	player: string;
	season_id: number;
	available_lives: number;
	max_lives: number;
	next_live_timestamp: number;
}

// Type definition for `jokers_of_neon_core::models::lives::SeasonPass` struct
export interface SeasonPass {
	player: string;
	season_id: number;
	is_active: boolean;
}

// Type definition for `jokers_of_neon_core::models::packs::FreePackConfig` struct
export interface FreePackConfig {
	key: number;
	cooldown: number;
	pack_id: number;
}

// Type definition for `jokers_of_neon_core::models::packs::Item` struct
export interface Item {
	id: number;
	item_type: ItemTypeEnum;
	content_id: number;
	rarity: number;
	skin_id: number;
	skin_rarity: number;
}

// Type definition for `jokers_of_neon_core::models::packs::Pack` struct
export interface Pack {
	id: number;
	season_id: number;
	name: string;
	probabilities: Array<Array<number>>;
}

// Type definition for `jokers_of_neon_core::models::packs::PlayerFreePack` struct
export interface PlayerFreePack {
	player: string;
	next_pack_timestamp: number;
}

// Type definition for `jokers_of_neon_core::models::packs::SeasonContent` struct
export interface SeasonContent {
	season_id: number;
	initialized: boolean;
	items: Array<Array<number>>;
}

// Type definition for `jokers_of_neon_core::models::tournament::Tickets` struct
export interface Tickets {
	player: string;
	season_id: number;
	quantity: number;
}

// Type definition for `jokers_of_neon_core::systems::mod_manager_registrator::ModManagerRegistrator` struct
export interface ModManagerRegistrator {
	mod_manager_key: number;
	owner: string;
	mod_manager_address: string;
	rage_manager_address: string;
	special_manager_address: string;
}

// Type definition for `jokers_of_neon_core::systems::specials::interface::PlayValues` struct
export interface PlayValues {
	game_id: number;
	points: number;
	multi: number;
	cash: number;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::DeckCard` struct
export interface DeckCard {
	game_id: number;
	index: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::data::game_deck::GameDeck` struct
export interface GameDeck {
	game_id: number;
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

// Type definition for `jokers_of_neon_lib::models::data::map::StageTracker` struct
export interface StageTracker {
	game_id: number;
	store_stages: number;
	round_stages: number;
	rage_stages: number;
	total_nodes: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::TraveledNodes` struct
export interface TraveledNodes {
	game_id: number;
	level: number;
	nodes: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::data::power_up::GamePowerUp` struct
export interface GamePowerUp {
	game_id: number;
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
	round: number;
	hand_len: number;
	plays: number;
	discards: number;
	current_specials_len: number;
	special_slots: number;
	cash: number;
	available_rerolls: number;
	seed: number;
	is_tournament: boolean;
}

// Type definition for `jokers_of_neon_lib::models::status::game::player::PlayerLevelPokerHand` struct
export interface PlayerLevelPokerHand {
	game_id: number;
	poker_hand: PokerHandEnum;
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

// Type definition for `jokers_of_neon_lib::models::status::round::current_hand_card::CurrentHand` struct
export interface CurrentHand {
	game_id: number;
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

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BlisterPackItem` struct
export interface BlisterPackItem {
	game_id: number;
	idx: number;
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

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::BurnItem` struct
export interface BurnItem {
	game_id: number;
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

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::PowerUpItem` struct
export interface PowerUpItem {
	game_id: number;
	idx: number;
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

// Type definition for `jokers_of_neon_lib::models::tracker::GameTracker` struct
export interface GameTracker {
	game_id: number;
	highest_hand: number;
	most_played_hand: [PokerHandEnum, number];
	highest_cash: number;
	cards_played_count: number;
	cards_discarded_count: number;
	rage_wins: number;
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

// Type definition for `jokers_of_neon_lib::models::tracker::PurchaseTracker` struct
export interface PurchaseTracker {
	game_id: number;
	traditional_cards_count: number;
	modifier_cards_count: number;
	special_cards_count: number;
	loot_boxes_count: number;
	power_up_count: number;
	level_poker_hands_count: number;
	burn_count: number;
	reroll_count: number;
	special_cards_sold: number;
}

// Type definition for `jokers_of_neon_lib::random::Random` struct
export interface Random {
	key: number;
	seed: number;
}

// Type definition for `jokers_of_neon_mods::models::game_mod::GameMod` struct
export interface GameMod {
	id: number;
	owner: string;
	total_games: number;
	created_date: number;
	last_update_date: number;
}

// Type definition for `jokers_of_neon_mods::models::game_mod::GameModMap` struct
export interface GameModMap {
	idx: number;
	mod_id: number;
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

// Type definition for `jokers_of_neon_mods::models::mod_tracker::ModTracker` struct
export interface ModTracker {
	mod_tracker_key: number;
	total_mods: number;
}

// Type definition for `jokers_of_neon_mods::models::rage_data::RageData` struct
export interface RageData {
	mod_id: number;
	rage_id: number;
	contract_address: string;
}

// Type definition for `jokers_of_neon_mods::models::special_data::SpecialData` struct
export interface SpecialData {
	mod_id: number;
	special_id: number;
	contract_address: string;
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

// Type definition for `achievement::events::index::TrophyProgression` struct
export interface TrophyProgression {
	player_id: number;
	task_id: number;
	count: number;
	time: number;
}

// Type definition for `achievement::types::index::Task` struct
export interface Task {
	id: number;
	total: number;
	description: string;
}

// Type definition for `jokers_of_neon_core::models::events::AchievementCompletedEvent` struct
export interface AchievementCompletedEvent {
	player: string;
	id: number;
}

// Type definition for `jokers_of_neon_core::models::events::CardScoreEvent` struct
export interface CardScoreEvent {
	player: string;
	index: number;
	multi: number;
	points: number;
}

// Type definition for `jokers_of_neon_core::models::events::CreateGameEvent` struct
export interface CreateGameEvent {
	player: string;
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::CurrentHandEvent` struct
export interface CurrentHandEvent {
	game_id: number;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_core::models::events::DailyMissionCompletedEvent` struct
export interface DailyMissionCompletedEvent {
	player: string;
	id: number;
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
	rerolls: number;
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

// Type definition for `jokers_of_neon_core::models::events::GamePowerUpEvent` struct
export interface GamePowerUpEvent {
	player: string;
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

// Type definition for `jokers_of_neon_core::models::events::ModifierNeonCardEvent` struct
export interface ModifierNeonCardEvent {
	player: string;
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

// Type definition for `jokers_of_neon_core::models::events::PlayGameOverEvent` struct
export interface PlayGameOverEvent {
	player: string;
	game_id: number;
}

// Type definition for `jokers_of_neon_core::models::events::PlayWinGameEvent` struct
export interface PlayWinGameEvent {
	player: string;
	game_id: number;
	level: number;
	player_score: number;
	round: number;
	level_passed: number;
}

// Type definition for `jokers_of_neon_core::models::events::PowerUpEvent` struct
export interface PowerUpEvent {
	player: string;
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

// Type definition for `jokers_of_neon_lib::events::card_activate_event::CardActivateEvent` struct
export interface CardActivateEvent {
	player: string;
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

// Type definition for `jokers_of_neon_lib::models::tracker::BuyBlisterPackEvent` struct
export interface BuyBlisterPackEvent {
	game_id: number;
	loot_boxes_count: number;
	level: number;
	current_node_id: number;
	blister_pack_id: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyBlisterPackResultEvent` struct
export interface BuyBlisterPackResultEvent {
	game_id: number;
	loot_boxes_count: number;
	level: number;
	current_node_id: number;
	cards: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyBurnEvent` struct
export interface BuyBurnEvent {
	game_id: number;
	burn_count: number;
	level: number;
	current_node_id: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyLevelUpPokerHandEvent` struct
export interface BuyLevelUpPokerHandEvent {
	game_id: number;
	level_poker_hands_count: number;
	level: number;
	current_node_id: number;
	poker_hand: PokerHandEnum;
	level_hand: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyModifierCardEvent` struct
export interface BuyModifierCardEvent {
	game_id: number;
	modifier_cards_count: number;
	level: number;
	current_node_id: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyPowerUpEvent` struct
export interface BuyPowerUpEvent {
	game_id: number;
	power_up_count: number;
	level: number;
	current_node_id: number;
	power_up_id: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyRerollEvent` struct
export interface BuyRerollEvent {
	game_id: number;
	reroll_count: number;
	level: number;
	current_node_id: number;
	reroll_executed: boolean;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuySlotSpecialCardEvent` struct
export interface BuySlotSpecialCardEvent {
	game_id: number;
	count_slots: number;
	level: number;
	current_node_id: number;
	slot_executed: boolean;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuySpecialCardEvent` struct
export interface BuySpecialCardEvent {
	game_id: number;
	special_cards_count: number;
	level: number;
	current_node_id: number;
	card_id: number;
	is_temporary: boolean;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuySpecialCardsSoldEvent` struct
export interface BuySpecialCardsSoldEvent {
	game_id: number;
	special_cards_sold: number;
	level: number;
	current_node_id: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_lib::models::tracker::BuyTraditionalCardEvent` struct
export interface BuyTraditionalCardEvent {
	game_id: number;
	traditional_cards_count: number;
	level: number;
	current_node_id: number;
	card_id: number;
}

// Type definition for `jokers_of_neon_core::models::packs::WrappedItem` struct
export interface WrappedItem {
	item: Item;
	quality: number;
	marketable: boolean;
}

// Type definition for `jokers_of_neon_lib::configs::game::GameConfig` struct
export interface GameConfig {
	plays: number;
	discards: number;
	max_special_slots: number;
	power_up_slots: number;
	max_power_up_slots: number;
	hand_len: number;
	start_cash: number;
	start_special_slots: number;
	start_rerolls: number;
}

// Type definition for `jokers_of_neon_lib::models::data::card::Card` struct
export interface Card {
	id: number;
	suit: SuitEnum;
	value: ValueEnum;
	points: number;
	multi: number;
}

// Type definition for `jokers_of_neon_lib::models::data::map::ParsedLevelMap` struct
export interface ParsedLevelMap {
	level_nodes: Array<Array<[Node, NodeChilds]>>;
	traveled_nodes: Array<number>;
}

// Type definition for `jokers_of_neon_lib::models::tracker::GameContext` struct
export interface GameContext {
	game: Game;
	round: Round;
	hand: [PokerHandEnum, number];
	card_type: CardTypeEnum;
	cards_played: Array<[boolean, number, Card]>;
	cards_in_hand: Array<[number, Card]>;
	cards_in_deck: Array<number>;
	special_cards: Array<CurrentSpecialCards>;
	power_ups: Array<number>;
	purchase_tracker: PurchaseTracker;
	game_tracker: GameTracker;
	poker_hand_tracker: PokerHandTracker;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged` struct
export interface RoleAdminChanged {
	role: number;
	previous_admin_role: number;
	new_admin_role: number;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted` struct
export interface RoleGranted {
	role: number;
	account: string;
	sender: string;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked` struct
export interface RoleRevoked {
	role: number;
	account: string;
	sender: string;
}

// Type definition for `jokers_of_neon_core::models::packs::ItemType` enum
export const itemType = [
	'Traditional',
	'Special',
	'Neon',
	'Skin',
	'None',
] as const;
export type ItemType = { [key in typeof itemType[number]]: string };
export type ItemTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::data::map::NodeType` enum
export const nodeType = [
	'None',
	'Round',
	'Rage',
	'Reward',
	'Store',
] as const;
export type NodeType = { [key in typeof nodeType[number]]: string };
export type NodeTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::data::poker_hand::PokerHand` enum
export const pokerHand = [
	'None',
	'RoyalFlush',
	'StraightFlush',
	'FiveOfAKind',
	'FourOfAKind',
	'FullHouse',
	'Straight',
	'Flush',
	'ThreeOfAKind',
	'TwoPair',
	'OnePair',
	'HighCard',
] as const;
export type PokerHand = { [key in typeof pokerHand[number]]: string };
export type PokerHandEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::status::game::game::GameState` enum
export const gameState = [
	'None',
	'Round',
	'Rage',
	'Reward',
	'Challenge',
	'Map',
	'Store',
	'Lootbox',
	'GameOver',
] as const;
export type GameState = { [key in typeof gameState[number]]: string };
export type GameStateEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::status::shop::shop::CardItemType` enum
export const cardItemType = [
	'None',
	'Common',
	'Modifier',
] as const;
export type CardItemType = { [key in typeof cardItemType[number]]: string };
export type CardItemTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::events::card_play_event::EventType` enum
export const eventType = [
	'Cash',
	'Club',
	'Diamond',
	'Point',
	'Multi',
	'Neon',
	'Spade',
	'Heart',
	'Joker',
	'Wild',
	'AcumCash',
	'AcumPoint',
	'AcumMulti',
	'None',
] as const;
export type EventType = { [key in typeof eventType[number]]: string };
export type EventTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::data::card::Suit` enum
export const suit = [
	'None',
	'Clubs',
	'Diamonds',
	'Hearts',
	'Spades',
	'Joker',
	'Wild',
] as const;
export type Suit = { [key in typeof suit[number]]: string };
export type SuitEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::card_type::CardType` enum
export const cardType = [
	'PreCalculateHand',
	'PostCalculateHand',
	'Hit',
	'Miss',
	'Hand',
	'CurrentHand',
	'PowerUp',
	'Win',
	'Lose',
	'Discard',
	'DiscardCondition',
	'Round',
	'Game',
	'Shop',
	'LevelUpPlay',
	'Play',
	'PlayRules',
	'Debuff',
	'Silence',
	'Info',
	'Burn',
	'None',
] as const;
export type CardType = { [key in typeof cardType[number]]: string };
export type CardTypeEnum = CairoCustomEnum;

// Type definition for `jokers_of_neon_lib::models::data::card::Value` enum
export const value = [
	'None',
	'Two',
	'Three',
	'Four',
	'Five',
	'Six',
	'Seven',
	'Eight',
	'Nine',
	'Ten',
	'Jack',
	'Queen',
	'King',
	'Ace',
	'Joker',
	'NeonJoker',
	'Wild',
] as const;
export type Value = { [key in typeof value[number]]: string };
export type ValueEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	jokers_of_neon_core: {
		AchievementsTracker: AchievementsTracker,
		DailyMissionTracker: DailyMissionTracker,
		DailyMissionsForDay: DailyMissionsForDay,
		GameSpecials: GameSpecials,
		LivesConfig: LivesConfig,
		PlayerLives: PlayerLives,
		SeasonPass: SeasonPass,
		FreePackConfig: FreePackConfig,
		Item: Item,
		Pack: Pack,
		PlayerFreePack: PlayerFreePack,
		SeasonContent: SeasonContent,
		Tickets: Tickets,
		ModManagerRegistrator: ModManagerRegistrator,
		PlayValues: PlayValues,
		DeckCard: DeckCard,
		GameDeck: GameDeck,
		LevelMap: LevelMap,
		Node: Node,
		NodeChilds: NodeChilds,
		StageTracker: StageTracker,
		TraveledNodes: TraveledNodes,
		GamePowerUp: GamePowerUp,
		CurrentSpecialCards: CurrentSpecialCards,
		Game: Game,
		PlayerLevelPokerHand: PlayerLevelPokerHand,
		RageRound: RageRound,
		CurrentHand: CurrentHand,
		Round: Round,
		BlisterPackItem: BlisterPackItem,
		BlisterPackResult: BlisterPackResult,
		BurnItem: BurnItem,
		CardItem: CardItem,
		PokerHandItem: PokerHandItem,
		PowerUpItem: PowerUpItem,
		SlotSpecialCardsItem: SlotSpecialCardsItem,
		SpecialCardItem: SpecialCardItem,
		GameTracker: GameTracker,
		PokerHandTracker: PokerHandTracker,
		PurchaseTracker: PurchaseTracker,
		Random: Random,
		GameMod: GameMod,
		GameModMap: GameModMap,
		ModConfig: ModConfig,
		ModTracker: ModTracker,
		RageData: RageData,
		SpecialData: SpecialData,
		TrophyCreation: TrophyCreation,
		TrophyProgression: TrophyProgression,
		Task: Task,
		AchievementCompletedEvent: AchievementCompletedEvent,
		CardScoreEvent: CardScoreEvent,
		CreateGameEvent: CreateGameEvent,
		CurrentHandEvent: CurrentHandEvent,
		DailyMissionCompletedEvent: DailyMissionCompletedEvent,
		DetailEarnedEvent: DetailEarnedEvent,
		GameEvent: GameEvent,
		GamePowerUpEvent: GamePowerUpEvent,
		ModifierCardSuitEvent: ModifierCardSuitEvent,
		ModifierNeonCardEvent: ModifierNeonCardEvent,
		ModifierWildCardEvent: ModifierWildCardEvent,
		PlayGameOverEvent: PlayGameOverEvent,
		PlayWinGameEvent: PlayWinGameEvent,
		PowerUpEvent: PowerUpEvent,
		RoundScoreEvent: RoundScoreEvent,
		CardActivateEvent: CardActivateEvent,
		CardPlayEvent: CardPlayEvent,
		BuyBlisterPackEvent: BuyBlisterPackEvent,
		BuyBlisterPackResultEvent: BuyBlisterPackResultEvent,
		BuyBurnEvent: BuyBurnEvent,
		BuyLevelUpPokerHandEvent: BuyLevelUpPokerHandEvent,
		BuyModifierCardEvent: BuyModifierCardEvent,
		BuyPowerUpEvent: BuyPowerUpEvent,
		BuyRerollEvent: BuyRerollEvent,
		BuySlotSpecialCardEvent: BuySlotSpecialCardEvent,
		BuySpecialCardEvent: BuySpecialCardEvent,
		BuySpecialCardsSoldEvent: BuySpecialCardsSoldEvent,
		BuyTraditionalCardEvent: BuyTraditionalCardEvent,
		WrappedItem: WrappedItem,
		GameConfig: GameConfig,
		Card: Card,
		ParsedLevelMap: ParsedLevelMap,
		GameContext: GameContext,
		RoleAdminChanged: RoleAdminChanged,
		RoleGranted: RoleGranted,
		RoleRevoked: RoleRevoked,
	},
}
export const schema: SchemaType = {
	jokers_of_neon_core: {
		AchievementsTracker: {
			player: "",
			id: 0,
			completed: false,
		},
		DailyMissionTracker: {
			player: "",
			day: 0,
			mission_id: 0,
			completed: false,
		},
		DailyMissionsForDay: {
			day: 0,
			easy_mission_id: 0,
			medium_mission_id: 0,
			hard_mission_id: 0,
		},
		GameSpecials: {
			game_id: 0,
			specials: [[0]],
		},
		LivesConfig: {
			key: 0,
			max_lives: 0,
			max_lives_battle_pass: 0,
			lives_cooldown: 0,
			lives_cooldown_season_pass: 0,
		},
		PlayerLives: {
			player: "",
			season_id: 0,
			available_lives: 0,
			max_lives: 0,
			next_live_timestamp: 0,
		},
		SeasonPass: {
			player: "",
			season_id: 0,
			is_active: false,
		},
		FreePackConfig: {
			key: 0,
			cooldown: 0,
			pack_id: 0,
		},
		Item: {
			id: 0,
		item_type: new CairoCustomEnum({ 
					Traditional: "",
				Special: undefined,
				Neon: undefined,
				Skin: undefined,
				None: undefined, }),
			content_id: 0,
			rarity: 0,
			skin_id: 0,
			skin_rarity: 0,
		},
		Pack: {
			id: 0,
			season_id: 0,
		name: "",
			probabilities: [[0]],
		},
		PlayerFreePack: {
			player: "",
			next_pack_timestamp: 0,
		},
		SeasonContent: {
			season_id: 0,
			initialized: false,
			items: [[0]],
		},
		Tickets: {
			player: "",
			season_id: 0,
			quantity: 0,
		},
		ModManagerRegistrator: {
			mod_manager_key: 0,
			owner: "",
			mod_manager_address: "",
			rage_manager_address: "",
			special_manager_address: "",
		},
		PlayValues: {
			game_id: 0,
			points: 0,
			multi: 0,
			cash: 0,
		},
		DeckCard: {
			game_id: 0,
			index: 0,
			card_id: 0,
		},
		GameDeck: {
			game_id: 0,
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
		StageTracker: {
			game_id: 0,
			store_stages: 0,
			round_stages: 0,
			rage_stages: 0,
			total_nodes: 0,
		},
		TraveledNodes: {
			game_id: 0,
			level: 0,
			nodes: [0],
		},
		GamePowerUp: {
			game_id: 0,
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
		Game: {
			id: 0,
			mod_id: 0,
		state: new CairoCustomEnum({ 
					None: "",
				Round: undefined,
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
			round: 0,
			hand_len: 0,
			plays: 0,
			discards: 0,
			current_specials_len: 0,
			special_slots: 0,
			cash: 0,
			available_rerolls: 0,
			seed: 0,
			is_tournament: false,
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
		RageRound: {
			game_id: 0,
			is_active: false,
			current_probability: 0,
			active_rage_ids: [0],
			last_active_level: 0,
		},
		CurrentHand: {
			game_id: 0,
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
		BlisterPackItem: {
			game_id: 0,
			idx: 0,
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
		BurnItem: {
			game_id: 0,
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
		PowerUpItem: {
			game_id: 0,
			idx: 0,
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
		GameTracker: {
			game_id: 0,
			highest_hand: 0,
			most_played_hand: [new CairoCustomEnum({ 
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
				HighCard: undefined, }), 0],
			highest_cash: 0,
			cards_played_count: 0,
			cards_discarded_count: 0,
			rage_wins: 0,
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
		PurchaseTracker: {
			game_id: 0,
			traditional_cards_count: 0,
			modifier_cards_count: 0,
			special_cards_count: 0,
			loot_boxes_count: 0,
			power_up_count: 0,
			level_poker_hands_count: 0,
			burn_count: 0,
			reroll_count: 0,
			special_cards_sold: 0,
		},
		Random: {
			key: 0,
			seed: 0,
		},
		GameMod: {
			id: 0,
			owner: "",
			total_games: 0,
			created_date: 0,
			last_update_date: 0,
		},
		GameModMap: {
			idx: 0,
			mod_id: 0,
		},
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
		ModTracker: {
			mod_tracker_key: 0,
			total_mods: 0,
		},
		RageData: {
			mod_id: 0,
			rage_id: 0,
			contract_address: "",
		},
		SpecialData: {
			mod_id: 0,
			special_id: 0,
			contract_address: "",
		},
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
		TrophyProgression: {
			player_id: 0,
			task_id: 0,
			count: 0,
			time: 0,
		},
		Task: {
			id: 0,
			total: 0,
		description: "",
		},
		AchievementCompletedEvent: {
			player: "",
			id: 0,
		},
		CardScoreEvent: {
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		CreateGameEvent: {
			player: "",
			game_id: 0,
		},
		CurrentHandEvent: {
			game_id: 0,
			cards: [0],
		},
		DailyMissionCompletedEvent: {
			player: "",
			id: 0,
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
			rerolls: 0,
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
					None: "",
				Round: undefined,
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
		ModifierNeonCardEvent: {
			player: "",
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
		PlayGameOverEvent: {
			player: "",
			game_id: 0,
		},
		PlayWinGameEvent: {
			player: "",
			game_id: 0,
			level: 0,
			player_score: 0,
			round: 0,
			level_passed: 0,
		},
		PowerUpEvent: {
			player: "",
			index: 0,
			multi: 0,
			points: 0,
		},
		RoundScoreEvent: {
			player: "",
			game_id: 0,
			player_score: 0,
		},
		CardActivateEvent: {
			player: "",
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
				AcumCash: undefined,
				AcumPoint: undefined,
				AcumMulti: undefined,
				None: undefined, }),
			special: [[0, 0]],
			hand: [[0, 0]],
		},
		BuyBlisterPackEvent: {
			game_id: 0,
			loot_boxes_count: 0,
			level: 0,
			current_node_id: 0,
			blister_pack_id: 0,
		},
		BuyBlisterPackResultEvent: {
			game_id: 0,
			loot_boxes_count: 0,
			level: 0,
			current_node_id: 0,
			cards: [0],
		},
		BuyBurnEvent: {
			game_id: 0,
			burn_count: 0,
			level: 0,
			current_node_id: 0,
			card_id: 0,
		},
		BuyLevelUpPokerHandEvent: {
			game_id: 0,
			level_poker_hands_count: 0,
			level: 0,
			current_node_id: 0,
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
			level_hand: 0,
		},
		BuyModifierCardEvent: {
			game_id: 0,
			modifier_cards_count: 0,
			level: 0,
			current_node_id: 0,
			card_id: 0,
		},
		BuyPowerUpEvent: {
			game_id: 0,
			power_up_count: 0,
			level: 0,
			current_node_id: 0,
			power_up_id: 0,
		},
		BuyRerollEvent: {
			game_id: 0,
			reroll_count: 0,
			level: 0,
			current_node_id: 0,
			reroll_executed: false,
		},
		BuySlotSpecialCardEvent: {
			game_id: 0,
			count_slots: 0,
			level: 0,
			current_node_id: 0,
			slot_executed: false,
		},
		BuySpecialCardEvent: {
			game_id: 0,
			special_cards_count: 0,
			level: 0,
			current_node_id: 0,
			card_id: 0,
			is_temporary: false,
		},
		BuySpecialCardsSoldEvent: {
			game_id: 0,
			special_cards_sold: 0,
			level: 0,
			current_node_id: 0,
			card_id: 0,
		},
		BuyTraditionalCardEvent: {
			game_id: 0,
			traditional_cards_count: 0,
			level: 0,
			current_node_id: 0,
			card_id: 0,
		},
		WrappedItem: {
		item: { id: 0, item_type: new CairoCustomEnum({ 
					Traditional: "",
				Special: undefined,
				Neon: undefined,
				Skin: undefined,
				None: undefined, }), content_id: 0, rarity: 0, skin_id: 0, skin_rarity: 0, },
			quality: 0,
			marketable: false,
		},
		GameConfig: {
			plays: 0,
			discards: 0,
			max_special_slots: 0,
			power_up_slots: 0,
			max_power_up_slots: 0,
			hand_len: 0,
			start_cash: 0,
			start_special_slots: 0,
			start_rerolls: 0,
		},
		Card: {
			id: 0,
		suit: new CairoCustomEnum({ 
					None: "",
				Clubs: undefined,
				Diamonds: undefined,
				Hearts: undefined,
				Spades: undefined,
				Joker: undefined,
				Wild: undefined, }),
		value: new CairoCustomEnum({ 
					None: "",
				Two: undefined,
				Three: undefined,
				Four: undefined,
				Five: undefined,
				Six: undefined,
				Seven: undefined,
				Eight: undefined,
				Nine: undefined,
				Ten: undefined,
				Jack: undefined,
				Queen: undefined,
				King: undefined,
				Ace: undefined,
				Joker: undefined,
				NeonJoker: undefined,
				Wild: undefined, }),
			points: 0,
			multi: 0,
		},
		ParsedLevelMap: {
			level_nodes: [[[{ game_id: 0, id: 0, node_type: new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Store: undefined, }), data: 0, }, { game_id: 0, node_id: 0, childs: [0], }]]],
			traveled_nodes: [0],
		},
		GameContext: {
		game: { id: 0, mod_id: 0, state: new CairoCustomEnum({ 
					None: "",
				Round: undefined,
				Rage: undefined,
				Reward: undefined,
				Challenge: undefined,
				Map: undefined,
				Store: undefined,
				Lootbox: undefined,
				GameOver: undefined, }), owner: "", player_name: 0, player_score: 0, level: 0, current_node_id: 0, round: 0, hand_len: 0, plays: 0, discards: 0, current_specials_len: 0, special_slots: 0, cash: 0, available_rerolls: 0, seed: 0, is_tournament: false, },
		round: { game_id: 0, current_score: 0, target_score: 0, remaining_plays: 0, remaining_discards: 0, rages: [0], },
			hand: [new CairoCustomEnum({ 
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
				HighCard: undefined, }), 0],
		card_type: new CairoCustomEnum({ 
					PreCalculateHand: "",
				PostCalculateHand: undefined,
				Hit: undefined,
				Miss: undefined,
				Hand: undefined,
				CurrentHand: undefined,
				PowerUp: undefined,
				Win: undefined,
				Lose: undefined,
				Discard: undefined,
				DiscardCondition: undefined,
				Round: undefined,
				Game: undefined,
				Shop: undefined,
				LevelUpPlay: undefined,
				Play: undefined,
				PlayRules: undefined,
				Debuff: undefined,
				Silence: undefined,
				Info: undefined,
				Burn: undefined,
				None: undefined, }),
			cards_played: [[false, 0, { id: 0, suit: new CairoCustomEnum({ 
					None: "",
				Clubs: undefined,
				Diamonds: undefined,
				Hearts: undefined,
				Spades: undefined,
				Joker: undefined,
				Wild: undefined, }), value: new CairoCustomEnum({ 
					None: "",
				Two: undefined,
				Three: undefined,
				Four: undefined,
				Five: undefined,
				Six: undefined,
				Seven: undefined,
				Eight: undefined,
				Nine: undefined,
				Ten: undefined,
				Jack: undefined,
				Queen: undefined,
				King: undefined,
				Ace: undefined,
				Joker: undefined,
				NeonJoker: undefined,
				Wild: undefined, }), points: 0, multi: 0, }]],
			cards_in_hand: [[0, { id: 0, suit: new CairoCustomEnum({ 
					None: "",
				Clubs: undefined,
				Diamonds: undefined,
				Hearts: undefined,
				Spades: undefined,
				Joker: undefined,
				Wild: undefined, }), value: new CairoCustomEnum({ 
					None: "",
				Two: undefined,
				Three: undefined,
				Four: undefined,
				Five: undefined,
				Six: undefined,
				Seven: undefined,
				Eight: undefined,
				Nine: undefined,
				Ten: undefined,
				Jack: undefined,
				Queen: undefined,
				King: undefined,
				Ace: undefined,
				Joker: undefined,
				NeonJoker: undefined,
				Wild: undefined, }), points: 0, multi: 0, }]],
			cards_in_deck: [0],
			special_cards: [{ game_id: 0, idx: 0, effect_card_id: 0, is_temporary: false, remaining: 0, selling_price: 0, }],
			power_ups: [0],
		purchase_tracker: { game_id: 0, traditional_cards_count: 0, modifier_cards_count: 0, special_cards_count: 0, loot_boxes_count: 0, power_up_count: 0, level_poker_hands_count: 0, burn_count: 0, reroll_count: 0, special_cards_sold: 0, },
		game_tracker: { game_id: 0, highest_hand: 0, most_played_hand: [new CairoCustomEnum({ 
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
				HighCard: undefined, }), 0], highest_cash: 0, cards_played_count: 0, cards_discarded_count: 0, rage_wins: 0, },
		poker_hand_tracker: { game_id: 0, royal_flush: 0, straight_flush: 0, five_of_a_kind: 0, four_of_a_kind: 0, full_house: 0, straight: 0, flush: 0, three_of_a_kind: 0, two_pair: 0, one_pair: 0, high_card: 0, },
		},
		RoleAdminChanged: {
			role: 0,
			previous_admin_role: 0,
			new_admin_role: 0,
		},
		RoleGranted: {
			role: 0,
			account: "",
			sender: "",
		},
		RoleRevoked: {
			role: 0,
			account: "",
			sender: "",
		},
	},
};
export enum ModelsMapping {
	AchievementsTracker = 'jokers_of_neon_core-AchievementsTracker',
	DailyMissionTracker = 'jokers_of_neon_core-DailyMissionTracker',
	DailyMissionsForDay = 'jokers_of_neon_core-DailyMissionsForDay',
	GameSpecials = 'jokers_of_neon_core-GameSpecials',
	LivesConfig = 'jokers_of_neon_core-LivesConfig',
	PlayerLives = 'jokers_of_neon_core-PlayerLives',
	SeasonPass = 'jokers_of_neon_core-SeasonPass',
	FreePackConfig = 'jokers_of_neon_core-FreePackConfig',
	Item = 'jokers_of_neon_core-Item',
	ItemType = 'jokers_of_neon_core-ItemType',
	Pack = 'jokers_of_neon_core-Pack',
	PlayerFreePack = 'jokers_of_neon_core-PlayerFreePack',
	SeasonContent = 'jokers_of_neon_core-SeasonContent',
	Tickets = 'jokers_of_neon_core-Tickets',
	ModManagerRegistrator = 'jokers_of_neon_core-ModManagerRegistrator',
	PlayValues = 'jokers_of_neon_core-PlayValues',
	DeckCard = 'jokers_of_neon_lib-DeckCard',
	GameDeck = 'jokers_of_neon_lib-GameDeck',
	LevelMap = 'jokers_of_neon_lib-LevelMap',
	Node = 'jokers_of_neon_lib-Node',
	NodeChilds = 'jokers_of_neon_lib-NodeChilds',
	NodeType = 'jokers_of_neon_lib-NodeType',
	StageTracker = 'jokers_of_neon_lib-StageTracker',
	TraveledNodes = 'jokers_of_neon_lib-TraveledNodes',
	PokerHand = 'jokers_of_neon_lib-PokerHand',
	GamePowerUp = 'jokers_of_neon_lib-GamePowerUp',
	CurrentSpecialCards = 'jokers_of_neon_lib-CurrentSpecialCards',
	Game = 'jokers_of_neon_lib-Game',
	GameState = 'jokers_of_neon_lib-GameState',
	PlayerLevelPokerHand = 'jokers_of_neon_lib-PlayerLevelPokerHand',
	RageRound = 'jokers_of_neon_lib-RageRound',
	CurrentHand = 'jokers_of_neon_lib-CurrentHand',
	Round = 'jokers_of_neon_lib-Round',
	BlisterPackItem = 'jokers_of_neon_lib-BlisterPackItem',
	BlisterPackResult = 'jokers_of_neon_lib-BlisterPackResult',
	BurnItem = 'jokers_of_neon_lib-BurnItem',
	CardItem = 'jokers_of_neon_lib-CardItem',
	CardItemType = 'jokers_of_neon_lib-CardItemType',
	PokerHandItem = 'jokers_of_neon_lib-PokerHandItem',
	PowerUpItem = 'jokers_of_neon_lib-PowerUpItem',
	SlotSpecialCardsItem = 'jokers_of_neon_lib-SlotSpecialCardsItem',
	SpecialCardItem = 'jokers_of_neon_lib-SpecialCardItem',
	GameTracker = 'jokers_of_neon_lib-GameTracker',
	PokerHandTracker = 'jokers_of_neon_lib-PokerHandTracker',
	PurchaseTracker = 'jokers_of_neon_lib-PurchaseTracker',
	Random = 'jokers_of_neon_lib-Random',
	GameMod = 'jokers_of_neon_mods-GameMod',
	GameModMap = 'jokers_of_neon_mods-GameModMap',
	ModConfig = 'jokers_of_neon_mods-ModConfig',
	ModTracker = 'jokers_of_neon_mods-ModTracker',
	RageData = 'jokers_of_neon_mods-RageData',
	SpecialData = 'jokers_of_neon_mods-SpecialData',
	TrophyCreation = 'achievement-TrophyCreation',
	TrophyProgression = 'achievement-TrophyProgression',
	Task = 'achievement-Task',
	AchievementCompletedEvent = 'jokers_of_neon_core-AchievementCompletedEvent',
	CardScoreEvent = 'jokers_of_neon_core-CardScoreEvent',
	CreateGameEvent = 'jokers_of_neon_core-CreateGameEvent',
	CurrentHandEvent = 'jokers_of_neon_core-CurrentHandEvent',
	DailyMissionCompletedEvent = 'jokers_of_neon_core-DailyMissionCompletedEvent',
	DetailEarnedEvent = 'jokers_of_neon_core-DetailEarnedEvent',
	GameEvent = 'jokers_of_neon_core-GameEvent',
	GamePowerUpEvent = 'jokers_of_neon_core-GamePowerUpEvent',
	ModifierCardSuitEvent = 'jokers_of_neon_core-ModifierCardSuitEvent',
	ModifierNeonCardEvent = 'jokers_of_neon_core-ModifierNeonCardEvent',
	ModifierWildCardEvent = 'jokers_of_neon_core-ModifierWildCardEvent',
	PlayGameOverEvent = 'jokers_of_neon_core-PlayGameOverEvent',
	PlayWinGameEvent = 'jokers_of_neon_core-PlayWinGameEvent',
	PowerUpEvent = 'jokers_of_neon_core-PowerUpEvent',
	RoundScoreEvent = 'jokers_of_neon_core-RoundScoreEvent',
	CardActivateEvent = 'jokers_of_neon_lib-CardActivateEvent',
	CardPlayEvent = 'jokers_of_neon_lib-CardPlayEvent',
	EventType = 'jokers_of_neon_lib-EventType',
	Suit = 'jokers_of_neon_lib-Suit',
	BuyBlisterPackEvent = 'jokers_of_neon_lib-BuyBlisterPackEvent',
	BuyBlisterPackResultEvent = 'jokers_of_neon_lib-BuyBlisterPackResultEvent',
	BuyBurnEvent = 'jokers_of_neon_lib-BuyBurnEvent',
	BuyLevelUpPokerHandEvent = 'jokers_of_neon_lib-BuyLevelUpPokerHandEvent',
	BuyModifierCardEvent = 'jokers_of_neon_lib-BuyModifierCardEvent',
	BuyPowerUpEvent = 'jokers_of_neon_lib-BuyPowerUpEvent',
	BuyRerollEvent = 'jokers_of_neon_lib-BuyRerollEvent',
	BuySlotSpecialCardEvent = 'jokers_of_neon_lib-BuySlotSpecialCardEvent',
	BuySpecialCardEvent = 'jokers_of_neon_lib-BuySpecialCardEvent',
	BuySpecialCardsSoldEvent = 'jokers_of_neon_lib-BuySpecialCardsSoldEvent',
	BuyTraditionalCardEvent = 'jokers_of_neon_lib-BuyTraditionalCardEvent',
	WrappedItem = 'jokers_of_neon_core-WrappedItem',
	GameConfig = 'jokers_of_neon_lib-GameConfig',
	CardType = 'jokers_of_neon_lib-CardType',
	Card = 'jokers_of_neon_lib-Card',
	Value = 'jokers_of_neon_lib-Value',
	ParsedLevelMap = 'jokers_of_neon_lib-ParsedLevelMap',
	GameContext = 'jokers_of_neon_lib-GameContext',
	RoleAdminChanged = 'openzeppelin_access-RoleAdminChanged',
	RoleGranted = 'openzeppelin_access-RoleGranted',
	RoleRevoked = 'openzeppelin_access-RoleRevoked',
}
