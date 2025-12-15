import { Plays } from "../../enums/plays";

const DEFAULT_DEBUFFED_HANDS: Plays[] = [];

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
  let normalizedHand = hand;
  while (
    normalizedHand?.variant &&
    typeof normalizedHand.variant === "object" &&
    "variant" in normalizedHand.variant
  ) {
    normalizedHand = normalizedHand.variant;
  }

  if (typeof hand === "number" || typeof hand === "bigint") {
    return Number(hand) as Plays;
  }

  if (typeof hand === "string") {
    return POKER_HAND_TO_PLAY[hand] ?? Plays.NONE;
  }

  if (normalizedHand?.variant && typeof normalizedHand.variant === "object") {
    const variantKey = Object.entries(normalizedHand.variant).find(
      ([, value]) => value !== undefined && value !== null
    )?.[0];
    if (variantKey) {
      return POKER_HAND_TO_PLAY[variantKey] ?? Plays.NONE;
    }
  }

  if (normalizedHand?.variant) {
    return POKER_HAND_TO_PLAY[normalizedHand.variant] ?? Plays.NONE;
  }

  const variantKey = Object.keys(normalizedHand ?? {}).find(
    (key) => key in POKER_HAND_TO_PLAY
  );

  return variantKey ? POKER_HAND_TO_PLAY[variantKey] : Plays.NONE;
};

const VITE_DEBUFFED_HANDS_QUERY_MAX_ATTEMPTS =
  import.meta.env.VITE_DEBUFFED_HANDS_QUERY_MAX_ATTEMPTS || "5";
const VITE_DEBUFFED_HANDS_QUERY_RETRY_DELAY_MS =
  import.meta.env.VITE_DEBUFFED_HANDS_QUERY_RETRY_DELAY_MS || "500";
const MAX_ATTEMPTS = Number(VITE_DEBUFFED_HANDS_QUERY_MAX_ATTEMPTS);
const RETRY_DELAY_MS = Number(VITE_DEBUFFED_HANDS_QUERY_RETRY_DELAY_MS);

export const getDebuffedPokerHands = async (
  client: any,
  gameId: number,
  rageId: number
): Promise<Plays[]> => {
  if (client === undefined || gameId === undefined || rageId === undefined) {
    return DEFAULT_DEBUFFED_HANDS;
  }

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const txResult: any = await client.game_views.getDebuffPokerHands(
        gameId,
        rageId
      );

      const rawHands = Array.isArray(txResult)
        ? txResult
        : Array.isArray(txResult?.poker_hands?.snapshot)
          ? txResult.poker_hands.snapshot
          : [];

      const debuffedHands = rawHands.map((hand: any) =>
        getPokerHandVariant(hand)
      );

      if (debuffedHands.length > 0 || attempt === MAX_ATTEMPTS) {
        return debuffedHands;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  } catch (e) {
    console.error("error getting debuffed poker hands", e);
  }

  return DEFAULT_DEBUFFED_HANDS;
};

export const DEFAULT_DEBUFFED_POKER_HANDS = DEFAULT_DEBUFFED_HANDS;
