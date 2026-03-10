const resolveGameApiMode = (): string => {
  return String(import.meta.env.VITE_GAME_API_MODE ?? "mock")
    .trim()
    .toLowerCase();
};

export const isMockGameApiMode = resolveGameApiMode() !== "contract";
