import { create } from "zustand";
import { ROGUELIKE_RUNTIME_STATE } from "../../constants/localStorage";
import { EventTypeEnum, GameStateEnum } from "../../dojo/typescript/custom";
import { getCardFromCardId } from "../../dojo/utils/getCardFromCardId";
import { Plays } from "../../enums/plays";
import { Card } from "../../types/Card";
import { LevelPokerHand, PokerHandEnum } from "../../types/LevelPokerHand";
import { CardPlayEvent, PlayEvents } from "../../types/ScoreData";
import { RoundRewards } from "../../types/RoundRewards";
import { checkHand } from "../../utils/checkHand";
import { MOCKED_PLAYS } from "../../utils/mocks/tutorialMocks";
import { buildOptimisticCardPlayEvents } from "../../utils/playEvents/buildOptimisticCardPlayEvents";
import { ActiveRun, UnlockableSystem } from "../../domain/roguelike/types";
import {
  getAvailableMockShopIds,
  getMockShopName,
} from "./mockShopRules";
import { useProgressStore } from "./useProgressStore";

const STANDARD_DECK_IDS = [
  ...Array.from({ length: 52 }, (_, index) => index),
  52,
  252,
];

const STARTING_HAND_SIZE = 8;
const RAGE_SUIT_SILENCE_CARD_IDS = [20001, 20002, 20003, 20004];

const PLAYS_DATA: LevelPokerHand[] = MOCKED_PLAYS.map((play) => ({
  poker_hand: play.poker_hand as PokerHandEnum,
  level: play.level,
  multi: play.multi,
  points: play.points,
}));

export type RoguelikeMapNodeType = "ROUND" | "STORE" | "RAGE";
type RoguelikeMapLaneType = "SHOP" | "COMBAT" | null;
const DEFAULT_MAP_LANE_COUNT = 20;

export interface RoguelikeMapOption {
  id: string;
  title: string;
  description: string;
  type: RoguelikeMapNodeType;
  shopId?: number;
  targetRound?: number;
  targetLevel?: number;
}

export interface RoguelikeMapLane {
  id: string;
  type: Exclude<RoguelikeMapLaneType, null>;
  options: RoguelikeMapOption[];
  selectedOptionId: string | null;
}

interface RoguelikeRuntimeState {
  runId: string | null;
  phase: "IDLE" | "ROUND" | "REWARDS" | "MAP" | "SHOP" | "GAME_OVER";
  round: number;
  level: number;
  targetScore: number;
  currentScore: number;
  totalScore: number;
  totalPlays: number;
  totalDiscards: number;
  remainingPlays: number;
  remainingDiscards: number;
  cash: number;
  rageCardIds: number[];
  handCardIds: number[];
  drawPileIds: number[];
  discardPileIds: number[];
  rewards: RoundRewards | null;
  mapOptions: RoguelikeMapOption[];
  mapLanes: RoguelikeMapLane[];
  currentMapLaneIndex: number;
  mapLaneType: RoguelikeMapLaneType;
  currentShopId: number | null;
  shopVisitId: number;
  lastPlay: Plays;

  reset: () => void;
  bootstrapFromRun: (run: ActiveRun) => void;
  updateCash: (cash: number) => void;
  updateFromRoundStore: (params: {
    currentScore: number;
    remainingPlays: number;
    remainingDiscards: number;
  }) => void;
  resolvePlay: (params: {
    hand: Card[];
    selectedCardIdxs: number[];
    preSelectedModifiers: { [key: number]: number[] };
    specialCards: Card[];
  }) => {
    playEvents: PlayEvents;
    rewardsCreated: boolean;
  };
  resolveDiscard: (params: {
    hand: Card[];
    selectedCardIdxs: number[];
  }) => PlayEvents;
  continueFromRewardsToMap: () => void;
  chooseMapOption: (optionId: string) => {
    nextPath: "/demo" | "/store" | null;
    nextGameState: GameStateEnum;
  };
  leaveShopToMap: () => void;
  getHandCards: () => Card[];
}

