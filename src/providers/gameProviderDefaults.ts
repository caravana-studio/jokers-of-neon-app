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
  sellPowerup: () => new Promise((resolve) => resolve(false)),
  checkOrCreateGame: () => {},
  resetLevel: () => {},
  prepareNewGame: () => {},
  surrenderGame: (_) => {},
  initiateTransferFlow: () => {},
};
