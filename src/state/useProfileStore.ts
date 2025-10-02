import { create } from "zustand";
import { getProfile, getPlayerStats, createProfile, getProfileLevelConfigByAddress } from "../dojo/queries/getProfile";
import type { Account, AccountInterface } from "starknet";

export type ProfileStore = {
  profileData: ProfileData | null;
  loading: boolean;
  

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

  fetchProfileData: async (client, userAddress, snAccount, username) => {
    set({ loading: true });

    try {
      let profile = await getProfile(client, userAddress);

      if (profile && profile.username === "" && snAccount && username) {
        await createProfile(client, snAccount, userAddress, username, 1);
        profile = await getProfile(client, userAddress); 
      }

      const playerStats = await getPlayerStats(client, userAddress);
      const levelXp = await getProfileLevelConfigByAddress(client, userAddress);

      if (!profile || !playerStats) {
        set({ profileData: null, loading: false });
        return;
      }

      const profileData: ProfileData = {
        levelXp: levelXp ?? profile.currentXp,
        currentBadges: 0,
        totalBadges: 0,
        profile,
        playerStats,
      };

      set({ profileData, loading: false });
    } catch (e) {
      console.log("Error fetching profile data", e);
      set({ profileData: null, loading: false });
    }
  },

  updateAvatar: async (client, snAccount, address, avatarId) => {
    try {
      await client.profile_system.updateAvatar(snAccount, address, avatarId);

      const current = get().profileData;
      if (current) {
        set({
          profileData: {
            ...current,
            profile: { ...current.profile, avatarId },
          },
        });
      }
    } catch (e) {
      console.log("Error updating avatar", e);
    }
  },

  reset: () => set({ profileData: null }),
}));
