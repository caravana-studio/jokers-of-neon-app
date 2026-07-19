import { create } from "zustand";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

type DetectedDailyMission = {
  address: string;
  periodId: number;
  detectedAt: number;
};

type ActivePresentation = {
  address: string;
  periodId: number;
};

type StreakPresentationStore = {
  detectedMission: DetectedDailyMission | null;
  activePresentation: ActivePresentation | null;
  markDailyMissionCompleted: (address: string, periodId: number) => void;
  getDetectedPeriodId: (address: string) => number | null;
  beginPresentation: (address: string, periodId: number) => boolean;
  finishPresentation: (address: string, periodId: number) => void;
  clearDetectedMission: (address: string, periodId?: number) => void;
};

export const useStreakPresentationStore = create<StreakPresentationStore>(
  (set, get) => ({
    detectedMission: null,
    activePresentation: null,

    markDailyMissionCompleted: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      if (!normalizedAddress || !Number.isInteger(periodId) || periodId <= 0) {
        return;
      }

      set({
        detectedMission: {
          address: normalizedAddress,
          periodId,
          detectedAt: Date.now(),
        },
      });
    },

    getDetectedPeriodId: (address) => {
      const detected = get().detectedMission;
      return detected?.address === normalizeStarknetAddress(address)
        ? detected.periodId
        : null;
    },

    beginPresentation: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      const current = get().activePresentation;
      if (
        current?.address === normalizedAddress &&
        current.periodId === periodId
      ) {
        return false;
      }

      set({ activePresentation: { address: normalizedAddress, periodId } });
      return true;
    },

    finishPresentation: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      const current = get().activePresentation;
      const detected = get().detectedMission;

      set({
        activePresentation:
          current?.address === normalizedAddress && current.periodId === periodId
            ? null
            : current,
        detectedMission:
          detected?.address === normalizedAddress &&
          detected.periodId === periodId
            ? null
            : detected,
      });
    },

    clearDetectedMission: (address, periodId) => {
      const normalizedAddress = normalizeStarknetAddress(address);
      const detected = get().detectedMission;
      if (
        detected?.address !== normalizedAddress ||
        (periodId !== undefined && detected.periodId !== periodId)
      ) {
        return;
      }

      set({ detectedMission: null });
    },
  })
);
