import { create } from "zustand";
import { POWER_UP_KEYS } from "../data/powerups";
import { SPECIALS_RARITY } from "../data/specialCards";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";
import { getPowerUp } from "../dojo/queries/getPowerUps";
import { getCardFromCardId } from "../dojo/utils/getCardFromCardId";
import { Card } from "../types/Card";
import { LevelPokerHand, PokerHand } from "../types/LevelPokerHand";
import { PowerUp } from "../types/Powerup/PowerUp";
import { MOCKED_PLAYS } from "../utils/mocks/tutorialMocks";

export const PRACTICE_MAX_HAND_CARDS = 8;
export const PRACTICE_MAX_SPECIAL_CARDS = 7;
export const PRACTICE_MAX_POWER_UPS = 4;

export const PRACTICE_AVAILABLE_HAND_CARD_IDS = Object.keys(CARDS_SUIT_DATA)
  .map(Number)
  .filter((cardId) => cardId >= 0 && cardId < 300)
  .sort((a, b) => a - b);

export const PRACTICE_AVAILABLE_SPECIAL_CARD_IDS = Object.keys(SPECIALS_RARITY)
  .map(Number)
  .sort((a, b) => a - b);

export const PRACTICE_AVAILABLE_POWER_UP_IDS = [...POWER_UP_KEYS];

const DEFAULT_HAND_CARD_IDS = [32, 8, 9, 10, 12, 18, 31, 45];
const DEFAULT_SPECIAL_CARD_IDS = [10001, 10009];
const DEFAULT_POWER_UP_IDS = [805, 800];
const DEFAULT_RAGE_CARD_IDS: number[] = [];

export interface PracticeScenario {
  handCards: Card[];
  specialCards: Card[];
  rageCards: Card[];
  powerUps: PowerUp[];
  plays: LevelPokerHand[];
}

export interface PracticeSetupSelections {
  handCardIds: number[];
  specialCardIds: number[];
  powerUpIds: number[];
  rageCardIds: number[];
}

interface PracticeStore {
  scenario: PracticeScenario;
  setupSelections: PracticeSetupSelections;
  setSetupSelections: (setup: Partial<PracticeSetupSelections>) => void;
  applySetupSelections: () => void;
  setScenario: (scenario: Partial<PracticeScenario>) => void;
  replaceScenario: (scenario: PracticeScenario) => void;
  resetScenario: () => void;
}

const uniq = (values: number[]) =>
  values.filter((value, index) => values.indexOf(value) === index);

const normalizeSetupSelections = (
  setup: PracticeSetupSelections,
): PracticeSetupSelections => ({
  handCardIds: uniq(setup.handCardIds).slice(0, PRACTICE_MAX_HAND_CARDS),
  specialCardIds: uniq(setup.specialCardIds).slice(0, PRACTICE_MAX_SPECIAL_CARDS),
  powerUpIds: uniq(setup.powerUpIds).slice(0, PRACTICE_MAX_POWER_UPS),
  rageCardIds: uniq(setup.rageCardIds),
});

const cloneCard = (card: Card): Card => ({
  ...card,
  modifiers: card.modifiers?.map((modifier) => cloneCard(modifier)),
});

const clonePowerUp = (powerUp: PowerUp): PowerUp => ({
  ...powerUp,
});

const clonePlay = (play: LevelPokerHand): LevelPokerHand => ({
  ...play,
});

const cloneSetupSelections = (
  setup: PracticeSetupSelections,
): PracticeSetupSelections => ({
  handCardIds: [...setup.handCardIds],
  specialCardIds: [...setup.specialCardIds],
  powerUpIds: [...setup.powerUpIds],
  rageCardIds: [...setup.rageCardIds],
});

const DEFAULT_PLAYS: LevelPokerHand[] = MOCKED_PLAYS.map((play) => ({
  poker_hand: play.poker_hand as PokerHand,
  level: play.level,
  multi: play.multi,
  points: play.points,
}));