const toCard = (cardId: number, index: number): Card => ({
  ...getCardFromCardId(cardId, index),
  id: `${cardId}-${index}`,
  idx: index,
});

const toHandCards = (cardIds: number[]): Card[] => {
  return cardIds.map((cardId, index) => toCard(cardId, index));
};

const shuffle = <T>(values: T[]): T[] => {
  const arr = [...values];
  for (let index = arr.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const tmp = arr[index];
    arr[index] = arr[randomIndex];
    arr[randomIndex] = tmp;
  }
  return arr;
};

const safeRead = (): Partial<RoguelikeRuntimeState> | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(ROGUELIKE_RUNTIME_STATE);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Partial<RoguelikeRuntimeState>;
  } catch {
    return null;
  }
};

const safeWrite = (state: RoguelikeRuntimeState): void => {
  if (typeof window === "undefined") {
    return;
  }

  const {
    reset: _reset,
    bootstrapFromRun: _bootstrapFromRun,
    updateCash: _updateCash,
    updateFromRoundStore: _updateFromRoundStore,
    resolvePlay: _resolvePlay,
    resolveDiscard: _resolveDiscard,
    continueFromRewardsToMap: _continueFromRewardsToMap,
    chooseMapOption: _chooseMapOption,
    leaveShopToMap: _leaveShopToMap,
    getHandCards: _getHandCards,
    ...persistable
  } = state;

  window.localStorage.setItem(ROGUELIKE_RUNTIME_STATE, JSON.stringify(persistable));
};

const getTargetScore = (round: number, level: number): number => {
  if (round === 1 && level === 1) {
    return 100;
  }

  const roundsCleared = Math.max(0, round - 1);
  const linearGrowth = roundsCleared * 55;
  const progressiveGrowth = Math.floor((roundsCleared * (roundsCleared + 1)) / 2) * 8;
  const levelGrowth = Math.max(0, level - 1) * 70;

  return 100 + linearGrowth + progressiveGrowth + levelGrowth;
};

const ROUND_CLEAR_REWARD_TARGET_RATIO = 0.45;
const HAND_LEFT_REWARD = 80;
const DISCARD_LEFT_REWARD = 60;
const RAGE_CLEAR_REWARD = 420;
const LEVEL_CLEAR_REWARD = 280;

const hashString = (input: string): number => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const pickRageCardId = (
  runId: string,
  round: number,
  existingCount: number
): number => {
  const seed = hashString(`${runId}:rage:${round}:${existingCount}`);
  const index = seed % RAGE_SUIT_SILENCE_CARD_IDS.length;
  return RAGE_SUIT_SILENCE_CARD_IDS[index];
};

const getUnlockedSystemsFromProgress = (): UnlockableSystem[] => {
  return useProgressStore.getState().profile?.unlockedSystems ?? [];
};

const sortShopIdsBySeed = (
  ids: number[],
  runId: string,
  round: number,
  level: number
): number[] => {
  if (ids.length <= 1) {
    return ids;
  }

  const seed = hashString(`${runId}:${round}:${level}:shop-line`);
  const offset = seed % ids.length;
  return [...ids.slice(offset), ...ids.slice(0, offset)];
};

const buildShopMapOptions = (
  runId: string,
  round: number,
  level: number,
  unlockedSystems: UnlockableSystem[]
): RoguelikeMapOption[] => {
  const availableShopIds = sortShopIdsBySeed(
    getAvailableMockShopIds(unlockedSystems),
    runId,
    round,
    level
  );
  const safeShopIds = availableShopIds.length > 0 ? availableShopIds : [1];

  return safeShopIds.map((shopId) => ({
    id: `store-${shopId}`,
    title: `${getMockShopName(shopId)} Store`,
    description: "Entrá a tienda para reforzar la run.",
    type: "STORE",
    shopId,
  }));
};

