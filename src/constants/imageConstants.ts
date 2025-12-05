export const STATIC_IMAGE_URLS = [
  "/mods/classic.png",
  "/mods/loot-survivor.png",
  "/broken.png",
  "/deck-icon.png",
  "/grid.png",
  "/icon.png",
  "/loader.gif",
];
export const ALL_GLOBS = {
  bg: import.meta.glob("/public/bg/**/*.png", { eager: true }),
  redirect: import.meta.glob("/public**/*.png", { eager: true }),
  logos: import.meta.glob("/public/logos/**/*.png", { eager: true }),
  borders: import.meta.glob("/public/borders/**/*.png", { eager: true }),
  sort: import.meta.glob("/public/sort/**/*.png", { eager: true }),
  store: import.meta.glob("/public/store/**/*.png", { eager: true }),
  specialsBox: import.meta.glob("/public/specials-box/**/*.png", {
    eager: true,
  }),
  backs: import.meta.glob("/public/Cards/Backs/**/*.png", { eager: true }),
  map: import.meta.glob("/public/map/**/*.png", { eager: true }),
  rarity: import.meta.glob("/public/rarity/**/*.png", { eager: true }),
  assets: import.meta.glob("/src/assets/**/*.png", { eager: true }),
};
