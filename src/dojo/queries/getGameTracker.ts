import { Plays } from "../../enums/plays";

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

export const getGameTracker = async (
  client: any,
  gameId: number
): Promise<GameTrackerView> => {
  if (!gameId) {
    return DEFAULT_GAME_TRACKER;
  }

  try {
    const txResult: any = await client.game_views.getGameTracker(gameId);
    const tracker = txResult?.game_tracker ?? txResult?.[0] ?? txResult;
console.log("txr", txResult);
    const mostPlayedHandRaw = tracker?.most_played_hand ?? [];
    const hand =
      Array.isArray(mostPlayedHandRaw) && mostPlayedHandRaw.length > 0
        ? mostPlayedHandRaw[0]
        : mostPlayedHandRaw?.hand ??
          (mostPlayedHandRaw && typeof mostPlayedHandRaw === "object"
            ? mostPlayedHandRaw[0]
            : undefined);
    const count =
      Array.isArray(mostPlayedHandRaw) && mostPlayedHandRaw.length > 1
        ? mostPlayedHandRaw[1]
        : mostPlayedHandRaw?.count ??
          (mostPlayedHandRaw && typeof mostPlayedHandRaw === "object"
            ? mostPlayedHandRaw[1]
            : undefined);

    return {
      highestHand: Number(tracker?.highest_hand ?? 0),
      mostPlayedHand: getPokerHandVariant(hand),
      mostPlayedHandCount: Number(count ?? 0),
      highestCash: Number(tracker?.highest_cash ?? 0),
      cardsPlayedCount: Number(tracker?.cards_played_count ?? 0),
      cardsDiscardedCount: Number(tracker?.cards_discarded_count ?? 0),
      rageWins: Number(tracker?.rage_wins ?? 0),
    };
  } catch (e) {
    console.error("error getting game tracker", e);
    return DEFAULT_GAME_TRACKER;
  }
};

export const DEFAULT_TRACKER_VIEW = DEFAULT_GAME_TRACKER;
