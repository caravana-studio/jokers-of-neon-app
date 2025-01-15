import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { number } from "starknet";

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `jokers_of_neon::models::data::game_deck::DeckCard` struct
export interface DeckCard {
  game_id: number;
  index: number;
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::DeckCardValue` struct
export interface DeckCardValue {
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::GameDeck` struct
export interface GameDeck {
  game_id: number;
  len: number;
  round_len: number;
}

// Type definition for `jokers_of_neon::models::data::game_deck::GameDeckValue` struct
export interface GameDeckValue {
  len: number;
  round_len: number;
}

// Type definition for `jokers_of_neon::models::data::power_up::GamePowerUp` struct
export interface GamePowerUp {
  game_id: number;
  power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::power_up::GamePowerUpValue` struct
export interface GamePowerUpValue {
  power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::game::game::CurrentSpecialCards` struct
export interface CurrentSpecialCards {
  game_id: number;
  idx: number;
  effect_card_id: number;
  is_temporary: boolean;
  remaining: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::CurrentSpecialCardsValue` struct
export interface CurrentSpecialCardsValue {
  effect_card_id: number;
  is_temporary: boolean;
  remaining: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::Game` struct
export interface Game {
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
  state: GameState;
  cash: number;
}

// Type definition for `jokers_of_neon::models::status::game::game::GameValue` struct
export interface GameValue {
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

// Type definition for `jokers_of_neon::models::status::game::player::PlayerLevelPokerHand` struct
export interface PlayerLevelPokerHand {
  game_id: number;
  poker_hand: PokerHand;
  level: number;
}

// Type definition for `jokers_of_neon::models::status::game::player::PlayerLevelPokerHandValue` struct
export interface PlayerLevelPokerHandValue {
  level: number;
}

// Type definition for `jokers_of_neon::models::status::game::rage::RageRound` struct
export interface RageRound {
  game_id: number;
  is_active: boolean;
  current_probability: number;
  active_rage_ids: Array<number>;
  last_active_level: number;
}

// Type definition for `jokers_of_neon::models::status::game::rage::RageRoundValue` struct
export interface RageRoundValue {
  is_active: boolean;
  current_probability: number;
  active_rage_ids: Array<number>;
  last_active_level: number;
}

// Type definition for `jokers_of_neon::models::status::round::current_hand_card::CurrentHand` struct
export interface CurrentHand {
  game_id: number;
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::round::current_hand_card::CurrentHandValue` struct
export interface CurrentHandValue {
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::round::round::Round` struct
export interface Round {
  game_id: number;
  player_score: number;
  level_score: number;
  hands: number;
  discard: number;
}

// Type definition for `jokers_of_neon::models::status::round::round::RoundValue` struct
export interface RoundValue {
  player_score: number;
  level_score: number;
  hands: number;
  discard: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackItem` struct
export interface BlisterPackItem {
  game_id: number;
  idx: number;
  blister_pack_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackItemValue` struct
export interface BlisterPackItemValue {
  blister_pack_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackResult` struct
export interface BlisterPackResult {
  game_id: number;
  cards_picked: boolean;
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BlisterPackResultValue` struct
export interface BlisterPackResultValue {
  cards_picked: boolean;
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BurnItem` struct
export interface BurnItem {
  game_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::BurnItemValue` struct
export interface BurnItemValue {
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItem` struct
export interface CardItem {
  game_id: number;
  idx: number;
  item_type: CardItemType;
  card_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItemValue` struct
export interface CardItemValue {
  card_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PokerHandItem` struct
export interface PokerHandItem {
  game_id: number;
  idx: number;
  poker_hand: PokerHand;
  level: number;
  multi: number;
  points: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PokerHandItemValue` struct
export interface PokerHandItemValue {
  poker_hand: PokerHand;
  level: number;
  multi: number;
  points: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PowerUpItem` struct
export interface PowerUpItem {
  game_id: number;
  idx: number;
  power_up_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::PowerUpItemValue` struct
export interface PowerUpItemValue {
  power_up_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::Shop` struct
export interface Shop {
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
  game_id: number;
  count_reroll: number;
  count_burn: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::ShopTrackerValue` struct
export interface ShopTrackerValue {
  count_reroll: number;
  count_burn: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::ShopValue` struct
export interface ShopValue {
  reroll_cost: number;
  reroll_executed: boolean;
  len_item_common_cards: number;
  len_item_modifier_cards: number;
  len_item_special_cards: number;
  len_item_poker_hands: number;
  len_item_blister_pack: number;
  len_item_power_ups: number;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SlotSpecialCardsItem` struct
export interface SlotSpecialCardsItem {
  game_id: number;
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SlotSpecialCardsItemValue` struct
export interface SlotSpecialCardsItemValue {
  cost: number;
  discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::status::shop::shop::SpecialCardItem` struct
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

// Type definition for `jokers_of_neon::models::status::shop::shop::SpecialCardItemValue` struct
export interface SpecialCardItemValue {
  card_id: number;
  cost: number;
  discount_cost: number;
  temporary_cost: number;
  temporary_discount_cost: number;
  purchased: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::BuyBlisterPackEvent` struct
export interface BuyBlisterPackEvent {
  game_id: number;
  level: number;
  idx: number;
  blister_pack_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyBlisterPackEventValue` struct
export interface BuyBlisterPackEventValue {
  blister_pack_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyCardEvent` struct
export interface BuyCardEvent {
  game_id: number;
  level: number;
  idx: number;
  item_type: CardItemType;
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyCardEventValue` struct
export interface BuyCardEventValue {
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyPokerHandEvent` struct
export interface BuyPokerHandEvent {
  game_id: number;
  level: number;
  idx: number;
  poker_hand: PokerHand;
  level_hand: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyPokerHandEventValue` struct
export interface BuyPokerHandEventValue {
  poker_hand: PokerHand;
  level_hand: number;
}

// Type definition for `jokers_of_neon::models::data::events::BuyRerollEvent` struct
export interface BuyRerollEvent {
  game_id: number;
  level: number;
  reroll_cost: number;
  reroll_executed: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::BuyRerollEventValue` struct
export interface BuyRerollEventValue {
  reroll_cost: number;
  reroll_executed: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::BuySpecialCardEvent` struct
export interface BuySpecialCardEvent {
  game_id: number;
  level: number;
  idx: number;
  card_id: number;
  is_temporary: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::BuySpecialCardEventValue` struct
export interface BuySpecialCardEventValue {
  card_id: number;
  is_temporary: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::CardScoreEvent` struct
export interface CardScoreEvent {
  player: string;
  index: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::CardScoreEventValue` struct
export interface CardScoreEventValue {
  index: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::CreateGameEvent` struct
export interface CreateGameEvent {
  player: string;
  game_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::CreateGameEventValue` struct
export interface CreateGameEventValue {
  game_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::CurrentHandEvent` struct
export interface CurrentHandEvent {
  game_id: number;
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::events::CurrentHandEventValue` struct
export interface CurrentHandEventValue {
  cards: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::events::DestroyedSpecialCardEvent` struct
export interface DestroyedSpecialCardEvent {
  player: string;
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::DestroyedSpecialCardEventValue` struct
export interface DestroyedSpecialCardEventValue {
  card_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::DetailEarnedEvent` struct
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

// Type definition for `jokers_of_neon::models::data::events::DetailEarnedEventValue` struct
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

// Type definition for `jokers_of_neon::models::data::events::GameEvent` struct
export interface GameEvent {
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
  state: GameState;
  cash: number;
}

// Type definition for `jokers_of_neon::models::data::events::GameEventValue` struct
export interface GameEventValue {
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
  state: GameState;
  cash: number;
}

// Type definition for `jokers_of_neon::models::data::events::GamePowerUpEvent` struct
export interface GamePowerUpEvent {
  player: string;
  game_id: number;
  power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::events::GamePowerUpEventValue` struct
export interface GamePowerUpEventValue {
  game_id: number;
  power_ups: Array<number>;
}

// Type definition for `jokers_of_neon::models::data::events::LevelUpHandEvent` struct
export interface LevelUpHandEvent {
  player: string;
  hand: PokerHand;
  old_level: number;
  old_points: number;
  old_multi: number;
  level: number;
  points: number;
  multi: number;
}

// Type definition for `jokers_of_neon::models::data::events::LevelUpHandEventValue` struct
export interface LevelUpHandEventValue {
  hand: PokerHand;
  old_level: number;
  old_points: number;
  old_multi: number;
  level: number;
  points: number;
  multi: number;
}

// Type definition for `jokers_of_neon::models::data::events::LifeSaverSpecialCardEvent` struct
export interface LifeSaverSpecialCardEvent {
  player: string;
  game_id: number;
  special_card_idx: number;
  old_level_score: number;
  new_level_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::LifeSaverSpecialCardEventValue` struct
export interface LifeSaverSpecialCardEventValue {
  game_id: number;
  special_card_idx: number;
  old_level_score: number;
  new_level_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierCardSuitEvent` struct
export interface ModifierCardSuitEvent {
  player: string;
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
  suit: Suit;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierCardSuitEventValue` struct
export interface ModifierCardSuitEventValue {
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
  suit: Suit;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierNeonCardEvent` struct
export interface ModifierNeonCardEvent {
  player: string;
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierNeonCardEventValue` struct
export interface ModifierNeonCardEventValue {
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierWildCardEvent` struct
export interface ModifierWildCardEvent {
  player: string;
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::ModifierWildCardEventValue` struct
export interface ModifierWildCardEventValue {
  game_id: number;
  modifier_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::NeonPokerHandEvent` struct
export interface NeonPokerHandEvent {
  player: string;
  game_id: number;
  neon_cards_idx: Array<number>;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::NeonPokerHandEventValue` struct
export interface NeonPokerHandEventValue {
  game_id: number;
  neon_cards_idx: Array<number>;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::PlayGameOverEvent` struct
export interface PlayGameOverEvent {
  player: string;
  game_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::PlayGameOverEventValue` struct
export interface PlayGameOverEventValue {
  game_id: number;
}

// Type definition for `jokers_of_neon::models::data::events::PlayPokerHandEvent` struct
export interface PlayPokerHandEvent {
  game_id: number;
  level: number;
  count_hand: number;
  poker_hand: PokerHand;
}

// Type definition for `jokers_of_neon::models::data::events::PlayPokerHandEventValue` struct
export interface PlayPokerHandEventValue {
  poker_hand: PokerHand;
}

// Type definition for `jokers_of_neon::models::data::events::PlayWinGameEvent` struct
export interface PlayWinGameEvent {
  player: string;
  game_id: number;
  level: number;
  player_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::PlayWinGameEventValue` struct
export interface PlayWinGameEventValue {
  game_id: number;
  level: number;
  player_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::PokerHandEvent` struct
export interface PokerHandEvent {
  player: string;
  poker_hand: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::PokerHandEventValue` struct
export interface PokerHandEventValue {
  poker_hand: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::PowerUpEvent` struct
export interface PowerUpEvent {
  player: string;
  index: number;
  multi: number;
  points: number;
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::PowerUpEventValue` struct
export interface PowerUpEventValue {
  index: number;
  multi: number;
  points: number;
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::RoundScoreEvent` struct
export interface RoundScoreEvent {
  player: string;
  game_id: number;
  player_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::RoundScoreEventValue` struct
export interface RoundScoreEventValue {
  game_id: number;
  player_score: number;
}

// Type definition for `jokers_of_neon::models::data::events::SecondChanceEvent` struct
export interface SecondChanceEvent {
  player: string;
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SecondChanceEventValue` struct
export interface SecondChanceEventValue {
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialCashEvent` struct
export interface SpecialCashEvent {
  player: string;
  cash: number;
  card_idx: number;
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialCashEventValue` struct
export interface SpecialCashEventValue {
  cash: number;
  card_idx: number;
  special_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialGlobalEvent` struct
export interface SpecialGlobalEvent {
  player: string;
  game_id: number;
  current_special_card_idx: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialGlobalEventValue` struct
export interface SpecialGlobalEventValue {
  game_id: number;
  current_special_card_idx: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierMultiEvent` struct
export interface SpecialModifierMultiEvent {
  player: string;
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  multi: number;
  is_negative: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierMultiEventValue` struct
export interface SpecialModifierMultiEventValue {
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  multi: number;
  is_negative: boolean;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierPointsEvent` struct
export interface SpecialModifierPointsEvent {
  player: string;
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierPointsEventValue` struct
export interface SpecialModifierPointsEventValue {
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierSuitEvent` struct
export interface SpecialModifierSuitEvent {
  player: string;
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  suit: Suit;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialModifierSuitEventValue` struct
export interface SpecialModifierSuitEventValue {
  game_id: number;
  current_special_card_idx: number;
  current_hand_card_idx: number;
  suit: Suit;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialNeonCardEvent` struct
export interface SpecialNeonCardEvent {
  player: string;
  game_id: number;
  special_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialNeonCardEventValue` struct
export interface SpecialNeonCardEventValue {
  game_id: number;
  special_card_idx: number;
  current_hand_card_idx: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialPokerHandEvent` struct
export interface SpecialPokerHandEvent {
  player: string;
  game_id: number;
  current_special_card_idx: number;
  multi: number;
  points: number;
}

// Type definition for `jokers_of_neon::models::data::events::SpecialPokerHandEventValue` struct
export interface SpecialPokerHandEventValue {
  game_id: number;
  current_special_card_idx: number;
  multi: number;
  points: number;
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

// Type definition for `jokers_of_neon::models::status::game::game::GameState` enum
export enum GameState {
  IN_GAME,
  AT_SHOP,
  FINISHED,
  OPEN_BLISTER_PACK,
}

// Type definition for `jokers_of_neon::models::status::shop::shop::CardItemType` enum
export enum CardItemType {
  None,
  Common,
  Modifier,
}

// Type definition for `jokers_of_neon::models::data::card::Suit` enum
export enum Suit {
  None,
  Clubs,
  Diamonds,
  Hearts,
  Spades,
  Joker,
  Wild,
}

export interface SchemaType extends ISchemaType {
  jokers_of_neon: {
    DeckCard: WithFieldOrder<DeckCard>;
    DeckCardValue: WithFieldOrder<DeckCardValue>;
    GameDeck: WithFieldOrder<GameDeck>;
    GameDeckValue: WithFieldOrder<GameDeckValue>;
    GamePowerUp: WithFieldOrder<GamePowerUp>;
    GamePowerUpValue: WithFieldOrder<GamePowerUpValue>;
    CurrentSpecialCards: WithFieldOrder<CurrentSpecialCards>;
    CurrentSpecialCardsValue: WithFieldOrder<CurrentSpecialCardsValue>;
    Game: WithFieldOrder<Game>;
    GameValue: WithFieldOrder<GameValue>;
    PlayerLevelPokerHand: WithFieldOrder<PlayerLevelPokerHand>;
    PlayerLevelPokerHandValue: WithFieldOrder<PlayerLevelPokerHandValue>;
    RageRound: WithFieldOrder<RageRound>;
    RageRoundValue: WithFieldOrder<RageRoundValue>;
    CurrentHand: WithFieldOrder<CurrentHand>;
    CurrentHandValue: WithFieldOrder<CurrentHandValue>;
    Round: WithFieldOrder<Round>;
    RoundValue: WithFieldOrder<RoundValue>;
    BlisterPackItem: WithFieldOrder<BlisterPackItem>;
    BlisterPackItemValue: WithFieldOrder<BlisterPackItemValue>;
    BlisterPackResult: WithFieldOrder<BlisterPackResult>;
    BlisterPackResultValue: WithFieldOrder<BlisterPackResultValue>;
    BurnItem: WithFieldOrder<BurnItem>;
    BurnItemValue: WithFieldOrder<BurnItemValue>;
    CardItem: WithFieldOrder<CardItem>;
    CardItemValue: WithFieldOrder<CardItemValue>;
    PokerHandItem: WithFieldOrder<PokerHandItem>;
    PokerHandItemValue: WithFieldOrder<PokerHandItemValue>;
    PowerUpItem: WithFieldOrder<PowerUpItem>;
    PowerUpItemValue: WithFieldOrder<PowerUpItemValue>;
    Shop: WithFieldOrder<Shop>;
    ShopTracker: WithFieldOrder<ShopTracker>;
    ShopTrackerValue: WithFieldOrder<ShopTrackerValue>;
    ShopValue: WithFieldOrder<ShopValue>;
    SlotSpecialCardsItem: WithFieldOrder<SlotSpecialCardsItem>;
    SlotSpecialCardsItemValue: WithFieldOrder<SlotSpecialCardsItemValue>;
    SpecialCardItem: WithFieldOrder<SpecialCardItem>;
    SpecialCardItemValue: WithFieldOrder<SpecialCardItemValue>;
    BuyBlisterPackEvent: WithFieldOrder<BuyBlisterPackEvent>;
    BuyBlisterPackEventValue: WithFieldOrder<BuyBlisterPackEventValue>;
    BuyCardEvent: WithFieldOrder<BuyCardEvent>;
    BuyCardEventValue: WithFieldOrder<BuyCardEventValue>;
    BuyPokerHandEvent: WithFieldOrder<BuyPokerHandEvent>;
    BuyPokerHandEventValue: WithFieldOrder<BuyPokerHandEventValue>;
    BuyRerollEvent: WithFieldOrder<BuyRerollEvent>;
    BuyRerollEventValue: WithFieldOrder<BuyRerollEventValue>;
    BuySpecialCardEvent: WithFieldOrder<BuySpecialCardEvent>;
    BuySpecialCardEventValue: WithFieldOrder<BuySpecialCardEventValue>;
    CardScoreEvent: WithFieldOrder<CardScoreEvent>;
    CardScoreEventValue: WithFieldOrder<CardScoreEventValue>;
    CreateGameEvent: WithFieldOrder<CreateGameEvent>;
    CreateGameEventValue: WithFieldOrder<CreateGameEventValue>;
    CurrentHandEvent: WithFieldOrder<CurrentHandEvent>;
    CurrentHandEventValue: WithFieldOrder<CurrentHandEventValue>;
    DestroyedSpecialCardEvent: WithFieldOrder<DestroyedSpecialCardEvent>;
    DestroyedSpecialCardEventValue: WithFieldOrder<DestroyedSpecialCardEventValue>;
    DetailEarnedEvent: WithFieldOrder<DetailEarnedEvent>;
    DetailEarnedEventValue: WithFieldOrder<DetailEarnedEventValue>;
    GameEvent: WithFieldOrder<GameEvent>;
    GameEventValue: WithFieldOrder<GameEventValue>;
    GamePowerUpEvent: WithFieldOrder<GamePowerUpEvent>;
    GamePowerUpEventValue: WithFieldOrder<GamePowerUpEventValue>;
    LevelUpHandEvent: WithFieldOrder<LevelUpHandEvent>;
    LevelUpHandEventValue: WithFieldOrder<LevelUpHandEventValue>;
    LifeSaverSpecialCardEvent: WithFieldOrder<LifeSaverSpecialCardEvent>;
    LifeSaverSpecialCardEventValue: WithFieldOrder<LifeSaverSpecialCardEventValue>;
    ModifierCardSuitEvent: WithFieldOrder<ModifierCardSuitEvent>;
    ModifierCardSuitEventValue: WithFieldOrder<ModifierCardSuitEventValue>;
    ModifierNeonCardEvent: WithFieldOrder<ModifierNeonCardEvent>;
    ModifierNeonCardEventValue: WithFieldOrder<ModifierNeonCardEventValue>;
    ModifierWildCardEvent: WithFieldOrder<ModifierWildCardEvent>;
    ModifierWildCardEventValue: WithFieldOrder<ModifierWildCardEventValue>;
    NeonPokerHandEvent: WithFieldOrder<NeonPokerHandEvent>;
    NeonPokerHandEventValue: WithFieldOrder<NeonPokerHandEventValue>;
    PlayGameOverEvent: WithFieldOrder<PlayGameOverEvent>;
    PlayGameOverEventValue: WithFieldOrder<PlayGameOverEventValue>;
    PlayPokerHandEvent: WithFieldOrder<PlayPokerHandEvent>;
    PlayPokerHandEventValue: WithFieldOrder<PlayPokerHandEventValue>;
    PlayWinGameEvent: WithFieldOrder<PlayWinGameEvent>;
    PlayWinGameEventValue: WithFieldOrder<PlayWinGameEventValue>;
    PokerHandEvent: WithFieldOrder<PokerHandEvent>;
    PokerHandEventValue: WithFieldOrder<PokerHandEventValue>;
    PowerUpEvent: WithFieldOrder<PowerUpEvent>;
    PowerUpEventValue: WithFieldOrder<PowerUpEventValue>;
    RoundScoreEvent: WithFieldOrder<RoundScoreEvent>;
    RoundScoreEventValue: WithFieldOrder<RoundScoreEventValue>;
    SecondChanceEvent: WithFieldOrder<SecondChanceEvent>;
    SecondChanceEventValue: WithFieldOrder<SecondChanceEventValue>;
    SpecialCashEvent: WithFieldOrder<SpecialCashEvent>;
    SpecialCashEventValue: WithFieldOrder<SpecialCashEventValue>;
    SpecialGlobalEvent: WithFieldOrder<SpecialGlobalEvent>;
    SpecialGlobalEventValue: WithFieldOrder<SpecialGlobalEventValue>;
    SpecialModifierMultiEvent: WithFieldOrder<SpecialModifierMultiEvent>;
    SpecialModifierMultiEventValue: WithFieldOrder<SpecialModifierMultiEventValue>;
    SpecialModifierPointsEvent: WithFieldOrder<SpecialModifierPointsEvent>;
    SpecialModifierPointsEventValue: WithFieldOrder<SpecialModifierPointsEventValue>;
    SpecialModifierSuitEvent: WithFieldOrder<SpecialModifierSuitEvent>;
    SpecialModifierSuitEventValue: WithFieldOrder<SpecialModifierSuitEventValue>;
    SpecialNeonCardEvent: WithFieldOrder<SpecialNeonCardEvent>;
    SpecialNeonCardEventValue: WithFieldOrder<SpecialNeonCardEventValue>;
    SpecialPokerHandEvent: WithFieldOrder<SpecialPokerHandEvent>;
    SpecialPokerHandEventValue: WithFieldOrder<SpecialPokerHandEventValue>;
  };
}
export const schema: SchemaType = {
  jokers_of_neon: {
    DeckCard: {
      fieldOrder: ["game_id", "index", "card_id"],
      game_id: 0,
      index: 0,
      card_id: 0,
    },
    DeckCardValue: {
      fieldOrder: ["card_id"],
      card_id: 0,
    },
    GameDeck: {
      fieldOrder: ["game_id", "len", "round_len"],
      game_id: 0,
      len: 0,
      round_len: 0,
    },
    GameDeckValue: {
      fieldOrder: ["len", "round_len"],
      len: 0,
      round_len: 0,
    },
    GamePowerUp: {
      fieldOrder: ["game_id", "power_ups"],
      game_id: 0,
      power_ups: [0],
    },
    GamePowerUpValue: {
      fieldOrder: ["power_ups"],
      power_ups: [0],
    },
    CurrentSpecialCards: {
      fieldOrder: [
        "game_id",
        "idx",
        "effect_card_id",
        "is_temporary",
        "remaining",
      ],
      game_id: 0,
      idx: 0,
      effect_card_id: 0,
      is_temporary: false,
      remaining: 0,
    },
    CurrentSpecialCardsValue: {
      fieldOrder: ["effect_card_id", "is_temporary", "remaining"],
      effect_card_id: 0,
      is_temporary: false,
      remaining: 0,
    },
    Game: {
      fieldOrder: [
        "id",
        "mod_id",
        "owner",
        "player_name",
        "max_hands",
        "max_discard",
        "max_jokers",
        "round",
        "player_score",
        "level",
        "len_hand",
        "len_max_current_special_cards",
        "len_current_special_cards",
        "current_jokers",
        "len_max_current_power_ups",
        "state",
        "cash",
      ],
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
      state: GameState.IN_GAME,
      cash: 0,
    },
    GameValue: {
      fieldOrder: [
        "owner",
        "player_name",
        "max_hands",
        "max_discard",
        "max_jokers",
        "round",
        "player_score",
        "level",
        "len_hand",
        "len_max_current_special_cards",
        "len_current_special_cards",
        "current_jokers",
        "len_max_current_power_ups",
        "state",
        "cash",
      ],
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
    PlayerLevelPokerHand: {
      fieldOrder: ["game_id", "poker_hand", "level"],
      game_id: 0,
      poker_hand: PokerHand.None,
      level: 0,
    },
    PlayerLevelPokerHandValue: {
      fieldOrder: ["level"],
      level: 0,
    },
    RageRound: {
      fieldOrder: [
        "game_id",
        "is_active",
        "current_probability",
        "active_rage_ids",
        "last_active_level",
      ],
      game_id: 0,
      is_active: false,
      current_probability: 0,
      active_rage_ids: [0],
      last_active_level: 0,
    },
    RageRoundValue: {
      fieldOrder: [
        "is_active",
        "current_probability",
        "active_rage_ids",
        "last_active_level",
      ],
      is_active: false,
      current_probability: 0,
      active_rage_ids: [0],
      last_active_level: 0,
    },
    CurrentHand: {
      fieldOrder: ["game_id", "cards"],
      game_id: 0,
      cards: [0],
    },
    CurrentHandValue: {
      fieldOrder: ["cards"],
      cards: [0],
    },
    Round: {
      fieldOrder: [
        "game_id",
        "player_score",
        "level_score",
        "hands",
        "discard",
      ],
      game_id: 0,
      player_score: 0,
      level_score: 0,
      hands: 0,
      discard: 0,
    },
    RoundValue: {
      fieldOrder: ["player_score", "level_score", "hands", "discard"],
      player_score: 0,
      level_score: 0,
      hands: 0,
      discard: 0,
    },
    BlisterPackItem: {
      fieldOrder: [
        "game_id",
        "idx",
        "blister_pack_id",
        "cost",
        "discount_cost",
        "purchased",
      ],
      game_id: 0,
      idx: 0,
      blister_pack_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    BlisterPackItemValue: {
      fieldOrder: ["blister_pack_id", "cost", "discount_cost", "purchased"],
      blister_pack_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    BlisterPackResult: {
      fieldOrder: ["game_id", "cards_picked", "cards"],
      game_id: 0,
      cards_picked: false,
      cards: [0],
    },
    BlisterPackResultValue: {
      fieldOrder: ["cards_picked", "cards"],
      cards_picked: false,
      cards: [0],
    },
    BurnItem: {
      fieldOrder: ["game_id", "cost", "discount_cost", "purchased"],
      game_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    BurnItemValue: {
      fieldOrder: ["cost", "discount_cost", "purchased"],
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    CardItem: {
      fieldOrder: [
        "game_id",
        "idx",
        "item_type",
        "card_id",
        "cost",
        "discount_cost",
        "purchased",
      ],
      game_id: 0,
      idx: 0,
      item_type: CardItemType.None,
      card_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    CardItemValue: {
      fieldOrder: ["card_id", "cost", "discount_cost", "purchased"],
      card_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    PokerHandItem: {
      fieldOrder: [
        "game_id",
        "idx",
        "poker_hand",
        "level",
        "multi",
        "points",
        "cost",
        "discount_cost",
        "purchased",
      ],
      game_id: 0,
      idx: 0,
      poker_hand: PokerHand.None,
      level: 0,
      multi: 0,
      points: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    PokerHandItemValue: {
      fieldOrder: [
        "poker_hand",
        "level",
        "multi",
        "points",
        "cost",
        "discount_cost",
        "purchased",
      ],
      poker_hand: PokerHand.None,
      level: 0,
      multi: 0,
      points: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    PowerUpItem: {
      fieldOrder: [
        "game_id",
        "idx",
        "power_up_id",
        "cost",
        "discount_cost",
        "purchased",
      ],
      game_id: 0,
      idx: 0,
      power_up_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    PowerUpItemValue: {
      fieldOrder: ["power_up_id", "cost", "discount_cost", "purchased"],
      power_up_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    Shop: {
      fieldOrder: [
        "game_id",
        "reroll_cost",
        "reroll_executed",
        "len_item_common_cards",
        "len_item_modifier_cards",
        "len_item_special_cards",
        "len_item_poker_hands",
        "len_item_blister_pack",
        "len_item_power_ups",
      ],
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
      fieldOrder: ["game_id", "count_reroll", "count_burn"],
      game_id: 0,
      count_reroll: 0,
      count_burn: 0,
    },
    ShopTrackerValue: {
      fieldOrder: ["count_reroll", "count_burn"],
      count_reroll: 0,
      count_burn: 0,
    },
    ShopValue: {
      fieldOrder: [
        "reroll_cost",
        "reroll_executed",
        "len_item_common_cards",
        "len_item_modifier_cards",
        "len_item_special_cards",
        "len_item_poker_hands",
        "len_item_blister_pack",
        "len_item_power_ups",
      ],
      reroll_cost: 0,
      reroll_executed: false,
      len_item_common_cards: 0,
      len_item_modifier_cards: 0,
      len_item_special_cards: 0,
      len_item_poker_hands: 0,
      len_item_blister_pack: 0,
      len_item_power_ups: 0,
    },
    SlotSpecialCardsItem: {
      fieldOrder: ["game_id", "cost", "discount_cost", "purchased"],
      game_id: 0,
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    SlotSpecialCardsItemValue: {
      fieldOrder: ["cost", "discount_cost", "purchased"],
      cost: 0,
      discount_cost: 0,
      purchased: false,
    },
    SpecialCardItem: {
      fieldOrder: [
        "game_id",
        "idx",
        "card_id",
        "cost",
        "discount_cost",
        "temporary_cost",
        "temporary_discount_cost",
        "purchased",
      ],
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
      fieldOrder: [
        "card_id",
        "cost",
        "discount_cost",
        "temporary_cost",
        "temporary_discount_cost",
        "purchased",
      ],
      card_id: 0,
      cost: 0,
      discount_cost: 0,
      temporary_cost: 0,
      temporary_discount_cost: 0,
      purchased: false,
    },
    BuyBlisterPackEvent: {
      fieldOrder: ["game_id", "level", "idx", "blister_pack_id"],
      game_id: 0,
      level: 0,
      idx: 0,
      blister_pack_id: 0,
    },
    BuyBlisterPackEventValue: {
      fieldOrder: ["blister_pack_id"],
      blister_pack_id: 0,
    },
    BuyCardEvent: {
      fieldOrder: ["game_id", "level", "idx", "item_type", "card_id"],
      game_id: 0,
      level: 0,
      idx: 0,
      item_type: CardItemType.None,
      card_id: 0,
    },
    BuyCardEventValue: {
      fieldOrder: ["card_id"],
      card_id: 0,
    },
    BuyPokerHandEvent: {
      fieldOrder: ["game_id", "level", "idx", "poker_hand", "level_hand"],
      game_id: 0,
      level: 0,
      idx: 0,
      poker_hand: PokerHand.None,
      level_hand: 0,
    },
    BuyPokerHandEventValue: {
      fieldOrder: ["poker_hand", "level_hand"],
      poker_hand: PokerHand.None,
      level_hand: 0,
    },
    BuyRerollEvent: {
      fieldOrder: ["game_id", "level", "reroll_cost", "reroll_executed"],
      game_id: 0,
      level: 0,
      reroll_cost: 0,
      reroll_executed: false,
    },
    BuyRerollEventValue: {
      fieldOrder: ["reroll_cost", "reroll_executed"],
      reroll_cost: 0,
      reroll_executed: false,
    },
    BuySpecialCardEvent: {
      fieldOrder: ["game_id", "level", "idx", "card_id", "is_temporary"],
      game_id: 0,
      level: 0,
      idx: 0,
      card_id: 0,
      is_temporary: false,
    },
    BuySpecialCardEventValue: {
      fieldOrder: ["card_id", "is_temporary"],
      card_id: 0,
      is_temporary: false,
    },
    CardScoreEvent: {
      fieldOrder: ["player", "index", "multi", "points"],
      player: "",
      index: 0,
      multi: 0,
      points: 0,
    },
    CardScoreEventValue: {
      fieldOrder: ["index", "multi", "points"],
      index: 0,
      multi: 0,
      points: 0,
    },
    CreateGameEvent: {
      fieldOrder: ["player", "game_id"],
      player: "",
      game_id: 0,
    },
    CreateGameEventValue: {
      fieldOrder: ["game_id"],
      game_id: 0,
    },
    CurrentHandEvent: {
      fieldOrder: ["game_id", "cards"],
      game_id: 0,
      cards: [0],
    },
    CurrentHandEventValue: {
      fieldOrder: ["cards"],
      cards: [0],
    },
    DestroyedSpecialCardEvent: {
      fieldOrder: ["player", "card_id"],
      player: "",
      card_id: 0,
    },
    DestroyedSpecialCardEventValue: {
      fieldOrder: ["card_id"],
      card_id: 0,
    },
    DetailEarnedEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "round_defeat",
        "level_bonus",
        "hands_left",
        "hands_left_cash",
        "discard_left",
        "discard_left_cash",
        "rage_card_defeated",
        "rage_card_defeated_cash",
        "total",
      ],
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
      fieldOrder: [
        "game_id",
        "round_defeat",
        "level_bonus",
        "hands_left",
        "hands_left_cash",
        "discard_left",
        "discard_left_cash",
        "rage_card_defeated",
        "rage_card_defeated_cash",
        "total",
      ],
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
      fieldOrder: [
        "id",
        "owner",
        "player_name",
        "max_hands",
        "max_discard",
        "max_jokers",
        "round",
        "player_score",
        "level",
        "len_hand",
        "len_max_current_special_cards",
        "len_current_special_cards",
        "current_jokers",
        "state",
        "cash",
      ],
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
      state: GameState.IN_GAME,
      cash: 0,
    },
    GameEventValue: {
      fieldOrder: [
        "owner",
        "player_name",
        "max_hands",
        "max_discard",
        "max_jokers",
        "round",
        "player_score",
        "level",
        "len_hand",
        "len_max_current_special_cards",
        "len_current_special_cards",
        "current_jokers",
        "state",
        "cash",
      ],
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
      state: GameState.IN_GAME,
      cash: 0,
    },
    GamePowerUpEvent: {
      fieldOrder: ["player", "game_id", "power_ups"],
      player: "",
      game_id: 0,
      power_ups: [0],
    },
    GamePowerUpEventValue: {
      fieldOrder: ["game_id", "power_ups"],
      game_id: 0,
      power_ups: [0],
    },
    LevelUpHandEvent: {
      fieldOrder: [
        "player",
        "hand",
        "old_level",
        "old_points",
        "old_multi",
        "level",
        "points",
        "multi",
      ],
      player: "",
      hand: PokerHand.None,
      old_level: 0,
      old_points: 0,
      old_multi: 0,
      level: 0,
      points: 0,
      multi: 0,
    },
    LevelUpHandEventValue: {
      fieldOrder: [
        "hand",
        "old_level",
        "old_points",
        "old_multi",
        "level",
        "points",
        "multi",
      ],
      hand: PokerHand.None,
      old_level: 0,
      old_points: 0,
      old_multi: 0,
      level: 0,
      points: 0,
      multi: 0,
    },
    LifeSaverSpecialCardEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "special_card_idx",
        "old_level_score",
        "new_level_score",
      ],
      player: "",
      game_id: 0,
      special_card_idx: 0,
      old_level_score: 0,
      new_level_score: 0,
    },
    LifeSaverSpecialCardEventValue: {
      fieldOrder: [
        "game_id",
        "special_card_idx",
        "old_level_score",
        "new_level_score",
      ],
      game_id: 0,
      special_card_idx: 0,
      old_level_score: 0,
      new_level_score: 0,
    },
    ModifierCardSuitEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "modifier_card_idx",
        "current_hand_card_idx",
        "suit",
      ],
      player: "",
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
      suit: Suit.None,
    },
    ModifierCardSuitEventValue: {
      fieldOrder: [
        "game_id",
        "modifier_card_idx",
        "current_hand_card_idx",
        "suit",
      ],
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
      suit: Suit.None,
    },
    ModifierNeonCardEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "modifier_card_idx",
        "current_hand_card_idx",
      ],
      player: "",
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
    },
    ModifierNeonCardEventValue: {
      fieldOrder: ["game_id", "modifier_card_idx", "current_hand_card_idx"],
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
    },
    ModifierWildCardEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "modifier_card_idx",
        "current_hand_card_idx",
      ],
      player: "",
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
    },
    ModifierWildCardEventValue: {
      fieldOrder: ["game_id", "modifier_card_idx", "current_hand_card_idx"],
      game_id: 0,
      modifier_card_idx: 0,
      current_hand_card_idx: 0,
    },
    NeonPokerHandEvent: {
      fieldOrder: ["player", "game_id", "neon_cards_idx", "multi", "points"],
      player: "",
      game_id: 0,
      neon_cards_idx: [0],
      multi: 0,
      points: 0,
    },
    NeonPokerHandEventValue: {
      fieldOrder: ["game_id", "neon_cards_idx", "multi", "points"],
      game_id: 0,
      neon_cards_idx: [0],
      multi: 0,
      points: 0,
    },
    PlayGameOverEvent: {
      fieldOrder: ["player", "game_id"],
      player: "",
      game_id: 0,
    },
    PlayGameOverEventValue: {
      fieldOrder: ["game_id"],
      game_id: 0,
    },
    PlayPokerHandEvent: {
      fieldOrder: ["game_id", "level", "count_hand", "poker_hand"],
      game_id: 0,
      level: 0,
      count_hand: 0,
      poker_hand: PokerHand.None,
    },
    PlayPokerHandEventValue: {
      fieldOrder: ["poker_hand"],
      poker_hand: PokerHand.None,
    },
    PlayWinGameEvent: {
      fieldOrder: ["player", "game_id", "level", "player_score"],
      player: "",
      game_id: 0,
      level: 0,
      player_score: 0,
    },
    PlayWinGameEventValue: {
      fieldOrder: ["game_id", "level", "player_score"],
      game_id: 0,
      level: 0,
      player_score: 0,
    },
    PokerHandEvent: {
      fieldOrder: ["player", "poker_hand", "multi", "points"],
      player: "",
      poker_hand: 0,
      multi: 0,
      points: 0,
    },
    PokerHandEventValue: {
      fieldOrder: ["poker_hand", "multi", "points"],
      poker_hand: 0,
      multi: 0,
      points: 0,
    },
    PowerUpEvent: {
      fieldOrder: ["player", "index", "multi", "points", "special_idx"],
      player: "",
      index: 0,
      multi: 0,
      points: 0,
      special_idx: 0,
    },
    PowerUpEventValue: {
      fieldOrder: ["index", "multi", "points", "special_idx"],
      index: 0,
      multi: 0,
      points: 0,
      special_idx: 0,
    },
    RoundScoreEvent: {
      fieldOrder: ["player", "game_id", "player_score"],
      player: "",
      game_id: 0,
      player_score: 0,
    },
    RoundScoreEventValue: {
      fieldOrder: ["game_id", "player_score"],
      game_id: 0,
      player_score: 0,
    },
    SecondChanceEvent: {
      fieldOrder: ["player", "special_idx"],
      player: "",
      special_idx: 0,
    },
    SecondChanceEventValue: {
      fieldOrder: ["special_idx"],
      special_idx: 0,
    },
    SpecialCashEvent: {
      fieldOrder: ["player", "cash", "card_idx", "special_idx"],
      player: "",
      cash: 0,
      card_idx: 0,
      special_idx: 0,
    },
    SpecialCashEventValue: {
      fieldOrder: ["cash", "card_idx", "special_idx"],
      cash: 0,
      card_idx: 0,
      special_idx: 0,
    },
    SpecialGlobalEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "current_special_card_idx",
        "multi",
        "points",
      ],
      player: "",
      game_id: 0,
      current_special_card_idx: 0,
      multi: 0,
      points: 0,
    },
    SpecialGlobalEventValue: {
      fieldOrder: ["game_id", "current_special_card_idx", "multi", "points"],
      game_id: 0,
      current_special_card_idx: 0,
      multi: 0,
      points: 0,
    },
    SpecialModifierMultiEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "multi",
        "is_negative",
      ],
      player: "",
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      multi: 0,
      is_negative: false,
    },
    SpecialModifierMultiEventValue: {
      fieldOrder: [
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "multi",
        "is_negative",
      ],
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      multi: 0,
      is_negative: false,
    },
    SpecialModifierPointsEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "points",
      ],
      player: "",
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      points: 0,
    },
    SpecialModifierPointsEventValue: {
      fieldOrder: [
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "points",
      ],
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      points: 0,
    },
    SpecialModifierSuitEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "suit",
      ],
      player: "",
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      suit: Suit.None,
    },
    SpecialModifierSuitEventValue: {
      fieldOrder: [
        "game_id",
        "current_special_card_idx",
        "current_hand_card_idx",
        "suit",
      ],
      game_id: 0,
      current_special_card_idx: 0,
      current_hand_card_idx: 0,
      suit: Suit.None,
    },
    SpecialNeonCardEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "special_card_idx",
        "current_hand_card_idx",
      ],
      player: "",
      game_id: 0,
      special_card_idx: 0,
      current_hand_card_idx: 0,
    },
    SpecialNeonCardEventValue: {
      fieldOrder: ["game_id", "special_card_idx", "current_hand_card_idx"],
      game_id: 0,
      special_card_idx: 0,
      current_hand_card_idx: 0,
    },
    SpecialPokerHandEvent: {
      fieldOrder: [
        "player",
        "game_id",
        "current_special_card_idx",
        "multi",
        "points",
      ],
      player: "",
      game_id: 0,
      current_special_card_idx: 0,
      multi: 0,
      points: 0,
    },
    SpecialPokerHandEventValue: {
      fieldOrder: ["game_id", "current_special_card_idx", "multi", "points"],
      game_id: 0,
      current_special_card_idx: 0,
      multi: 0,
      points: 0,
    },
  },
};
export enum ModelsMapping {
  DeckCard = "jokers_of_neon-DeckCard",
  DeckCardValue = "jokers_of_neon-DeckCardValue",
  GameDeck = "jokers_of_neon-GameDeck",
  GameDeckValue = "jokers_of_neon-GameDeckValue",
  PokerHand = "jokers_of_neon-PokerHand",
  GamePowerUp = "jokers_of_neon-GamePowerUp",
  GamePowerUpValue = "jokers_of_neon-GamePowerUpValue",
  CurrentSpecialCards = "jokers_of_neon-CurrentSpecialCards",
  CurrentSpecialCardsValue = "jokers_of_neon-CurrentSpecialCardsValue",
  Game = "jokers_of_neon-Game",
  GameState = "jokers_of_neon-GameState",
  GameValue = "jokers_of_neon-GameValue",
  PlayerLevelPokerHand = "jokers_of_neon-PlayerLevelPokerHand",
  PlayerLevelPokerHandValue = "jokers_of_neon-PlayerLevelPokerHandValue",
  RageRound = "jokers_of_neon-RageRound",
  RageRoundValue = "jokers_of_neon-RageRoundValue",
  CurrentHand = "jokers_of_neon-CurrentHand",
  CurrentHandValue = "jokers_of_neon-CurrentHandValue",
  Round = "jokers_of_neon-Round",
  RoundValue = "jokers_of_neon-RoundValue",
  BlisterPackItem = "jokers_of_neon-BlisterPackItem",
  BlisterPackItemValue = "jokers_of_neon-BlisterPackItemValue",
  BlisterPackResult = "jokers_of_neon-BlisterPackResult",
  BlisterPackResultValue = "jokers_of_neon-BlisterPackResultValue",
  BurnItem = "jokers_of_neon-BurnItem",
  BurnItemValue = "jokers_of_neon-BurnItemValue",
  CardItem = "jokers_of_neon-CardItem",
  CardItemType = "jokers_of_neon-CardItemType",
  CardItemValue = "jokers_of_neon-CardItemValue",
  PokerHandItem = "jokers_of_neon-PokerHandItem",
  PokerHandItemValue = "jokers_of_neon-PokerHandItemValue",
  PowerUpItem = "jokers_of_neon-PowerUpItem",
  PowerUpItemValue = "jokers_of_neon-PowerUpItemValue",
  Shop = "jokers_of_neon-Shop",
  ShopTracker = "jokers_of_neon-ShopTracker",
  ShopTrackerValue = "jokers_of_neon-ShopTrackerValue",
  ShopValue = "jokers_of_neon-ShopValue",
  SlotSpecialCardsItem = "jokers_of_neon-SlotSpecialCardsItem",
  SlotSpecialCardsItemValue = "jokers_of_neon-SlotSpecialCardsItemValue",
  SpecialCardItem = "jokers_of_neon-SpecialCardItem",
  SpecialCardItemValue = "jokers_of_neon-SpecialCardItemValue",
  Suit = "jokers_of_neon-Suit",
  BuyBlisterPackEvent = "jokers_of_neon-BuyBlisterPackEvent",
  BuyBlisterPackEventValue = "jokers_of_neon-BuyBlisterPackEventValue",
  BuyCardEvent = "jokers_of_neon-BuyCardEvent",
  BuyCardEventValue = "jokers_of_neon-BuyCardEventValue",
  BuyPokerHandEvent = "jokers_of_neon-BuyPokerHandEvent",
  BuyPokerHandEventValue = "jokers_of_neon-BuyPokerHandEventValue",
  BuyRerollEvent = "jokers_of_neon-BuyRerollEvent",
  BuyRerollEventValue = "jokers_of_neon-BuyRerollEventValue",
  BuySpecialCardEvent = "jokers_of_neon-BuySpecialCardEvent",
  BuySpecialCardEventValue = "jokers_of_neon-BuySpecialCardEventValue",
  CardScoreEvent = "jokers_of_neon-CardScoreEvent",
  CardScoreEventValue = "jokers_of_neon-CardScoreEventValue",
  CreateGameEvent = "jokers_of_neon-CreateGameEvent",
  CreateGameEventValue = "jokers_of_neon-CreateGameEventValue",
  CurrentHandEvent = "jokers_of_neon-CurrentHandEvent",
  CurrentHandEventValue = "jokers_of_neon-CurrentHandEventValue",
  DestroyedSpecialCardEvent = "jokers_of_neon-DestroyedSpecialCardEvent",
  DestroyedSpecialCardEventValue = "jokers_of_neon-DestroyedSpecialCardEventValue",
  DetailEarnedEvent = "jokers_of_neon-DetailEarnedEvent",
  DetailEarnedEventValue = "jokers_of_neon-DetailEarnedEventValue",
  GameEvent = "jokers_of_neon-GameEvent",
  GameEventValue = "jokers_of_neon-GameEventValue",
  GamePowerUpEvent = "jokers_of_neon-GamePowerUpEvent",
  GamePowerUpEventValue = "jokers_of_neon-GamePowerUpEventValue",
  LevelUpHandEvent = "jokers_of_neon-LevelUpHandEvent",
  LevelUpHandEventValue = "jokers_of_neon-LevelUpHandEventValue",
  LifeSaverSpecialCardEvent = "jokers_of_neon-LifeSaverSpecialCardEvent",
  LifeSaverSpecialCardEventValue = "jokers_of_neon-LifeSaverSpecialCardEventValue",
  ModifierCardSuitEvent = "jokers_of_neon-ModifierCardSuitEvent",
  ModifierCardSuitEventValue = "jokers_of_neon-ModifierCardSuitEventValue",
  ModifierNeonCardEvent = "jokers_of_neon-ModifierNeonCardEvent",
  ModifierNeonCardEventValue = "jokers_of_neon-ModifierNeonCardEventValue",
  ModifierWildCardEvent = "jokers_of_neon-ModifierWildCardEvent",
  ModifierWildCardEventValue = "jokers_of_neon-ModifierWildCardEventValue",
  NeonPokerHandEvent = "jokers_of_neon-NeonPokerHandEvent",
  NeonPokerHandEventValue = "jokers_of_neon-NeonPokerHandEventValue",
  PlayGameOverEvent = "jokers_of_neon-PlayGameOverEvent",
  PlayGameOverEventValue = "jokers_of_neon-PlayGameOverEventValue",
  PlayPokerHandEvent = "jokers_of_neon-PlayPokerHandEvent",
  PlayPokerHandEventValue = "jokers_of_neon-PlayPokerHandEventValue",
  PlayWinGameEvent = "jokers_of_neon-PlayWinGameEvent",
  PlayWinGameEventValue = "jokers_of_neon-PlayWinGameEventValue",
  PokerHandEvent = "jokers_of_neon-PokerHandEvent",
  PokerHandEventValue = "jokers_of_neon-PokerHandEventValue",
  PowerUpEvent = "jokers_of_neon-PowerUpEvent",
  PowerUpEventValue = "jokers_of_neon-PowerUpEventValue",
  RoundScoreEvent = "jokers_of_neon-RoundScoreEvent",
  RoundScoreEventValue = "jokers_of_neon-RoundScoreEventValue",
  SecondChanceEvent = "jokers_of_neon-SecondChanceEvent",
  SecondChanceEventValue = "jokers_of_neon-SecondChanceEventValue",
  SpecialCashEvent = "jokers_of_neon-SpecialCashEvent",
  SpecialCashEventValue = "jokers_of_neon-SpecialCashEventValue",
  SpecialGlobalEvent = "jokers_of_neon-SpecialGlobalEvent",
  SpecialGlobalEventValue = "jokers_of_neon-SpecialGlobalEventValue",
  SpecialModifierMultiEvent = "jokers_of_neon-SpecialModifierMultiEvent",
  SpecialModifierMultiEventValue = "jokers_of_neon-SpecialModifierMultiEventValue",
  SpecialModifierPointsEvent = "jokers_of_neon-SpecialModifierPointsEvent",
  SpecialModifierPointsEventValue = "jokers_of_neon-SpecialModifierPointsEventValue",
  SpecialModifierSuitEvent = "jokers_of_neon-SpecialModifierSuitEvent",
  SpecialModifierSuitEventValue = "jokers_of_neon-SpecialModifierSuitEventValue",
  SpecialNeonCardEvent = "jokers_of_neon-SpecialNeonCardEvent",
  SpecialNeonCardEventValue = "jokers_of_neon-SpecialNeonCardEventValue",
  SpecialPokerHandEvent = "jokers_of_neon-SpecialPokerHandEvent",
  SpecialPokerHandEventValue = "jokers_of_neon-SpecialPokerHandEventValue",
}
