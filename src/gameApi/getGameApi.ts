import { ContractGameApi } from "./contract/ContractGameApi";
import { GameApi } from "./GameApi";
import { createMockGameApi } from "./mock/MockGameApi";

export type GameApiMode = "mock" | "contract";

const resolveMode = (): GameApiMode => {
  const configuredMode = String(import.meta.env.VITE_GAME_API_MODE ?? "mock")
    .toLowerCase()
    .trim();

  return configuredMode === "contract" ? "contract" : "mock";
};

let gameApiInstance: GameApi | null = null;

export const getGameApi = (): GameApi => {
  if (gameApiInstance) {
    return gameApiInstance;
  }

  const mode = resolveMode();
  gameApiInstance = mode === "contract" ? new ContractGameApi() : createMockGameApi();

  return gameApiInstance;
};

export const resetGameApiForTests = (): void => {
  gameApiInstance = null;
};
