import { create } from "zustand";
import type { Account, AccountInterface } from "starknet";
import {
  fetchOrCreateProfile,
  fetchProfileLevelConfigByAddress,
  fetchProfileLevelConfigByLevel,
  fetchProfileStats,
  fetchStreakStatus as fetchStreakStatusApi,
  updateProfileAvatar,
} from "../api/profile";
import type { StreakStatusApiData } from "../api/profile";
import { registerMilestone } from "../utils/appsflyerReferral";

type FetchStreakStatusOptions = {
  expectedPeriodId?: number;
  preserveOptimistic?: boolean;
  refresh?: boolean;
};

type OptimisticDailyStreakUpdate = {
  previousStreak: number;
  currentStreak: number;
  protectorsUsed: number;
  reset: boolean;
  extended: boolean;
};

const toInt = (value: number) =>
  Math.trunc(Number.isFinite(value) ? value : 0);

const mapStreakStatus = (status: StreakStatusApiData): StreakStatus => ({
  player: status.player,
  currentStreak: toInt(status.currentStreak),
  effectiveStreak: toInt(status.effectiveStreak),
  longestStreak: toInt(status.longestStreak),
  lastCompletedDay: toInt(status.lastCompletedDay),
  protectorsAvailable: toInt(status.protectorsAvailable),
  protectorsNeeded: toInt(status.protectorsNeeded),
  daysMissed: toInt(status.daysMissed),
  isProtected: status.isProtected,
  isBroken: status.isBroken,
  syncStatus: status.syncStatus,
  pendingPeriodId: status.pendingPeriodId,
  source: status.source,
  updatedAt: status.updatedAt,
});

