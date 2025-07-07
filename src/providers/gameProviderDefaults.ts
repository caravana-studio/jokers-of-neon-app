import { IGameContext } from "./GameProvider";

export const gameProviderDefaults: IGameContext = {
  executeCreateGame: () => {},
  play: () => {},
  discard: () => {},
  changeModifierCard: () =>
    new Promise((resolve) => resolve({ success: false, cards: [] })),
  clearPreSelection: () => {},
  onShopSkip: () => {},
  sellSpecialCard: () => new Promise((resolve) => resolve(false)),
  checkOrCreateGame: () => {},
  lockRedirection: false,
  resetLevel: () => {},
  prepareNewGame: () => {},
  surrenderGame: (_) => {},
};
