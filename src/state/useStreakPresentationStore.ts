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

let nextRequestId = 1;

const normalizePeriodId = (periodId?: number | null): number | null =>
  Number.isInteger(periodId) && Number(periodId) > 0
    ? Number(periodId)
    : null;

export const useStreakPresentationStore = create<StreakPresentationStore>(
  (set, get) => ({
    request: null,
    pendingPresentation: null,
    phase: "idle",
    attempts: 0,

    requestCheck: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      if (!normalizedAddress) return;

      const normalizedPeriodId = normalizePeriodId(periodId);
      const current = get().request;
      if (
        current?.address === normalizedAddress &&
        current.periodId === normalizedPeriodId
      ) {
        return;
      }

      set({
        request: {
          id: nextRequestId++,
          address: normalizedAddress,
          periodId: normalizedPeriodId,
          detectedAt: Date.now(),
        },
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

      set({ pendingPresentation: null, phase: "delivered" });
    },

    reset: () =>
      set({
        request: null,
        pendingPresentation: null,
        phase: "idle",
        attempts: 0,
      }),
  })
);
