export const STATIC_IMAGE_URLS = [
  "/mods/classic.png",
  "/mods/loot-survivor.png",
  "/broken.png",
  "/deck-icon.png",
  "/grid.png",
  "/icon.png",
  "/loader.gif",
];

// Preloading every public image via Vite globs breaks local/ngrok dev because
// Vite rewrites them as module imports from /public/*. Keep startup lean here
// and rely on explicit URLs plus on-demand fetches for the remaining assets.
export const ALL_GLOBS = {};