const buildCombatMapOptions = (
  nextRound: number,
  nextLevel: number
): RoguelikeMapOption[] => {
  const rageAvailable = nextRound > 1 && nextRound % 3 === 0;

  if (rageAvailable) {
    return [
      {
        id: "rage",
        title: "Rage Encounter",
        description: "Nodo de alto riesgo con recompensa mejorada.",
        type: "RAGE",
        targetRound: nextRound,
        targetLevel: nextLevel,
      },
    ];
  }

  return [
    {
      id: "round",
      title: `Combat Round ${nextRound}`,
      description: `Seguí directo al round ${nextRound}.`,
      type: "ROUND",
      targetRound: nextRound,
      targetLevel: nextLevel,
    },
  ];
};

const buildMapLanes = (
  runId: string,
  startingRound: number,
  startingLevel: number,
  unlockedSystems: UnlockableSystem[],
  laneCount = DEFAULT_MAP_LANE_COUNT
): RoguelikeMapLane[] => {
  const lanes: RoguelikeMapLane[] = [];
  let projectedRound = startingRound;
  let projectedLevel = startingLevel;

  for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
    const isShopLane = laneIndex % 2 === 0;

    if (isShopLane) {
      lanes.push({
        id: `lane-${laneIndex}`,
        type: "SHOP",
        options: buildShopMapOptions(
          runId,
          projectedRound,
          projectedLevel,
          unlockedSystems
        ),
        selectedOptionId: null,
      });
      continue;
    }

    const nextRound = projectedRound + 1;
    const nextLevel = Math.max(1, Math.ceil(nextRound / 3));

    lanes.push({
      id: `lane-${laneIndex}`,
      type: "COMBAT",
      options: buildCombatMapOptions(nextRound, nextLevel),
      selectedOptionId: null,
    });

    projectedRound = nextRound;
    projectedLevel = nextLevel;
  }

  return lanes;
};

const sanitizeMapOptions = (
  mapOptions: RoguelikeMapOption[]
): { mapOptions: RoguelikeMapOption[]; mapLaneType: RoguelikeMapLaneType } => {
  if (mapOptions.length === 0) {
    return { mapOptions: [], mapLaneType: null };
  }

  const hasStore = mapOptions.some((option) => option.type === "STORE");
  const hasCombat = mapOptions.some((option) => option.type !== "STORE");

  if (!hasStore && !hasCombat) {
    return { mapOptions: [], mapLaneType: null };
  }

  if (!hasStore && hasCombat) {
    return { mapOptions, mapLaneType: "COMBAT" };
  }

  const allowedShopIds = new Set(
    getAvailableMockShopIds(getUnlockedSystemsFromProgress())
  );
  const filteredStores = mapOptions
    .filter((option) => option.type === "STORE")
    .map((option) => {
      const fallbackShopId = option.shopId ?? 1;
      const safeShopId = allowedShopIds.has(fallbackShopId) ? fallbackShopId : 1;

      return {
        id: `store-${safeShopId}`,
        title: `${getMockShopName(safeShopId)} Store`,
        description: option.description,
        type: "STORE" as const,
        shopId: safeShopId,
      };
    });

  const uniqueStores = filteredStores.filter(
    (option, index, list) =>
      list.findIndex((candidate) => candidate.shopId === option.shopId) === index
  );

  if (uniqueStores.length > 0) {
    return { mapOptions: uniqueStores, mapLaneType: "SHOP" };
  }

  return {
    mapOptions: [
      {
        id: "store-1",
        title: "Deck Store",
        description: "Entrá a tienda para reforzar la run.",
        type: "STORE",
        shopId: 1,
      },
    ],
    mapLaneType: "SHOP",
  };
};