const DEFAULT_SETUP_SELECTIONS: PracticeSetupSelections = {
  handCardIds: DEFAULT_HAND_CARD_IDS,
  specialCardIds: DEFAULT_SPECIAL_CARD_IDS,
  powerUpIds: DEFAULT_POWER_UP_IDS,
  rageCardIds: DEFAULT_RAGE_CARD_IDS,
};

const buildHandCards = (handCardIds: number[]): Card[] => {
  return handCardIds.map((cardId, index) => ({
    ...getCardFromCardId(cardId, index),
    id: `h-${index}-${cardId}`,
    idx: index,
  }));
};

const buildSpecialCards = (specialCardIds: number[]): Card[] => {
  return specialCardIds.map((cardId) => ({
    ...getCardFromCardId(cardId, cardId),
    id: `s-${cardId}`,
    idx: cardId,
    isSpecial: true,
    selling_price: 0,
  }));
};

const buildRageCards = (rageCardIds: number[]): Card[] => {
  return rageCardIds.map((cardId) => ({
    ...getCardFromCardId(cardId, cardId),
    id: `r-${cardId}`,
    idx: cardId,
  }));
};

const buildPowerUps = (powerUpIds: number[]): PowerUp[] => {
  return powerUpIds.map((powerUpId, index) =>
    getPowerUp(powerUpId, index),
  ) as PowerUp[];
};

const createScenarioFromSetup = (
  setup: PracticeSetupSelections,
  plays: LevelPokerHand[],
): PracticeScenario => ({
  handCards: buildHandCards(setup.handCardIds),
  specialCards: buildSpecialCards(setup.specialCardIds),
  rageCards: buildRageCards(setup.rageCardIds),
  powerUps: buildPowerUps(setup.powerUpIds),
  plays: plays.map(clonePlay),
});

const cloneScenario = (scenario: PracticeScenario): PracticeScenario => ({
  handCards: scenario.handCards.map(cloneCard),
  specialCards: scenario.specialCards.map(cloneCard),
  rageCards: scenario.rageCards.map(cloneCard),
  powerUps: scenario.powerUps.map(clonePowerUp),
  plays: scenario.plays.map(clonePlay),
});

const createSetupSelectionsFromScenario = (
  scenario: PracticeScenario,
): PracticeSetupSelections =>
  normalizeSetupSelections({
    handCardIds: scenario.handCards
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number"),
    specialCardIds: scenario.specialCards
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number"),
    powerUpIds: scenario.powerUps
      .map((powerUp) => powerUp.power_up_id)
      .filter((powerUpId): powerUpId is number => typeof powerUpId === "number"),
    rageCardIds: scenario.rageCards
      .map((card) => card.card_id)
      .filter((cardId): cardId is number => typeof cardId === "number"),
  });

const createDefaultState = () => {
  const setupSelections = normalizeSetupSelections(DEFAULT_SETUP_SELECTIONS);
  const scenario = createScenarioFromSetup(setupSelections, DEFAULT_PLAYS);
  return {
    setupSelections,
    scenario,
  };
};

export const usePracticeStore = create<PracticeStore>((set) => ({
  ...createDefaultState(),
  setSetupSelections: (setup) =>
    set((state) => ({
      setupSelections: normalizeSetupSelections({
        ...state.setupSelections,
        ...setup,
      }),
    })),
  applySetupSelections: () =>
    set((state) => ({
      scenario: createScenarioFromSetup(
        state.setupSelections,
        state.scenario.plays,
      ),
    })),
  setScenario: (scenario) =>
    set((state) => {
      const nextScenario = cloneScenario({
        ...state.scenario,
        ...scenario,
      });
      return {
        scenario: nextScenario,
        setupSelections: createSetupSelectionsFromScenario(nextScenario),
      };
    }),
  replaceScenario: (scenario) =>
    set(() => {
      const nextScenario = cloneScenario(scenario);
      return {
        scenario: nextScenario,
        setupSelections: createSetupSelectionsFromScenario(nextScenario),
      };
    }),
  resetScenario: () =>
    set(() => {
      const defaultState = createDefaultState();
      return {
        scenario: cloneScenario(defaultState.scenario),
        setupSelections: cloneSetupSelections(defaultState.setupSelections),
      };
    }),
}));
