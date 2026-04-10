export type PostActionKind = "play" | "discard";

const PLAY_ACTION_TYPES = new Set([0, 15]);
const DISCARD_ACTION_TYPES = new Set([1, 9]);

export const resolvePostActionKind = (
  actionType: number | undefined,
  fallback?: PostActionKind
): PostActionKind | undefined => {
  if (fallback) {
    return fallback;
  }

  if (typeof actionType === "number") {
    if (PLAY_ACTION_TYPES.has(actionType)) {
      return "play";
    }

    if (DISCARD_ACTION_TYPES.has(actionType)) {
      return "discard";
    }
  }

  return fallback;
};
