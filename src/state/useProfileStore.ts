import { create } from "zustand";
import type { Account, AccountInterface } from "starknet";
import {
  fetchOrCreateProfile,
  fetchProfileLevelConfigByAddress,
  fetchProfileLevelConfigByLevel,
  fetchStreakStatus,
  type StreakStatusApiData,
  fetchProfileStats,
  updateProfileAvatar,
} from "../api/profile";
import { registerMilestone } from "../utils/appsflyerReferral";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

type OptimisticDailyStreak = {
  address: string;
  periodId: number;
  projectedStreak: number;
};

type StreakView = {
  streak: number;
  completedToday: boolean;
  pendingToday: boolean;
  optimisticDailyStreak: OptimisticDailyStreak | null;
};

function toStreakInt(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function resolveStreakView(input: {
  address: string;
  fallbackStreak: number;
  status: StreakStatusApiData | null;
  optimisticDailyStreak: OptimisticDailyStreak | null;
}): StreakView {
  const normalizedAddress = normalizeStarknetAddress(input.address);
  const status = input.status;
  const serverStreak = toStreakInt(
    status?.effectiveStreak ?? input.fallbackStreak
  );
  const serverPendingToday = Boolean(
    status &&
      status.syncStatus === "pending" &&
      status.pendingPeriodId === status.currentPeriodId &&
      !status.isBroken
  );
  const serverView: StreakView = {
    streak: serverStreak,
    completedToday: status?.completedToday ?? false,
    pendingToday: serverPendingToday,
    optimisticDailyStreak: null,
  };
  const optimistic = input.optimisticDailyStreak;

  if (!optimistic || optimistic.address !== normalizedAddress) {
    return serverView;
  }

  if (
    status &&
    (status.currentPeriodId > optimistic.periodId ||
      status.lastCompletedDay > optimistic.periodId ||
      (status.syncStatus === "failed" &&
        status.pendingPeriodId === optimistic.periodId))
  ) {
    return serverView;
  }

  if (
    status?.syncStatus === "confirmed" &&
    status.completedToday &&
    status.lastCompletedDay === optimistic.periodId
  ) {
    return serverView;
  }

  return {
    streak: Math.max(serverStreak, optimistic.projectedStreak),
    completedToday: false,
    pendingToday: true,
    optimisticDailyStreak: optimistic,
  };
}

export type ProfileStore = {
  profileData: ProfileData | null;
  profileAddress: string | null;
  streakStatus: StreakStatusApiData | null;
  optimisticDailyStreak: OptimisticDailyStreak | null;
  loading: boolean;
  pendingAvatarId: number | null;
  previousLevel: number | null;
  previousGamesCount: number | null;

  fetchProfileData: (
    client: any,
    userAddress: string,
    snAccount?: Account | AccountInterface,
    username?: string,
    accountType?: "burner" | "controller" | "cavos" | null,
    options?: {
      refreshStreakStatus?: boolean;
    }
  ) => Promise<void>;

  applyStreakStatus: (status: Awaited<ReturnType<typeof fetchStreakStatus>>) => void;
  markDailyStreakPending: (address: string, periodId: number) => void;

  updateAvatar: (
    client: any,
    snAccount: Account | AccountInterface,
    address: string,
    avatarId: number
  ) => Promise<void>;


  reset: () => void;
  setProfileUsername: (username: string) => void;
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profileData: null,
  profileAddress: null,
  streakStatus: null,
  optimisticDailyStreak: null,
  loading: false,
  pendingAvatarId: null,
  previousLevel: null,
  previousGamesCount: null,

  fetchProfileData: async (
    _client,
    userAddress,
    _snAccount,
    username,
    accountType,
    options
  ) => {
    set({ loading: true });

    try {
      const profile = await fetchOrCreateProfile(userAddress);
      const badgesCount = profile.badgesIds.length;
      const sanitizeNumber = (value: number) =>
        Number.isFinite(value) ? value : 0;
      const toInt = (value: number) => Math.trunc(sanitizeNumber(value));
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
          fetchStreakStatus(userAddress, {
            refresh: options?.refreshStreakStatus === true,
          }).catch((error) => {
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
      const effectiveDailyStreak =
        streakStatusResult !== null
          ? toInt(streakStatusResult.effectiveStreak)
          : toInt(profile.dailyStreak);
      const streakProtectors =
        streakStatusResult !== null
          ? toInt(streakStatusResult.protectorsAvailable)
          : 0;
      const normalizedAddress = normalizeStarknetAddress(userAddress);
      const streakView = resolveStreakView({
        address: normalizedAddress,
        fallbackStreak: effectiveDailyStreak,
        status: streakStatusResult,
        optimisticDailyStreak:
          get().optimisticDailyStreak?.address === normalizedAddress
            ? get().optimisticDailyStreak
            : null,
      });

      if (import.meta.env.DEV) {
        console.info("[PROFILE-DEBUG] useProfileStore streak mapping", {
          userAddress,
          profileDailyStreak: profile.dailyStreak,
          streakStatusResult,
          effectiveDailyStreak,
          streakProtectors,
        });
      }

      const profileData: ProfileData = {
        currentBadges: badgesCount,
        totalBadges: badgesCount,
        profile: {
          username: profile.username,
          currentXp: sanitizedCurrentXp,
          totalXp: sanitizedTotalXp,
          level: toInt(profile.level),
          streak: streakView.streak,
          streakCompletedToday: streakView.completedToday,
          streakPendingToday: streakView.pendingToday,
          streakProtectors,
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
        set({
          profileData,
          profileAddress: normalizedAddress,
          streakStatus: streakStatusResult,
          optimisticDailyStreak: streakView.optimisticDailyStreak,
          loading: false,
          pendingAvatarId: null,
          previousLevel: newLevel,
          previousGamesCount: newGamesCount,
        });
      } else {
        set({
          profileData,
          profileAddress: normalizedAddress,
          streakStatus: streakStatusResult,
          optimisticDailyStreak: streakView.optimisticDailyStreak,
          loading: false,
          previousLevel: newLevel,
          previousGamesCount: newGamesCount,
        });
      }
    } catch (e) {
      console.log("Error fetching profile data", e);
      set({ profileData: null, loading: false });
    }
  },

  applyStreakStatus: (status) => {
    const current = get().profileData;
    const statusAddress = normalizeStarknetAddress(status.player);
    if (
      !current ||
      (get().profileAddress && get().profileAddress !== statusAddress)
    ) {
      return;
    }

    const streakView = resolveStreakView({
      address: statusAddress,
      fallbackStreak: current.profile.streak,
      status,
      optimisticDailyStreak: get().optimisticDailyStreak,
    });

    set({
      profileAddress: statusAddress,
      streakStatus: status,
      optimisticDailyStreak: streakView.optimisticDailyStreak,
      profileData: {
        ...current,
        profile: {
          ...current.profile,
          streak: streakView.streak,
          streakCompletedToday: streakView.completedToday,
          streakPendingToday: streakView.pendingToday,
          streakProtectors: Math.max(
            0,
            Math.trunc(status.protectorsAvailable)
          ),
        },
      },
    });
  },

  markDailyStreakPending: (address, periodId) => {
    const normalizedAddress = normalizeStarknetAddress(address);
    if (!normalizedAddress || !Number.isInteger(periodId) || periodId <= 0) {
      return;
    }

    const state = get();
    const currentProjection = state.optimisticDailyStreak;
    if (
      currentProjection?.address === normalizedAddress &&
      currentProjection.periodId === periodId
    ) {
      return;
    }

    const status = state.streakStatus;
    if (
      status &&
      normalizeStarknetAddress(status.player) === normalizedAddress &&
      status.syncStatus === "confirmed" &&
      status.completedToday &&
      status.lastCompletedDay === periodId
    ) {
      return;
    }

    const currentProfile =
      state.profileAddress === null || state.profileAddress === normalizedAddress
        ? state.profileData
        : null;
    const serverAlreadyProjected = Boolean(
      status &&
        normalizeStarknetAddress(status.player) === normalizedAddress &&
        status.syncStatus === "pending" &&
        status.pendingPeriodId === periodId
    );
    const projectedStreak = serverAlreadyProjected
      ? toStreakInt(status?.effectiveStreak ?? 0)
      : toStreakInt(currentProfile?.profile.streak ?? status?.effectiveStreak ?? 0) + 1;
    const optimisticDailyStreak: OptimisticDailyStreak = {
      address: normalizedAddress,
      periodId,
      projectedStreak,
    };

    set({
      profileAddress: state.profileAddress ?? normalizedAddress,
      optimisticDailyStreak,
      profileData: currentProfile
        ? {
            ...currentProfile,
            profile: {
              ...currentProfile.profile,
              streak: projectedStreak,
              streakCompletedToday: false,
              streakPendingToday: true,
            },
          }
        : state.profileData,
    });
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

  reset: () =>
    set({
      profileData: null,
      profileAddress: null,
      streakStatus: null,
      optimisticDailyStreak: null,
      pendingAvatarId: null,
      previousLevel: null,
      previousGamesCount: null,
    }),
}));
