import { create } from "zustand";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { getPlayerPokerHandTracker } from "../dojo/getPlayerPokerHandTracker";
import { PokerHandTracker } from "../dojo/typescript/models.gen";
import { LevelPokerHand } from "../types/LevelPokerHand";

interface RefetchPlaysParams {
  client: any;
  userAddress?: string;
  gameId?: number;
}

interface PlaysStore {
  plays: LevelPokerHand[];
  tracker?: PokerHandTracker;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastLoadedUserAddress?: string;
  lastLoadedGameId?: number;
  pendingUserAddress?: string;
  pendingGameId?: number;
  refetch: (params: RefetchPlaysParams) => Promise<void>;
  reset: () => void;
}

const initialState = {
  plays: [],
  tracker: undefined,
  loading: false,
  loaded: false,
  error: null,
  lastLoadedUserAddress: undefined,
  lastLoadedGameId: undefined,
  pendingUserAddress: undefined,
  pendingGameId: undefined,
};

export const usePlaysStore = create<PlaysStore>((set, get) => ({
  ...initialState,
  refetch: async ({ client, userAddress, gameId }) => {
    if (!userAddress) {
      set(initialState);
      return;
    }

    const normalizedGameId = gameId && gameId > 0 ? gameId : 0;
    const { loading, pendingUserAddress, pendingGameId } = get();

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
      const [plays, tracker] = await Promise.all([
        getPlayerPokerHands(client, normalizedGameId),
        getPlayerPokerHandTracker(client, normalizedGameId),
      ]);

      set({
        plays: (plays ?? []) as LevelPokerHand[],
        tracker,
        loading: false,
        loaded: true,
        error: null,
        lastLoadedUserAddress: userAddress,
        lastLoadedGameId: normalizedGameId,
        pendingUserAddress: undefined,
        pendingGameId: undefined,
      });
    } catch (error) {
      console.error("Failed to fetch plays", error);
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
