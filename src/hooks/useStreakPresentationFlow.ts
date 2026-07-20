import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchStreakPresentation,
  fetchStreakStatus,
  type StreakPresentationClaimApiData,
  type StreakStatusApiData,
} from "../api/profile";
import { useDojo } from "../dojo/useDojo";
import { useProfileStore } from "../state/useProfileStore";
import { useStreakPresentationStore } from "../state/useStreakPresentationStore";
import {
  isStreakHidden,
  navigateToStreakIncreased,
  type StreakPresentationContinuation,
} from "../utils/streakPresentation";
import {
  resumePendingStreakPresentation,
  waitForStreakPresentationPeriod,
} from "../utils/streakPresentationWait";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

type PresentationCheckResult = {
  presentation: StreakPresentationClaimApiData | null;
  status: StreakStatusApiData | null;
};

const checksInFlight = new Map<string, Promise<PresentationCheckResult>>();

async function checkPresentation(
  address: string,
  expectedPeriodId: number | null
): Promise<PresentationCheckResult> {
  const checkKey = `${normalizeStarknetAddress(address)}:${expectedPeriodId ?? "peek"}`;
  const existing = checksInFlight.get(checkKey);
  if (existing) {
    return existing;
  }

  const check = (async () => {
    let status: StreakStatusApiData | null = null;
    const applyStatus = (nextStatus: StreakStatusApiData) => {
      status = nextStatus;
      useProfileStore.getState().applyStreakStatus(nextStatus);
    };

    if (expectedPeriodId !== null) {
      const result = await waitForStreakPresentationPeriod({
        address,
        expectedPeriodId,
        onStatus: applyStatus,
        retryOnTimeout: true,
      });

      return {
        status: result.status ?? status,
        presentation: result.presentation,
      };
    } else {
      status = await fetchStreakStatus(address).catch((error) => {
        console.warn("Streak presentation: initial status read failed", error);
        return null;
      });

      if (status) {
        applyStatus(status);
        const resumed = await resumePendingStreakPresentation({
          address,
          status,
          onStatus: applyStatus,
          retryOnTimeout: true,
        });

        if (resumed) {
          return {
            status: resumed.status ?? status,
            presentation: resumed.presentation,
          };
        }
      }
    }

    return {
      status,
      presentation: await fetchStreakPresentation(address),
    };
  })();

  checksInFlight.set(checkKey, check);
  try {
    return await check;
  } finally {
    checksInFlight.delete(checkKey);
  }
}

export function useStreakPresentationFlow() {
  const navigate = useNavigate();
  const {
    account: { account },
  } = useDojo();
  const mountedRef = useRef(true);
  const addressRef = useRef(account.address);
  addressRef.current = account.address;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const presentStreak = useCallback(
    async (options: {
      continuation?: StreakPresentationContinuation;
      from?: string;
      fromState?: Record<string, unknown> | null;
      replace?: boolean;
      replaceOnClose?: boolean;
    }): Promise<boolean> => {
      if (isStreakHidden || !account.address) {
        return false;
      }

      const address = account.address;
      const presentationStore = useStreakPresentationStore.getState();
      const expectedPeriodId =
        presentationStore.getDetectedPeriodId(address);

      try {
        const { presentation, status } = await checkPresentation(
          address,
          expectedPeriodId
        );

        if (
          !mountedRef.current ||
          normalizeStarknetAddress(addressRef.current) !==
            normalizeStarknetAddress(address)
        ) {
          return false;
        }

        if (status) {
          useProfileStore.getState().applyStreakStatus(status);
        }

        if (!presentation) {
          return false;
        }

        if (presentation.reason === "already_claimed") {
          presentationStore.clearDetectedMission(
            address,
            presentation.periodId ?? expectedPeriodId ?? undefined
          );
        }

        if (
          !presentation.show ||
          presentation.streak === null ||
          presentation.periodId === null ||
          (expectedPeriodId !== null &&
            presentation.periodId !== expectedPeriodId)
        ) {
          return false;
        }

        const started = useStreakPresentationStore
          .getState()
          .beginPresentation(address, presentation.periodId);
        if (!started) {
          return true;
        }

        const navigated = navigateToStreakIncreased(navigate, {
          streak: presentation.streak,
          periodId: presentation.periodId,
          continuation: options.continuation,
          from: options.from,
          fromState: options.fromState,
          replace: options.replace,
          replaceOnClose: options.replaceOnClose,
        });

        if (!navigated) {
          useStreakPresentationStore
            .getState()
            .finishPresentation(address, presentation.periodId);
        }

        return navigated;
      } catch (error) {
        console.warn("Streak presentation check failed", error);
        return false;
      }
    },
    [account.address, navigate]
  );

  return { presentStreak };
}
