import { gql } from "graphql-tag";
import { Plays } from "../../enums/plays";
import graphQLClient from "../../graphQLClient";
import { snakeToCamel } from "../../utils/snakeToCamel";

export interface GameTrackerView {
  highestHand: number;
  mostPlayedHand: Plays;
  mostPlayedHandCount: number;
  highestCash: number;
  cardsPlayedCount: number;
  cardsDiscardedCount: number;
  rageWins: number;
}

const DEFAULT_GAME_TRACKER: GameTrackerView = {
  highestHand: 0,
  mostPlayedHand: Plays.NONE,
  mostPlayedHandCount: 0,
  highestCash: 0,
  cardsPlayedCount: 0,
  cardsDiscardedCount: 0,
  rageWins: 0,
};

const POKER_HAND_TO_PLAY: Record<string, Plays> = {
  None: Plays.NONE,
  RoyalFlush: Plays.ROYAL_FLUSH,
  StraightFlush: Plays.STRAIGHT_FLUSH,
  FiveOfAKind: Plays.FIVE_OF_A_KIND,
  FourOfAKind: Plays.FOUR_OF_A_KIND,
  FullHouse: Plays.FULL_HOUSE,
  Straight: Plays.STRAIGHT,
  Flush: Plays.FLUSH,
  ThreeOfAKind: Plays.THREE_OF_A_KIND,
  TwoPair: Plays.TWO_PAIR,
  OnePair: Plays.PAIR,
  HighCard: Plays.HIGH_CARD,
};

const getPokerHandVariant = (hand: any): Plays => {
  if (typeof hand === "number") {
    return hand as Plays;
  }

  if (typeof hand === "bigint") {
    return Number(hand) as Plays;
  }

  if (typeof hand === "string") {
    return POKER_HAND_TO_PLAY[hand] ?? Plays.NONE;
  }

  if (hand?.variant && typeof hand.variant === "object") {
    const variantKey = Object.entries(hand.variant).find(
      ([, value]) => value !== undefined && value !== null
    )?.[0];
    if (variantKey) {
      return POKER_HAND_TO_PLAY[variantKey] ?? Plays.NONE;
    }
  }

  if (hand?.variant) {
    return POKER_HAND_TO_PLAY[hand.variant] ?? Plays.NONE;
  }

  const variantKey = Object.keys(hand ?? {}).find(
    (key) => key in POKER_HAND_TO_PLAY
  );

  return variantKey ? POKER_HAND_TO_PLAY[variantKey] : Plays.NONE;
};

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const GAME_TRACKER_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameTrackerModels`;

const GAME_TRACKER_QUERY = gql`
  query ($gameId: u64!) {
    ${GAME_TRACKER_FIELD_NAME}(
      where: { game_idEQ: $gameId }
      first: 1
    ) {
      edges {
        node {
          game_id
          highest_hand
          most_played_hand {
            _0
            _1
          }
          highest_cash
          cards_played_count
          cards_discarded_count
          rage_wins
        }
      }
    }
  }
`;

const parseTracker = (tracker: any): GameTrackerView => {
  const mostPlayedHandRaw = tracker?.most_played_hand ?? [];
  const hand =
    Array.isArray(mostPlayedHandRaw) && mostPlayedHandRaw.length > 0
      ? mostPlayedHandRaw[0]
      : mostPlayedHandRaw?.hand ??
        (mostPlayedHandRaw && typeof mostPlayedHandRaw === "object"
          ? (mostPlayedHandRaw as any)._0 ?? (mostPlayedHandRaw as any)[0]
          : typeof mostPlayedHandRaw === "string"
          ? (() => {
              const trimmed = mostPlayedHandRaw.trim();
              if (trimmed.startsWith("[")) {
                try {
                  const parsed = JSON.parse(trimmed);
                  return Array.isArray(parsed) ? parsed[0] : undefined;
                } catch {
                  return undefined;
                }
              }
              return mostPlayedHandRaw;
            })()
          : undefined);
  const count =
    Array.isArray(mostPlayedHandRaw) && mostPlayedHandRaw.length > 1
      ? mostPlayedHandRaw[1]
      : mostPlayedHandRaw?.count ??
        (mostPlayedHandRaw && typeof mostPlayedHandRaw === "object"
          ? (mostPlayedHandRaw as any)._1 ?? (mostPlayedHandRaw as any)[1]
          : typeof mostPlayedHandRaw === "string"
          ? (() => {
              const trimmed = mostPlayedHandRaw.trim();
              if (trimmed.startsWith("[")) {
                try {
                  const parsed = JSON.parse(trimmed);
                  return Array.isArray(parsed) ? parsed[1] : undefined;
                } catch {
                  return undefined;
                }
              }
              return undefined;
            })()
          : undefined);

  return {
    highestHand: Number(tracker?.highest_hand ?? tracker?.highestHand ?? 0),
    mostPlayedHand: getPokerHandVariant(hand),
    mostPlayedHandCount: Number(count ?? 0),
    highestCash: Number(tracker?.highest_cash ?? tracker?.highestCash ?? 0),
    cardsPlayedCount: Number(
      tracker?.cards_played_count ?? tracker?.cardsPlayedCount ?? 0
    ),
    cardsDiscardedCount: Number(
      tracker?.cards_discarded_count ?? tracker?.cardsDiscardedCount ?? 0
    ),
    rageWins: Number(tracker?.rage_wins ?? tracker?.rageWins ?? 0),
  };
};

export const getGameTracker = async (
  gameId: number
): Promise<GameTrackerView> => {
  if (!gameId) {
    return DEFAULT_GAME_TRACKER;
  }

  try {
    const graphQLResponse: Record<string, any> = await graphQLClient.request(
      GAME_TRACKER_QUERY,
      {
        gameId: gameId.toString(),
      }
    );
    const tracker =
      graphQLResponse?.[GAME_TRACKER_FIELD_NAME]?.edges?.[0]?.node ?? null;
    if (tracker) {
      return parseTracker(tracker);
    }
  } catch (e) {
    console.error("error getting game tracker via graphql", e);
  }

  return DEFAULT_GAME_TRACKER;
};

export const DEFAULT_TRACKER_VIEW = DEFAULT_GAME_TRACKER;
