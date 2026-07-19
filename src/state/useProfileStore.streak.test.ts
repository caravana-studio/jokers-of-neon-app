import { beforeEach, describe, expect, it } from "vitest";
import type { StreakStatusApiData } from "../api/profile";
import { normalizeStarknetAddress } from "../utils/starknetAddress";
import { useProfileStore } from "./useProfileStore";

const ADDRESS = normalizeStarknetAddress("0x1");

function streakStatus(
  overrides: Partial<StreakStatusApiData> = {}
): StreakStatusApiData {
  return {
    player: ADDRESS,
    currentStreak: 4,
    effectiveStreak: 4,
    longestStreak: 4,
    lastCompletedDay: 99,
    protectorsAvailable: 0,
    protectorsNeeded: 0,
    daysMissed: 0,
    isProtected: false,
    isBroken: false,
    syncStatus: "confirmed",
    pendingPeriodId: null,
    source: "cache",
    updatedAt: null,
    currentPeriodId: 100,
    completedToday: false,
    ...overrides,
  };
}

function seedProfile() {
  useProfileStore.setState({
    profileAddress: ADDRESS,
    streakStatus: streakStatus(),
    optimisticDailyStreak: null,
    profileData: {
      currentBadges: 0,
      totalBadges: 0,
      profile: {
        username: "tester",
        currentXp: 0,
        totalXp: 0,
        level: 1,
        streak: 4,
        streakCompletedToday: false,
        streakPendingToday: false,
        streakProtectors: 0,
        avatarId: 1,
      },
      playerStats: { games: 0, victories: 0 },
      xpLine: { prevLevelXp: 0, nextLevelXp: 100 },
    },
  });
}

describe("profile streak optimistic projection", () => {
  beforeEach(() => {
    useProfileStore.getState().reset();
    seedProfile();
  });

  it("lights the streak and increments it immediately for a local daily mission", () => {
    useProfileStore.getState().markDailyStreakPending(ADDRESS, 100);

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(5);
    expect(state.profileData?.profile.streakPendingToday).toBe(true);
    expect(state.profileData?.profile.streakCompletedToday).toBe(false);
    expect(state.optimisticDailyStreak?.periodId).toBe(100);
  });

  it("does not increment twice for duplicate events in the same period", () => {
    useProfileStore.getState().markDailyStreakPending(ADDRESS, 100);
    useProfileStore.getState().markDailyStreakPending("0x01", 100);

    expect(useProfileStore.getState().profileData?.profile.streak).toBe(5);
  });

  it("preserves the optimistic value through stale and pending API reads", () => {
    useProfileStore.getState().markDailyStreakPending(ADDRESS, 100);
    useProfileStore.getState().applyStreakStatus(streakStatus());

    expect(useProfileStore.getState().profileData?.profile.streak).toBe(5);
    expect(
      useProfileStore.getState().profileData?.profile.streakPendingToday
    ).toBe(true);

    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        currentStreak: 5,
        effectiveStreak: 5,
        lastCompletedDay: 100,
        syncStatus: "pending",
        pendingPeriodId: 100,
      })
    );

    expect(useProfileStore.getState().profileData?.profile.streak).toBe(5);
    expect(
      useProfileStore.getState().profileData?.profile.streakPendingToday
    ).toBe(true);
  });

  it("replaces the projection with the confirmed mainnet value", () => {
    useProfileStore.getState().markDailyStreakPending(ADDRESS, 100);
    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        currentStreak: 5,
        effectiveStreak: 5,
        longestStreak: 5,
        lastCompletedDay: 100,
        syncStatus: "confirmed",
        completedToday: true,
      })
    );

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(5);
    expect(state.profileData?.profile.streakPendingToday).toBe(false);
    expect(state.profileData?.profile.streakCompletedToday).toBe(true);
    expect(state.optimisticDailyStreak).toBeNull();
  });

  it("rolls back an explicitly failed projected period", () => {
    useProfileStore.getState().markDailyStreakPending(ADDRESS, 100);
    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        syncStatus: "failed",
        pendingPeriodId: 100,
      })
    );

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(4);
    expect(state.profileData?.profile.streakPendingToday).toBe(false);
    expect(state.profileData?.profile.streakCompletedToday).toBe(false);
    expect(state.optimisticDailyStreak).toBeNull();
  });

  it("uses a Supabase pending projection after reopening the app", () => {
    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        currentStreak: 5,
        effectiveStreak: 5,
        lastCompletedDay: 100,
        syncStatus: "pending",
        pendingPeriodId: 100,
      })
    );

    const profile = useProfileStore.getState().profileData?.profile;
    expect(profile?.streak).toBe(5);
    expect(profile?.streakPendingToday).toBe(true);
    expect(profile?.streakCompletedToday).toBe(false);
  });
});
