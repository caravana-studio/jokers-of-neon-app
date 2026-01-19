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

export type ProfileStore = {
  profileData: ProfileData | null;
  loading: boolean;
  pendingAvatarId: number | null;

  fetchProfileData: (
    client: any,
    userAddress: string,
    snAccount?: Account | AccountInterface,
    username?: string
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

  fetchProfileData: async (_client, userAddress, _snAccount, username) => {
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

      if (pendingAvatarId !== null && toInt(profile.avatarId) === pendingAvatarId) {
        set({ profileData, loading: false, pendingAvatarId: null });
      } else {
        set({ profileData, loading: false });
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

  reset: () => set({ profileData: null, pendingAvatarId: null }),
}));
