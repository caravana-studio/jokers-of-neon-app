import { ACHIEVEMENT_PUSHES } from "../constants/localStorage";

export type CachedAchievementPush = {
  achievementId: string;
  player: string;
};

export const getCachedPushes = (): CachedAchievementPush[] => {
  const raw = localStorage.getItem(ACHIEVEMENT_PUSHES);
  return raw ? JSON.parse(raw) : [];
};

export const addCachedPush = (entry: CachedAchievementPush) => {
  const cache = getCachedPushes();
  const exists = cache.find(
    (e) => e.achievementId === entry.achievementId && e.player === entry.player
  );
  if (!exists) {
    cache.push(entry);
    localStorage.setItem(ACHIEVEMENT_PUSHES, JSON.stringify(cache));
  }
};

export const removeCachedPush = (entry: CachedAchievementPush) => {
  const cache = getCachedPushes().filter(
    (e) =>
      !(e.achievementId === entry.achievementId && e.player === entry.player)
  );
  localStorage.setItem(ACHIEVEMENT_PUSHES, JSON.stringify(cache));
};
