import { create } from "zustand";
import {
  GetSeasonLineParams,
  getSeasonProgress,
} from "../api/getSeasonProgress";
import { IStep } from "../pages/SeasonProgression/types";

type SeasonProgressStore = {
  steps: IStep[];
  seasonPassUnlocked: boolean;
  playerProgress: number;
  tournamentEntries: number;
  rewardsLeftToClaim: number[];
  unclaimedRewardsCount: number;
  loading: boolean;
  error: string | null;
  lastUserAddress?: string;
  lastSeasonId?: number;
  refetch: (params: GetSeasonLineParams) => Promise<void>;
  decrementTournamentEntries: () => void;
  reset: () => void;
};

const initialState = {
  steps: [],
  seasonPassUnlocked: false,
  playerProgress: 0,
  tournamentEntries: 0,
  rewardsLeftToClaim: [],
  unclaimedRewardsCount: 0,
  loading: false,
  error: null,
  lastUserAddress: undefined,
  lastSeasonId: undefined,
};

export const useSeasonProgressStore = create<SeasonProgressStore>(
  (set, get) => ({
    ...initialState,
    refetch: async (params) => {
      const { userAddress, seasonId, forceSeasonPassUnlocked } = params;
      if (!userAddress) {
        set(initialState);
        return;
      }

      const { loading, lastUserAddress, lastSeasonId } = get();
      if (
        loading &&
        lastUserAddress === userAddress &&
        lastSeasonId === seasonId &&
        !forceSeasonPassUnlocked
      ) {
        return;
      }

      set({
        loading: true,
        error: null,
        lastUserAddress: userAddress,
        lastSeasonId: seasonId,
      });

      try {
        const data = await getSeasonProgress(params);
        set({
          ...data,
          loading: false,
          error: null,
          lastUserAddress: userAddress,
          lastSeasonId: seasonId,
        });
      } catch (error) {
        console.error("Failed to fetch season progress", error);
        set({
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    decrementTournamentEntries: () =>
      set((state) => ({
        tournamentEntries: Math.max(0, state.tournamentEntries - 1),
      })),
    reset: () => set(initialState),
  })
);
