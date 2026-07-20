import { create } from "zustand";
import type { StreakPresentationClaimApiData } from "../api/profile";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

export type StreakPresentationRequest = {
  id: number;
  address: string;
  periodId: number | null;
  detectedAt: number;
};

export type PendingStreakPresentation = {
  address: string;
  periodId: number;
  presentation: StreakPresentationClaimApiData;
};

type StreakPresentationPhase = "idle" | "polling" | "ready" | "delivered";

type StreakPresentationStore = {
  request: StreakPresentationRequest | null;
  pendingPresentation: PendingStreakPresentation | null;
  phase: StreakPresentationPhase;
  attempts: number;
  requestCheck: (address: string, periodId?: number | null) => void;
  beginPolling: (requestId: number) => boolean;
  recordAttempt: (requestId: number, attempt: number) => void;
  resolvePresentation: (
    requestId: number,
    presentation: StreakPresentationClaimApiData
  ) => boolean;
  markDelivered: (address: string, periodId: number) => void;
  reset: () => void;
};

const PENDING_REQUEST_STORAGE_KEY = "streak-presentation:pending";
const DELIVERED_STORAGE_KEY_PREFIX = "streak-presentation:delivered";
let nextRequestId = 1;

const normalizePeriodId = (periodId?: number | null): number | null =>
  Number.isInteger(periodId) && Number(periodId) > 0
    ? Number(periodId)
    : null;

const getSessionStorage = (): Storage | null => {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
};

const getDeliveredStorageKey = (address: string, periodId: number): string =>
  `${DELIVERED_STORAGE_KEY_PREFIX}:${address}:${periodId}`;

const wasDeliveredInSession = (address: string, periodId: number): boolean =>
  getSessionStorage()?.getItem(getDeliveredStorageKey(address, periodId)) ===
  "1";

const persistPendingRequest = (request: StreakPresentationRequest): void => {
  const storage = getSessionStorage();
  if (!storage || request.periodId === null) return;

  try {
    storage.setItem(
      PENDING_REQUEST_STORAGE_KEY,
      JSON.stringify({
        address: request.address,
        periodId: request.periodId,
        detectedAt: request.detectedAt,
      })
    );
  } catch {
    // Presentation recovery is best-effort when storage is unavailable.
  }
};

const clearPendingRequest = (): void => {
  try {
    getSessionStorage()?.removeItem(PENDING_REQUEST_STORAGE_KEY);
  } catch {
    // Presentation recovery is best-effort when storage is unavailable.
  }
};

const restorePendingRequest = (): StreakPresentationRequest | null => {
  try {
    const serialized = getSessionStorage()?.getItem(
      PENDING_REQUEST_STORAGE_KEY
    );
    if (!serialized) return null;

    const value = JSON.parse(serialized) as Record<string, unknown>;
    const address = normalizeStarknetAddress(
      typeof value.address === "string" ? value.address : undefined
    );
    const periodId = normalizePeriodId(Number(value.periodId));
    const detectedAt = Number(value.detectedAt);
    if (!address || periodId === null) {
      clearPendingRequest();
      return null;
    }

    return {
      id: nextRequestId++,
      address,
      periodId,
      detectedAt: Number.isFinite(detectedAt) ? detectedAt : Date.now(),
    };
  } catch {
    clearPendingRequest();
    return null;
  }
};

const restoredRequest = restorePendingRequest();

export const useStreakPresentationStore = create<StreakPresentationStore>(
  (set, get) => ({
    request: restoredRequest,
    pendingPresentation: null,
    phase: "idle",
    attempts: 0,

    requestCheck: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      if (!normalizedAddress) return;

      const normalizedPeriodId = normalizePeriodId(periodId);
      if (
        normalizedPeriodId !== null &&
        wasDeliveredInSession(normalizedAddress, normalizedPeriodId)
      ) {
        return;
      }

      const current = get().request;
      if (
        current?.address === normalizedAddress &&
        current.periodId === normalizedPeriodId
      ) {
        return;
      }

      const nextRequest: StreakPresentationRequest = {
        id: nextRequestId++,
        address: normalizedAddress,
        periodId: normalizedPeriodId,
        detectedAt: Date.now(),
      };
      persistPendingRequest(nextRequest);

      set({
        request: nextRequest,
        pendingPresentation: null,
        phase: "idle",
        attempts: 0,
      });
    },

    beginPolling: (requestId) => {
      const current = get();
      if (
        current.request?.id !== requestId ||
        (current.phase !== "idle" && current.phase !== "polling")
      ) {
        return false;
      }

      set({ phase: "polling" });
      return true;
    },

    recordAttempt: (requestId, attempt) => {
      if (get().request?.id !== requestId || get().phase !== "polling") {
        return;
      }
      set({ attempts: attempt });
    },

    resolvePresentation: (requestId, presentation) => {
      const current = get();
      const periodId = normalizePeriodId(presentation.periodId);
      if (
        current.request?.id !== requestId ||
        current.phase !== "polling" ||
        !presentation.show ||
        presentation.streak === null ||
        periodId === null ||
        (current.request.periodId !== null &&
          current.request.periodId !== periodId)
      ) {
        return false;
      }

      set({
        pendingPresentation: {
          address: current.request.address,
          periodId,
          presentation,
        },
        phase: "ready",
      });
      return true;
    },

    markDelivered: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      const pending = get().pendingPresentation;
      if (
        pending?.address !== normalizedAddress ||
        pending.periodId !== periodId
      ) {
        return;
      }

      try {
        getSessionStorage()?.setItem(
          getDeliveredStorageKey(normalizedAddress, periodId),
          "1"
        );
      } catch {
        // Presentation delivery remains valid when storage is unavailable.
      }
      clearPendingRequest();
      set({ pendingPresentation: null, phase: "delivered" });
    },

    reset: () => {
      clearPendingRequest();
      set({
        request: null,
        pendingPresentation: null,
        phase: "idle",
        attempts: 0,
      });
    },
  })
);