const playToPokerHand = (play: Plays): PokerHandEnum => {
  switch (play) {
    case Plays.ROYAL_FLUSH:
      return PokerHandEnum.RoyalFlush;
    case Plays.STRAIGHT_FLUSH:
      return PokerHandEnum.StraightFlush;
    case Plays.FIVE_OF_A_KIND:
      return PokerHandEnum.FiveOfAKind;
    case Plays.FOUR_OF_A_KIND:
      return PokerHandEnum.FourOfAKind;
    case Plays.FULL_HOUSE:
      return PokerHandEnum.FullHouse;
    case Plays.STRAIGHT:
      return PokerHandEnum.Straight;
    case Plays.FLUSH:
      return PokerHandEnum.Flush;
    case Plays.THREE_OF_A_KIND:
      return PokerHandEnum.ThreeOfAKind;
    case Plays.TWO_PAIR:
      return PokerHandEnum.TwoPair;
    case Plays.PAIR:
      return PokerHandEnum.OnePair;
    case Plays.HIGH_CARD:
    default:
      return PokerHandEnum.HighCard;
  }
};

const getPlayStats = (play: Plays): { points: number; multi: number } => {
  const pokerHand = playToPokerHand(play);
  const matched = PLAYS_DATA.find((entry) => entry.poker_hand === pokerHand);

  return {
    points: Number(matched?.points ?? 5),
    multi: Number(matched?.multi ?? 1),
  };
};

const createEmptyState = () => ({
  runId: null,
  phase: "IDLE" as const,
  round: 1,
  level: 1,
  targetScore: getTargetScore(1, 1),
  currentScore: 0,
  totalScore: 0,
  totalPlays: 3,
  totalDiscards: 3,
  remainingPlays: 3,
  remainingDiscards: 3,
  cash: 10,
  rageCardIds: [],
  handCardIds: [],
  drawPileIds: [],
  discardPileIds: [],
  rewards: null,
  mapOptions: [],
  mapLanes: [],
  currentMapLaneIndex: 0,
  mapLaneType: null,
  currentShopId: null,
  shopVisitId: 0,
  lastPlay: Plays.NONE,
});

const createInitialState = () => {
  const fromStorage = safeRead();
  const initial = {
    ...createEmptyState(),
    ...fromStorage,
  };
  const unlockedSystems = getUnlockedSystemsFromProgress();
  const persistedMapLanes = Array.isArray(initial.mapLanes)
    ? initial.mapLanes
    : [];
  const persistedLaneIndex =
    typeof initial.currentMapLaneIndex === "number"
      ? initial.currentMapLaneIndex
      : 0;
  const mapLanes =
    persistedMapLanes.length > 0
      ? persistedMapLanes
      : initial.runId
        ? buildMapLanes(initial.runId, initial.round, initial.level, unlockedSystems)
        : [];
  const hasLaneForIndex =
    persistedLaneIndex >= 0 &&
    persistedLaneIndex < mapLanes.length;
  const currentMapLaneIndex = hasLaneForIndex ? persistedLaneIndex : 0;
  const fallbackMapOptions =
    mapLanes[currentMapLaneIndex]?.options ?? initial.mapOptions;
  const sanitized = sanitizeMapOptions(fallbackMapOptions);

  return {
    ...initial,
    mapLanes,
    currentMapLaneIndex,
    mapOptions: sanitized.mapOptions,
    mapLaneType: sanitized.mapLaneType,
  };
};

const drawCards = (
  drawPileIds: number[],
  discardPileIds: number[],
  amount: number
): { drawPile: number[]; discardPile: number[]; drawn: number[] } => {
  let drawPile = [...drawPileIds];
  let discardPile = [...discardPileIds];
  const drawn: number[] = [];

  while (drawn.length < amount) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) {
        break;
      }

      drawPile = shuffle(discardPile);
      discardPile = [];
    }

    const topCard = drawPile.shift();
    if (topCard === undefined) {
      break;
    }

    drawn.push(topCard);
  }

  return { drawPile, discardPile, drawn };
};

const sumCardPlayEventQuantity = (event: CardPlayEvent): number => {
  const handSum = event.hand.reduce((total, value) => total + value.quantity, 0);
  const specialsSum = event.specials.reduce((total, value) => total + value.quantity, 0);
  return handSum + specialsSum;
};

