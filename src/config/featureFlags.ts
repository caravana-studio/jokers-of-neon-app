const parseBooleanEnv = (value: unknown): boolean =>
  typeof value === "string" ? value.trim().toLowerCase() === "true" : false;

export const HIDE_STREAK = parseBooleanEnv(import.meta.env.VITE_HIDE_STREAK);
