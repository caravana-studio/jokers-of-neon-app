import { create } from "zustand";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../dojo/queries/getDailyMissions";
import { DailyMission } from "../types/DailyMissions";

interface RefetchMissionsParams {
  client: any;
  userAddress?: string;
  gameId?: number;
}

interface MissionsStore {
  dailyMissions: DailyMission[];
  weeklyMissions: DailyMission[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastLoadedUserAddress?: string;
  lastLoadedGameId?: number;
  pendingUserAddress?: string;
  pendingGameId?: number;
  refetch: (params: RefetchMissionsParams) => Promise<void>;
  reset: () => void;
}

const initialState = {
  dailyMissions: [],
  weeklyMissions: [],
  loading: false,
  loaded: false,
  error: null,
  lastLoadedUserAddress: undefined,
  lastLoadedGameId: undefined,
  pendingUserAddress: undefined,
  pendingGameId: undefined,
};

export const useMissionsStore = create<MissionsStore>((set, get) => ({
  ...initialState,
  refetch: async ({ client, userAddress, gameId }) => {
    if (!userAddress) {
      set(initialState);
      return;
    }

    const normalizedGameId = gameId && gameId > 0 ? gameId : 0;
    const {
      loading,
      pendingUserAddress,
      pendingGameId,
    } = get();

    if (
      loading &&
      pendingUserAddress === userAddress &&
      pendingGameId === normalizedGameId
    ) {
      return;
    }

    set({
      loading: true,
      error: null,
      pendingUserAddress: userAddress,
      pendingGameId: normalizedGameId,
    });

    try {
      const [daily, weekly] = await Promise.all([
        getDailyMissions(
          client,
          userAddress,
          normalizedGameId > 0 ? { gameId: normalizedGameId } : {},
        ),
        getWeeklyMissions(client, userAddress),
      ]);

      set({
        dailyMissions: [...daily].sort((a, b) => a.xp - b.xp),
        weeklyMissions: [...weekly].sort((a, b) => a.xp - b.xp),
        loading: false,
        loaded: true,
        error: null,
        lastLoadedUserAddress: userAddress,
        lastLoadedGameId: normalizedGameId,
        pendingUserAddress: undefined,
        pendingGameId: undefined,
      });
    } catch (error) {
      console.error("Failed to fetch missions", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        pendingUserAddress: undefined,
        pendingGameId: undefined,
      });
    }
  },
  reset: () => set(initialState),
}));