export type ProfileStore = {
  profileData: ProfileData | null;
  loading: boolean;
  pendingAvatarId: number | null;
  previousLevel: number | null;
  previousGamesCount: number | null;

  fetchProfileData: (
    client: any,
    userAddress: string,
    snAccount?: Account | AccountInterface,
    username?: string,
    accountType?: "burner" | "controller" | "cavos" | null
  ) => Promise<void>;

  updateAvatar: (
    client: any,
    snAccount: Account | AccountInterface,
    address: string,
    avatarId: number
  ) => Promise<void>;

  fetchStreakStatus: (
    userAddress: string,
    options?: FetchStreakStatusOptions
  ) => Promise<void>;

  applyOptimisticDailyStreak: (
    periodId: number
  ) => OptimisticDailyStreakUpdate | null;


  reset: () => void;
  setProfileUsername: (username: string) => void;
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profileData: null,
  loading: false,
  pendingAvatarId: null,
  previousLevel: null,
  previousGamesCount: null,

  fetchProfileData: async (_client, userAddress, _snAccount, username, accountType) => {
    set({ loading: true });

    try {
      const profile = await fetchOrCreateProfile(userAddress);
      const badgesCount = profile.badgesIds.length;
      const sanitizeNumber = (value: number) =>
        Number.isFinite(value) ? value : 0;
      const sanitizedTotalXp = sanitizeNumber(profile.totalXp);
      const sanitizedCurrentXp = sanitizeNumber(profile.currentXp);

      const userLevel = toInt(profile.level);

      const [statsResult, levelConfigResult, streakStatusResult] =
        await Promise.all([
          fetchProfileStats(userAddress).catch((error) => {
            console.log("Error fetching profile stats", error);
            return null;
          }),
          fetchProfileLevelConfigByAddress(userAddress).catch((error) => {
            console.log("Error fetching profile level config", error);
            return null;
          }),
          fetchStreakStatusApi(userAddress).catch((error) => {
            console.log("Error fetching streak status", error);
            return null;
          })
        ]);

      const nextLevelXpValue =
        levelConfigResult !== null
          ? sanitizeNumber(levelConfigResult.xpRequired)
          : sanitizedTotalXp > 0
          ? sanitizedTotalXp
          : sanitizedCurrentXp;

      const prevLevelXpValue = 0;

      const pendingAvatarId = get().pendingAvatarId;
      const finalAvatarId = pendingAvatarId !== null ? pendingAvatarId : toInt(profile.avatarId);
      const streakStatus = streakStatusResult
        ? mapStreakStatus(streakStatusResult)
        : null;

      const profileData: ProfileData = {
        currentBadges: badgesCount,
        totalBadges: badgesCount,
        profile: {
          username: profile.username,
          currentXp: sanitizedCurrentXp,
          totalXp: sanitizedTotalXp,
          level: toInt(profile.level),
          streak: streakStatus?.currentStreak ?? toInt(profile.dailyStreak),
          avatarId: finalAvatarId,
        },
        playerStats: {
          games: statsResult
            ? toInt(statsResult.gamesPlayed)
            : toInt(profile.availableGames),
          victories: statsResult ? toInt(statsResult.gamesWon) : 0,
        },
        xpLine: {
          prevLevelXp: userLevel > 0 ? Math.max(0, prevLevelXpValue) : 0,
          nextLevelXp: nextLevelXpValue,
        },
        streakStatus,
      };

      // Check for level milestones
      const prevLevel = get().previousLevel;
      const newLevel = toInt(profile.level);

      // Track level milestones when crossing thresholds
      if (prevLevel !== null && newLevel !== prevLevel) {
        // Level 5 milestone
        if (prevLevel < 5 && newLevel >= 5) {
          registerMilestone(userAddress, "level_5", newLevel, accountType, username)
            .catch((e) => console.error("Error registering level_5 milestone", e));
        }
        // Level 10 milestone
        if (prevLevel < 10 && newLevel >= 10) {
          registerMilestone(userAddress, "level_10", newLevel, accountType, username)
            .catch((e) => console.error("Error registering level_10 milestone", e));
        }
      }

      // Check for games played milestones
      const prevGamesCount = get().previousGamesCount;
      const newGamesCount = profileData.playerStats.games;

      // Track games played milestones when crossing thresholds
      if (prevGamesCount !== null && newGamesCount !== prevGamesCount) {
        // Games played 5 milestone
        if (prevGamesCount < 5 && newGamesCount >= 5) {
          registerMilestone(userAddress, "games_played_5", newGamesCount, accountType, username)
            .catch((e) => console.error("Error registering games_played_5 milestone", e));
        }
        // Games played 10 milestone
        if (prevGamesCount < 10 && newGamesCount >= 10) {
          registerMilestone(userAddress, "games_played_10", newGamesCount, accountType, username)
            .catch((e) => console.error("Error registering games_played_10 milestone", e));
        }
      }

      if (pendingAvatarId !== null && toInt(profile.avatarId) === pendingAvatarId) {
        set({ profileData, loading: false, pendingAvatarId: null, previousLevel: newLevel, previousGamesCount: newGamesCount });
      } else {
        set({ profileData, loading: false, previousLevel: newLevel, previousGamesCount: newGamesCount });
      }
    } catch (e) {
      console.log("Error fetching profile data", e);
      set({ profileData: null, loading: false });
    }
  },

  fetchStreakStatus: async (userAddress, options = {}) => {
    try {
      const streakStatus = mapStreakStatus(
        await fetchStreakStatusApi(userAddress, { refresh: options.refresh })
      );
      const current = get().profileData;

      if (!current) {
        return;
      }

      const pendingPeriodId =
        current.streakSync?.pending === true
          ? current.streakSync.sourcePeriodId
          : options.expectedPeriodId;
      const shouldPreserveOptimistic =
        options.preserveOptimistic &&
        pendingPeriodId !== undefined &&
        streakStatus.lastCompletedDay < pendingPeriodId &&
        streakStatus.pendingPeriodId !== pendingPeriodId &&
        current.streakSync?.optimistic === true;

      if (shouldPreserveOptimistic) {
        return;
      }

      set({
        profileData: {
          ...current,
          profile: {
            ...current.profile,
            streak: streakStatus.currentStreak,
          },
          streakStatus,
          streakSync:
            streakStatus.syncStatus === "pending" && streakStatus.pendingPeriodId
              ? {
                  pending: true,
                  optimistic: false,
                  sourcePeriodId: streakStatus.pendingPeriodId,
                }
              : pendingPeriodId !== undefined &&
                streakStatus.lastCompletedDay < pendingPeriodId
              ? {
                  pending: true,
                  optimistic: false,
                  sourcePeriodId: pendingPeriodId,
                }
              : null,
        },
      });
    } catch (e) {
      console.log("Error fetching streak status", e);
    }
  },

  applyOptimisticDailyStreak: (periodId) => {
    if (periodId <= 0) {
      return null;
    }

    const current = get().profileData;
    const currentStatus = current?.streakStatus;
    if (!current || !currentStatus) {
      return null;
    }

    if (periodId <= currentStatus.lastCompletedDay) {
      return null;
    }

    const missedDays = Math.max(0, periodId - currentStatus.lastCompletedDay - 1);
    const protectorsUsed = Math.min(
      currentStatus.protectorsAvailable,
      missedDays
    );
    const hasEnoughProtectors = missedDays <= currentStatus.protectorsAvailable;
    const nextStreak =
      currentStatus.currentStreak <= 0
        ? 1
        : missedDays === 0 || hasEnoughProtectors
        ? currentStatus.currentStreak + 1
        : 1;
    const nextProtectors = Math.max(
      0,
      currentStatus.protectorsAvailable - protectorsUsed
    );
    const nextStatus: StreakStatus = {
      ...currentStatus,
      currentStreak: nextStreak,
      effectiveStreak: nextStreak,
      longestStreak: Math.max(currentStatus.longestStreak, nextStreak),
      lastCompletedDay: periodId,
      protectorsAvailable: nextProtectors,
      protectorsNeeded: 0,
      daysMissed: 0,
      isProtected: false,
      isBroken: false,
      syncStatus: "pending",
      pendingPeriodId: periodId,
      source: currentStatus.source,
      updatedAt: currentStatus.updatedAt,
    };

    set({
      profileData: {
        ...current,
        profile: {
          ...current.profile,
          streak: nextStreak,
        },
        streakStatus: nextStatus,
        streakSync: {
          pending: true,
          optimistic: true,
          sourcePeriodId: periodId,
        },
      },
    });

    return {
      previousStreak: currentStatus.currentStreak,
      currentStreak: nextStreak,
      protectorsUsed,
      reset: currentStatus.currentStreak > 0 && nextStreak <= 1,
      extended: nextStreak > currentStatus.currentStreak,
    };
  },

  updateAvatar: async (_client, _snAccount, address, avatarId) => {
    try {
      const normalizedAvatarId = Number.isFinite(Number(avatarId))
        ? Math.trunc(Number(avatarId))
        : avatarId;

      set({ pendingAvatarId: normalizedAvatarId });

      const current = get().profileData;
      if (current) {
        set({
          profileData: {
            ...current,
            profile: { ...current.profile, avatarId: normalizedAvatarId },
          },
        });
      }

      await updateProfileAvatar(address, avatarId);
    } catch (e) {
      console.log("Error updating avatar", e);
      set({ pendingAvatarId: null });
    }
  },

  setProfileUsername: (username) => {
    const current = get().profileData;
    if (!current) return;
    set({
      profileData: {
        ...current,
        profile: {
          ...current.profile,
          username,
        },
      },
    });
  },

  reset: () => set({ profileData: null, pendingAvatarId: null, previousLevel: null, previousGamesCount: null }),
}));
