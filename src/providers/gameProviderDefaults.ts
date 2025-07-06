import { getLSGameId } from "../dojo/utils/getLSGameId";
import { IGameContext } from "./GameProvider";

export const gameProviderDefaults: IGameContext = {
  gameId: getLSGameId(),
  executeCreateGame: () => {},
  play: () => {},
  discardAnimation: false,
  playAnimation: false,
  discard: () => {},
  changeModifierCard: () =>
    new Promise((resolve) => resolve({ success: false, cards: [] })),
  clearPreSelection: () => {},
  onShopSkip: () => {},
  sellSpecialCard: () => new Promise((resolve) => resolve(false)),
  checkOrCreateGame: () => {},
  lockRedirection: false,
  playIsNeon: false,
  destroyedSpecialCardId: undefined,
  setDestroyedSpecialCardId: () => {},
  levelUpHand: undefined,
  setLevelUpHand: () => {},
  specialSwitcherOn: true,
  toggleSpecialSwitcher: () => {},
  showRages: () => {},
  showSpecials: () => {},
  resetLevel: () => {},
  cardTransformationLock: false,
  nodeRound: 0,
  prepareNewGame: () => {},
  surrenderGame: (_) => {},
};