const getResolvedPlayTotals = (
  basePoints: number,
  baseMulti: number,
  cardPlayEvents: CardPlayEvent[] | undefined
): { points: number; multi: number } => {
  let points = basePoints;
  let multi = baseMulti;

  (cardPlayEvents ?? []).forEach((event) => {
    const quantity = sumCardPlayEventQuantity(event);

    if (event.eventType === EventTypeEnum.Point || event.eventType === EventTypeEnum.AcumPoint) {
      points += quantity;
      return;
    }

    if (event.eventType === EventTypeEnum.Multi || event.eventType === EventTypeEnum.AcumMulti) {
      multi += quantity;
    }
  });

  return { points, multi };
};

export const useRoguelikeRuntimeStore = create<RoguelikeRuntimeState>((set, get) => ({
  ...createInitialState(),

  reset: () => {
    set(createEmptyState());
    const state = get();
    safeWrite(state);
  },

  bootstrapFromRun: (run) => {
    const current = get();
    if (current.runId === run.runId && current.phase !== "IDLE") {
      return;
    }

    const shuffledDeck = shuffle(STANDARD_DECK_IDS);
    const openingHand = shuffledDeck.slice(0, STARTING_HAND_SIZE);
    const drawPile = shuffledDeck.slice(STARTING_HAND_SIZE);

    const level = Math.max(1, Math.ceil(run.currentRound / 3));
    const unlockedSystems = getUnlockedSystemsFromProgress();
    const mapLanes = buildMapLanes(
      run.runId,
      run.currentRound,
      level,
      unlockedSystems
    );

    set({
      runId: run.runId,
      phase: "ROUND",
      round: run.currentRound,
      level,
      targetScore: getTargetScore(run.currentRound, level),
      currentScore: 0,
      totalScore: 0,
      totalPlays: run.totalPlays,
      totalDiscards: run.totalDiscards,
      remainingPlays: run.remainingPlays,
      remainingDiscards: run.remainingDiscards,
      cash: run.gold,
      rageCardIds: [],
      handCardIds: openingHand,
      drawPileIds: drawPile,
      discardPileIds: [],
      rewards: null,
      mapOptions: [],
      mapLanes,
      currentMapLaneIndex: 0,
      mapLaneType: null,
      currentShopId: null,
      shopVisitId: 0,
      lastPlay: Plays.NONE,
    });

    safeWrite(get());
  },

  updateCash: (cash) => {
    set({ cash });
    safeWrite(get());
  },

  updateFromRoundStore: ({ currentScore, remainingPlays, remainingDiscards }) => {
    set({ currentScore, remainingPlays, remainingDiscards });
    safeWrite(get());
  },

  resolvePlay: ({ hand, selectedCardIdxs, preSelectedModifiers, specialCards }) => {
    const state = get();

    const selectedSet = new Set(selectedCardIdxs);
    const selectedCardIds = hand
      .filter((card) => selectedSet.has(card.idx))
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const remainingHandIds = hand
      .filter((card) => !selectedSet.has(card.idx))
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const drawResult = drawCards(
      state.drawPileIds,
      [...state.discardPileIds, ...selectedCardIds],
      selectedCardIdxs.length
    );

    const nextHandIds = [...remainingHandIds, ...drawResult.drawn];

    const handResult = checkHand(hand, selectedCardIdxs, specialCards, preSelectedModifiers);
    const playStats = getPlayStats(handResult.play);
    const resolvedCardPlayEvents = buildOptimisticCardPlayEvents({
      hand,
      preSelectedCards: selectedCardIdxs,
      specialCards,
      preSelectedModifiers,
    });
    const resolvedPlayTotals = getResolvedPlayTotals(
      playStats.points,
      playStats.multi,
      resolvedCardPlayEvents
    );

    const scoreDelta = resolvedPlayTotals.points * resolvedPlayTotals.multi;
    const nextScore = state.currentScore + scoreDelta;
    const nextTotalScore = state.totalScore + scoreDelta;
    const remainingPlays = Math.max(0, state.remainingPlays - 1);

    const didBeatRound = nextScore >= state.targetScore;
    const didLoseRound = !didBeatRound && remainingPlays <= 0;
    const unlockedSystems = getUnlockedSystemsFromProgress();
    const mapLanes =
      state.mapLanes.length > 0
        ? state.mapLanes
        : buildMapLanes(
            state.runId ?? "run",
            state.round,
            state.level,
            unlockedSystems
          );
    const activeLane =
      mapLanes[state.currentMapLaneIndex] ??
      mapLanes[0] ??
      null;

    let rewards: RoundRewards | null = null;

    if (didBeatRound) {
      const roundDefeat = Math.floor(state.targetScore * ROUND_CLEAR_REWARD_TARGET_RATIO);
      const handsLeftCash = remainingPlays * HAND_LEFT_REWARD;
      const discardLeftCash = state.remainingDiscards * DISCARD_LEFT_REWARD;
      const rageDefeatedCash = state.round % 3 === 0 ? RAGE_CLEAR_REWARD : 0;
      const levelPassed = state.round % 3 === 0 ? state.level : 0;
      const levelBonus = levelPassed > 0 ? LEVEL_CLEAR_REWARD : 0;
      const total =
        roundDefeat + handsLeftCash + discardLeftCash + rageDefeatedCash + levelBonus;

      rewards = {
        roundNumber: state.round,
        round_defeat: roundDefeat,
        level_bonus: levelBonus,
        hands_left: remainingPlays,
        hands_left_cash: handsLeftCash,
        discard_left: state.remainingDiscards,
        discard_left_cash: discardLeftCash,
        rage_card_defeated: rageDefeatedCash > 0 ? 1 : 0,
        rage_card_defeated_cash: rageDefeatedCash,
        rerolls: 1,
        rewards_special_card: 0,
        total,
        level_passed: levelPassed,
      };
    }

    const playEvents: PlayEvents = {
      play: {
        points: resolvedPlayTotals.points,
        multi: resolvedPlayTotals.multi,
      },
      gameOver: didLoseRound,
      cards: toHandCards(nextHandIds),
      score: nextScore,
      cardPlayEvents: resolvedCardPlayEvents,
      levelPassed: didBeatRound
        ? {
            level: state.level,
            player_score: nextTotalScore,
            round: state.round,
            level_passed: rewards?.level_passed ?? 0,
          }
        : undefined,
      detailEarned: didBeatRound
        ? {
            round_defeat: rewards?.round_defeat ?? 0,
            level_bonus: rewards?.level_bonus ?? 0,
            hands_left: rewards?.hands_left ?? 0,
            hands_left_cash: rewards?.hands_left_cash ?? 0,
            discard_left: rewards?.discard_left ?? 0,
            discard_left_cash: rewards?.discard_left_cash ?? 0,
            rage_card_defeated: rewards?.rage_card_defeated ?? 0,
            rage_card_defeated_cash: rewards?.rage_card_defeated_cash ?? 0,
            rerolls: rewards?.rerolls ?? 0,
            rewards_special_card: rewards?.rewards_special_card ?? 0,
            total: rewards?.total ?? 0,
          }
        : undefined,
    };

    set({
      currentScore: nextScore,
      totalScore: nextTotalScore,
      remainingPlays,
      handCardIds: nextHandIds,
      drawPileIds: drawResult.drawPile,
      discardPileIds: drawResult.discardPile,
      phase: didBeatRound ? "REWARDS" : didLoseRound ? "GAME_OVER" : "ROUND",
      rewards,
      mapOptions: didBeatRound ? activeLane?.options ?? [] : state.mapOptions,
      mapLanes,
      mapLaneType: didBeatRound ? activeLane?.type ?? null : state.mapLaneType,
      currentShopId: didBeatRound ? null : state.currentShopId,
      lastPlay: handResult.play,
    });

    safeWrite(get());

    return {
      playEvents,
      rewardsCreated: didBeatRound,
    };
  },

  resolveDiscard: ({ hand, selectedCardIdxs }) => {
    const state = get();
    const selectedSet = new Set(selectedCardIdxs);

    const selectedCardIds = hand
      .filter((card) => selectedSet.has(card.idx))
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const remainingHandIds = hand
      .filter((card) => !selectedSet.has(card.idx))
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number");

    const drawResult = drawCards(
      state.drawPileIds,
      [...state.discardPileIds, ...selectedCardIds],
      selectedCardIdxs.length
    );

    const nextHandIds = [...remainingHandIds, ...drawResult.drawn];
    const remainingDiscards = Math.max(0, state.remainingDiscards - 1);

    set({
      remainingDiscards,
      handCardIds: nextHandIds,
      drawPileIds: drawResult.drawPile,
      discardPileIds: drawResult.discardPile,
      phase: "ROUND",
    });

    safeWrite(get());

    return {
      play: {},
      gameOver: false,
      cards: toHandCards(nextHandIds),
      score: state.currentScore,
    };
  },

  continueFromRewardsToMap: () => {
    if (get().phase !== "REWARDS") {
      return;
    }

    set({ phase: "MAP" });
    safeWrite(get());
  },

  chooseMapOption: (optionId) => {
    const state = get();
    const option = state.mapOptions.find((item) => item.id === optionId);

    if (!option) {
      return {
        nextPath: null,
        nextGameState: GameStateEnum.Map,
      };
    }

    const nextMapLanes = state.mapLanes.map((lane, index) => {
      if (index !== state.currentMapLaneIndex) {
        return lane;
      }

      return {
        ...lane,
        selectedOptionId: option.id,
      };
    });
    const nextLaneIndex = Math.min(
      state.currentMapLaneIndex + 1,
      Math.max(0, nextMapLanes.length - 1)
    );
    const nextLane = nextMapLanes[nextLaneIndex];

    if (option.type === "STORE") {
      set({
        phase: "SHOP",
        currentShopId: option.shopId ?? 1,
        shopVisitId: state.shopVisitId + 1,
        mapLanes: nextMapLanes,
        currentMapLaneIndex: nextLaneIndex,
        mapOptions: nextLane?.options ?? [],
        mapLaneType: nextLane?.type ?? "COMBAT",
      });
      safeWrite(get());
      return {
        nextPath: "/store" as const,
        nextGameState: GameStateEnum.Store,
      };
    }

    const nextRound = option.targetRound ?? state.round + 1;
    const nextLevel =
      option.targetLevel ?? Math.max(1, Math.ceil(nextRound / 3));
    const nextRageCardIds =
      option.type === "RAGE"
        ? [
            ...state.rageCardIds,
            pickRageCardId(
              state.runId ?? "run",
              nextRound,
              state.rageCardIds.length
            ),
          ]
        : state.rageCardIds;

    set({
      phase: "ROUND",
      round: nextRound,
      level: nextLevel,
      targetScore: getTargetScore(nextRound, nextLevel),
      currentScore: 0,
      remainingPlays: state.totalPlays,
      remainingDiscards: state.totalDiscards,
      rageCardIds: nextRageCardIds,
      rewards: null,
      mapLanes: nextMapLanes,
      currentMapLaneIndex: nextLaneIndex,
      mapOptions: [],
      mapLaneType: null,
      currentShopId: null,
    });

    safeWrite(get());

    return {
      nextPath: "/demo" as const,
      nextGameState:
        option.type === "RAGE" ? GameStateEnum.Rage : GameStateEnum.Round,
    };
  },

  leaveShopToMap: () => {
    set({ phase: "MAP", currentShopId: null });
    safeWrite(get());
  },

  getHandCards: () => {
    const { handCardIds } = get();
    return toHandCards(handCardIds);
  },
}));

export const ROGUELIKE_DEFAULT_PLAYS = PLAYS_DATA;
