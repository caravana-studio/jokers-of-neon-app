import { afterEach, describe, expect, it } from "vitest";
import type { StreakStatusApiData } from "../api/profile";
import { useProfileStore } from "./useProfileStore";

const profileData: ProfileData = {
  currentBadges: 0,
  totalBadges: 0,
  profile: {
    username: "tester",
    currentXp: 0,
    totalXp: 0,
    level: 1,
    streak: 0,
    streakProtectors: 0,
    avatarId: 1,
  },
  playerStats: { games: 0, victories: 0 },
  xpLine: { prevLevelXp: 0, nextLevelXp: 10 },
};

const status: StreakStatusApiData = {
  player: "0x1",
  currentStreak: 1,
  effectiveStreak: 1,
  longestStreak: 1,
  lastCompletedDay: 20_654,
  protectorsAvailable: 2,
  protectorsNeeded: 0,
  daysMissed: 0,
  isProtected: false,
  isBroken: false,
  syncStatus: "confirmed",
  pendingPeriodId: null,
  source: "cache",
  updatedAt: null,
};

describe("profile streak updates", () => {
  afterEach(() => {
    useProfileStore.getState().reset();
  });

  it("updates the visible streak immediately and then applies status details", () => {
    useProfileStore.setState({ profileData });

    useProfileStore.getState().applyStreakPresentation(1);
    expect(useProfileStore.getState().profileData?.profile.streak).toBe(1);

    useProfileStore.getState().applyStreakStatus(status, 1);
    expect(useProfileStore.getState().profileData?.profile).toMatchObject({
      streak: 1,
      streakProtectors: 2,
    });
  });

  it("does not regress the presented streak on a stale status response", () => {
    useProfileStore.setState({ profileData });
    useProfileStore.getState().applyStreakPresentation(3);

    useProfileStore.getState().applyStreakStatus(status, 3);

    expect(useProfileStore.getState().profileData?.profile.streak).toBe(3);
  });
});
