import { create } from "zustand";
import { APP_VERSION } from "../constants/version";
import {
  getUserTutorials,
  patchUserTutorials,
} from "../api/userTutorials";
import {
  PROGRESSIVE_TUTORIAL_IDS,
  PROGRESSIVE_TUTORIAL_STATE,
  ProgressiveTutorialId,
  ProgressiveTutorialState,
  getProgressiveTutorialState,
} from "../utils/progressiveTutorialStorage";
import { platform } from "../utils/capacitorUtils";

const WALLET_STATE_PREFIX = `${PROGRESSIVE_TUTORIAL_STATE}:wallet:`;
const KNOWN_TUTORIAL_IDS = new Set<string>(
  Object.values(PROGRESSIVE_TUTORIAL_IDS)
);

const normalizeWallet = (wallet: string): string => wallet.trim().toLowerCase();

const getWalletStateKey = (wallet: string): string =>
  `${WALLET_STATE_PREFIX}${normalizeWallet(wallet)}`;

const readRawStorageState = (storageKey: string): ProgressiveTutorialState => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    return Object.entries(parsed).reduce<ProgressiveTutorialState>(
      (acc, [id, value]) => {
        if (KNOWN_TUTORIAL_IDS.has(id) && value === true) {
          acc[id as ProgressiveTutorialId] = true;
        }
        return acc;
      },
      {}
    );
  } catch {
    return {};
  }
};

const writeRawStorageState = (
  storageKey: string,
  state: ProgressiveTutorialState
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

const readWalletState = (wallet: string): ProgressiveTutorialState =>
  readRawStorageState(getWalletStateKey(wallet));

const writeWalletState = (wallet: string, state: ProgressiveTutorialState): void => {
  writeRawStorageState(getWalletStateKey(wallet), state);
};

const idsToState = (ids: string[]): ProgressiveTutorialState =>
  ids.reduce<ProgressiveTutorialState>((acc, id) => {
    if (KNOWN_TUTORIAL_IDS.has(id)) {
      acc[id as ProgressiveTutorialId] = true;
    }
    return acc;
  }, {});

const stateToIds = (state: ProgressiveTutorialState): ProgressiveTutorialId[] =>
  Object.entries(state)
    .filter(([, completed]) => Boolean(completed))
    .map(([id]) => id as ProgressiveTutorialId)
    .filter((id) => KNOWN_TUTORIAL_IDS.has(id));

const mergeStates = (
  ...states: ProgressiveTutorialState[]
): ProgressiveTutorialState =>
  states.reduce<ProgressiveTutorialState>(
    (acc, current) => ({ ...acc, ...current }),
    {}
  );

type TutorialStore = {
  wallet: string | null;
  completed: ProgressiveTutorialState;
  loaded: boolean;
  loading: boolean;
  initialize: (wallet?: string | null) => Promise<void>;
  markTutorialCompleted: (
    id: ProgressiveTutorialId,
    source?: string
  ) => Promise<void>;
  isTutorialCompleted: (id: ProgressiveTutorialId) => boolean;
  reset: () => void;
};

let initializationPromise: Promise<void> | null = null;
let initializationWallet: string | null = null;

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  wallet: null,
  completed: {},
  loaded: false,
  loading: false,

  initialize: async (wallet) => {
    if (!wallet) {
      set({
        wallet: null,
        completed: getProgressiveTutorialState(),
        loaded: true,
        loading: false,
      });
      return;
    }

    const normalizedWallet = normalizeWallet(wallet);
    const currentState = get();

    if (
      currentState.loaded &&
      currentState.wallet === normalizedWallet &&
      !currentState.loading
    ) {
      return;
    }

    if (
      initializationPromise !== null &&
      initializationWallet === normalizedWallet
    ) {
      return initializationPromise;
    }

    const cachedWalletState = readWalletState(normalizedWallet);

    set({
      wallet: normalizedWallet,
      completed: mergeStates(cachedWalletState),
      loaded: false,
      loading: true,
    });

    initializationWallet = normalizedWallet;
    initializationPromise = (async () => {
      try {
        let remoteState = idsToState(await getUserTutorials(normalizedWallet));

        const cacheOnlyCompleted = stateToIds(cachedWalletState).filter(
          (id) => !remoteState[id]
        );

        if (cacheOnlyCompleted.length > 0) {
          const syncedIds = await patchUserTutorials(normalizedWallet, {
            complete_ids: cacheOnlyCompleted,
            source: "sync",
            app_version: APP_VERSION,
            platform,
          });
          remoteState = mergeStates(remoteState, idsToState(syncedIds));
        }

        const finalState = mergeStates(remoteState, cachedWalletState);

        writeWalletState(normalizedWallet, finalState);
        writeRawStorageState(PROGRESSIVE_TUTORIAL_STATE, finalState);

        set({
          wallet: normalizedWallet,
          completed: finalState,
          loaded: true,
          loading: false,
        });
      } catch (error) {
        console.warn("useTutorialStore: failed to initialize", error);

        const fallbackState = mergeStates(
          cachedWalletState,
          getProgressiveTutorialState()
        );

        writeWalletState(normalizedWallet, fallbackState);

        set({
          wallet: normalizedWallet,
          completed: fallbackState,
          loaded: true,
          loading: false,
        });
      } finally {
        initializationPromise = null;
        initializationWallet = null;
      }
    })();

    return initializationPromise;
  },

  markTutorialCompleted: async (id, source = "finish") => {
    const current = get();
    if (current.completed[id]) {
      return;
    }

    const nextCompleted: ProgressiveTutorialState = {
      ...current.completed,
      [id]: true,
    };

    if (current.wallet) {
      writeWalletState(current.wallet, nextCompleted);
    }
    writeRawStorageState(PROGRESSIVE_TUTORIAL_STATE, nextCompleted);

    set({ completed: nextCompleted });

    if (!current.wallet) {
      return;
    }

    try {
      const syncedIds = await patchUserTutorials(current.wallet, {
        complete_ids: [id],
        source,
        app_version: APP_VERSION,
        platform,
      });

      if (syncedIds.length > 0) {
        const syncedState = mergeStates(nextCompleted, idsToState(syncedIds));
        writeWalletState(current.wallet, syncedState);
        writeRawStorageState(PROGRESSIVE_TUTORIAL_STATE, syncedState);
        set({ completed: syncedState });
      }
    } catch (error) {
      console.warn("useTutorialStore: failed to sync tutorial completion", error);
    }
  },

  isTutorialCompleted: (id) => Boolean(get().completed[id]),

  reset: () => {
    set({
      wallet: null,
      completed: {},
      loaded: false,
      loading: false,
    });
  },
}));
