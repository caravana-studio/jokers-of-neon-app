import { create } from "zustand";
import type { Account, AccountInterface } from "starknet";
import {
  fetchProfile,
  fetchProfileLevelConfigByAddress,
  fetchProfileLevelConfigByLevel,
  fetchProfileStats,
  updateProfileAvatar,
  createProfile as createProfileApi,
} from "../api/profile";
import { registerMilestone } from "../utils/appsflyerReferral";

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


  reset: () => void;
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
      let profile = await fetchProfile(userAddress);
      const badgesCount = profile.badgesIds.length;
      const sanitizeNumber = (value: number) =>
        Number.isFinite(value) ? value : 0;
      const toInt = (value: number) => Math.trunc(sanitizeNumber(value));
      const sanitizedTotalXp = sanitizeNumber(profile.totalXp);
      const sanitizedCurrentXp = sanitizeNumber(profile.currentXp);

      if (profile.username === "" && username) {
        const fallbackAvatarId =
          toInt(profile.avatarId) > 0 ? toInt(profile.avatarId) : 1;
        await createProfileApi(userAddress, username, fallbackAvatarId);
        profile = await fetchProfile(userAddress);
      }

      const userLevel = toInt(profile.level);

      const [statsResult, levelConfigResult] =
        await Promise.all([
          fetchProfileStats(userAddress).catch((error) => {
            console.log("Error fetching profile stats", error);
            return null;
          }),
          fetchProfileLevelConfigByAddress(userAddress).catch((error) => {
            console.log("Error fetching profile level config", error);
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

      const profileData: ProfileData = {
        currentBadges: badgesCount,
        totalBadges: badgesCount,
        profile: {
          username: profile.username,
          currentXp: sanitizedCurrentXp,
          totalXp: sanitizedTotalXp,
          level: toInt(profile.level),
          streak: toInt(profile.dailyStreak),
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
        set({ profileData, loading: false, pendingAvatarId: null, previousLevel: newLevel, previousGamesCount: newGamesCount });
      } else {
        set({ profileData, loading: false, previousLevel: newLevel, previousGamesCount: newGamesCount });
      }
    } catch (e) {
      console.log("Error fetching profile data", e);
      set({ profileData: null, loading: false });
    }
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

  reset: () => set({ profileData: null, pendingAvatarId: null, previousLevel: null, previousGamesCount: null }),
}));
