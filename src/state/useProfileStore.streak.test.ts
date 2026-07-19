import { beforeEach, describe, expect, it } from "vitest";
import type { StreakStatusApiData } from "../api/profile";
import { normalizeStarknetAddress } from "../utils/starknetAddress";
import { useProfileStore } from "./useProfileStore";
import { useStreakPresentationStore } from "./useStreakPresentationStore";

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
    completionState: "idle",
    projectedStreak: 4,
    ...overrides,
  };
}

function seedProfile() {
  useProfileStore.setState({
    profileAddress: ADDRESS,
    streakStatus: streakStatus(),
    observedPendingDailyStreak: null,
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

function pendingStatus(): StreakStatusApiData {
  return streakStatus({
    currentStreak: 5,
    effectiveStreak: 5,
    lastCompletedDay: 100,
    syncStatus: "pending",
    pendingPeriodId: 100,
    completionState: "pending",
    projectedStreak: 5,
  });
}

describe("profile streak API projection", () => {
  beforeEach(() => {
    useProfileStore.getState().reset();
    useStreakPresentationStore.setState({
      detectedMission: null,
      activePresentation: null,
    });
    seedProfile();
  });

  it("does not change the streak from the local mission event", () => {
    useStreakPresentationStore
      .getState()
      .markDailyMissionCompleted(ADDRESS, 100);

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(4);
    expect(state.profileData?.profile.streakPendingToday).toBe(false);
    expect(state.profileData?.profile.streakCompletedToday).toBe(false);
    expect(state.observedPendingDailyStreak).toBeNull();
  });

  it("shows the projection only after the API reports the current period pending", () => {
    useProfileStore.getState().applyStreakStatus(pendingStatus());

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(5);
    expect(state.profileData?.profile.streakPendingToday).toBe(true);
    expect(state.profileData?.profile.streakCompletedToday).toBe(false);
    expect(state.observedPendingDailyStreak?.periodId).toBe(100);
  });

  it("preserves an API-observed projection through a stale cache read", () => {
    useProfileStore.getState().applyStreakStatus(pendingStatus());
    useProfileStore.getState().applyStreakStatus(streakStatus());

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(5);
    expect(state.profileData?.profile.streakPendingToday).toBe(true);
    expect(state.observedPendingDailyStreak?.projectedStreak).toBe(5);
  });

  it("replaces the projection with the confirmed mainnet value", () => {
    useProfileStore.getState().applyStreakStatus(pendingStatus());
    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        currentStreak: 5,
        effectiveStreak: 5,
        longestStreak: 5,
        lastCompletedDay: 100,
        completedToday: true,
        completionState: "confirmed",
        projectedStreak: 5,
      })
    );

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(5);
    expect(state.profileData?.profile.streakPendingToday).toBe(false);
    expect(state.profileData?.profile.streakCompletedToday).toBe(true);
    expect(state.observedPendingDailyStreak).toBeNull();
  });

  it("rolls back an API-observed projection when that period fails", () => {
    useProfileStore.getState().applyStreakStatus(pendingStatus());
    useProfileStore.getState().applyStreakStatus(
      streakStatus({
        currentStreak: 5,
        effectiveStreak: 5,
        lastCompletedDay: 100,
        syncStatus: "failed",
        pendingPeriodId: 100,
        completionState: "failed",
        projectedStreak: 5,
      })
    );

    const state = useProfileStore.getState();
    expect(state.profileData?.profile.streak).toBe(4);
    expect(state.profileData?.profile.streakPendingToday).toBe(false);
    expect(state.profileData?.profile.streakCompletedToday).toBe(false);
    expect(state.observedPendingDailyStreak).toBeNull();
  });

  it("uses a Supabase pending projection after reopening the app", () => {
    useProfileStore.getState().applyStreakStatus(pendingStatus());

    const profile = useProfileStore.getState().profileData?.profile;
    expect(profile?.streak).toBe(5);
    expect(profile?.streakPendingToday).toBe(true);
    expect(profile?.streakCompletedToday).toBe(false);
  });
});
