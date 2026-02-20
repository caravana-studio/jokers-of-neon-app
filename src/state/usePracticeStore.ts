import { create } from "zustand";
import { LevelPokerHand, PokerHand } from "../types/LevelPokerHand";
import { Card } from "../types/Card";
import { PowerUp } from "../types/Powerup/PowerUp";
import { C10, CA, CJ, CQ, D7, H7, H8, S8 } from "../utils/mocks/cardMocks";
import { m5, p25 } from "../utils/mocks/powerUpMocks";
import { EasyFlush, MultipliedClubs } from "../utils/mocks/specialCardMocks";
import { MOCKED_PLAYS } from "../utils/mocks/tutorialMocks";

export interface PracticeScenario {
  handCards: Card[];
  specialCards: Card[];
  rageCards: Card[];
  powerUps: PowerUp[];
  plays: LevelPokerHand[];
}

interface PracticeStore {
  scenario: PracticeScenario;
  setScenario: (scenario: Partial<PracticeScenario>) => void;
  replaceScenario: (scenario: PracticeScenario) => void;
  resetScenario: () => void;
}

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

const DEFAULT_HAND: Card[] = [H8, C10, CJ, CQ, CA, D7, H7, S8];
const DEFAULT_SPECIALS: Card[] = [MultipliedClubs, EasyFlush];
const DEFAULT_POWER_UPS: PowerUp[] = [m5, p25];
const DEFAULT_PLAYS: LevelPokerHand[] = MOCKED_PLAYS.map((play) => ({
  poker_hand: play.poker_hand as PokerHand,
  level: play.level,
  multi: play.multi,
  points: play.points,
}));

const createDefaultScenario = (): PracticeScenario => ({
  handCards: DEFAULT_HAND.map(cloneCard),
  specialCards: DEFAULT_SPECIALS.map(cloneCard),
  rageCards: [],
  powerUps: DEFAULT_POWER_UPS.map(clonePowerUp),
  plays: DEFAULT_PLAYS.map(clonePlay),
});

const cloneScenario = (scenario: PracticeScenario): PracticeScenario => ({
  handCards: scenario.handCards.map(cloneCard),
  specialCards: scenario.specialCards.map(cloneCard),
  rageCards: scenario.rageCards.map(cloneCard),
  powerUps: scenario.powerUps.map(clonePowerUp),
  plays: scenario.plays.map(clonePlay),
});

export const usePracticeStore = create<PracticeStore>((set) => ({
  scenario: createDefaultScenario(),
  setScenario: (scenario) =>
    set((state) => ({
      scenario: cloneScenario({
        ...state.scenario,
        ...scenario,
      }),
    })),
  replaceScenario: (scenario) =>
    set({
      scenario: cloneScenario(scenario),
    }),
  resetScenario: () =>
    set({
      scenario: createDefaultScenario(),
    }),
}));
