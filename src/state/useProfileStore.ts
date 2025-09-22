import { create } from "zustand";
import { getProfile, getPlayerStats, createProfile, getProfileLevelConfigByAddress } from "../dojo/queries/getProfile";
import type { Account, AccountInterface } from "starknet";

type ProfileStore = {
  profileData: ProfileData | null;
  loading: boolean;

  fetchProfileData: (
    client: any,
    userAddress: string,
    snAccount?: Account | AccountInterface,
    username?: string
  ) => Promise<void>;

  reset: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profileData: null,
  loading: false,

  fetchProfileData: async (client, userAddress, snAccount, username) => {
    set({ loading: true });

    try {
      let profile = await getProfile(client, userAddress);

      if (profile && profile.username === "" && snAccount && username) {
        await createProfile(client, snAccount, userAddress, username);
        profile = await getProfile(client, userAddress); 
      }

      const playerStats = await getPlayerStats(client, userAddress);

      if (!profile || !playerStats) {
        set({ profileData: null, loading: false });
        return;
      }

      const levelXp = await getProfileLevelConfigByAddress(client, userAddress);

      const profileData: ProfileData = {
        levelXp: levelXp ?? profile.currentXp,
        currentBadges: 0,
        totalBadges: 0,
        profilePicture: 1,
        profile,
        playerStats,
      };

      set({ profileData, loading: false });
    } catch (e) {
      console.log("Error fetching profile data", e);
      set({ profileData: null, loading: false });
    }
  },

  reset: () => set({ profileData: null }),
}));
