import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  claimStreakPresentation,
  fetchStreakStatus,
  type StreakPresentationClaimApiData,
} from "../api/profile";
import { useDojo } from "../dojo/useDojo";
import { useProfileStore } from "../state/useProfileStore";
import { useStreakPresentationStore } from "../state/useStreakPresentationStore";
import {
  isStreakHidden,
  navigateToStreakIncreased,
} from "../utils/streakPresentation";
import {
  getConfirmedPresentationFallback,
  pollForStreakPresentation,
} from "../utils/streakPresentationPolling";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

const CLAIM_TIMEOUT_MS = 8_000;
// Home and Map do not own an in-flight game transition. Waiting for either
// route avoids racing their navigation with Rewards, Summary, or Store.
const SAFE_PRESENTATION_ROUTES = new Set(["/", "/map"]);

async function claimWithTimeout(
  address: string,
  parentSignal: AbortSignal
): Promise<StreakPresentationClaimApiData> {
  const controller = new AbortController();
  const abortFromParent = () => controller.abort();
  parentSignal.addEventListener("abort", abortFromParent, { once: true });
  const timeoutId = window.setTimeout(() => controller.abort(), CLAIM_TIMEOUT_MS);

  try {
    return await claimStreakPresentation(address, {
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
    parentSignal.removeEventListener("abort", abortFromParent);
  }
}

const getLocationState = (state: unknown): Record<string, unknown> | null =>
  state && typeof state === "object" && !Array.isArray(state)
    ? (state as Record<string, unknown>)
    : null;

export const StreakPresentationCoordinator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    account: { account },
  } = useDojo();
  const request = useStreakPresentationStore((store) => store.request);
  const pendingPresentation = useStreakPresentationStore(
    (store) => store.pendingPresentation
  );
  const accountAddress = normalizeStarknetAddress(account?.address);

  useEffect(() => {
    const currentRequest = useStreakPresentationStore.getState().request;
    if (currentRequest && currentRequest.address !== accountAddress) {
      useStreakPresentationStore.getState().reset();
    }
  }, [accountAddress]);

  useEffect(() => {
    if (
      isStreakHidden ||
      !request ||
      !accountAddress ||
      request.address !== accountAddress
    ) {
      return;
    }

    const requestId = request.id;
    const started = useStreakPresentationStore
      .getState()
      .beginPolling(requestId);
    if (!started) return;

    const controller = new AbortController();

    console.info("[streak-presentation] background polling started", {
      periodId: request.periodId,
    });

    void pollForStreakPresentation({
      signal: controller.signal,
      claim: async (signal) => {
        try {
          return await claimWithTimeout(request.address, signal);
        } catch (error) {
          if (signal.aborted) throw error;

          try {
            const status = await fetchStreakStatus(request.address);
            const fallback = getConfirmedPresentationFallback(
              status,
              request.periodId
            );
            if (fallback) return fallback;
          } catch {
            // The polling loop owns retries and error reporting.
          }

          throw error;
        }
      },
      onAttempt: (attempt) => {
        useStreakPresentationStore
          .getState()
          .recordAttempt(requestId, attempt);
      },
      onError: (error, attempt) => {
        if (attempt === 1 || attempt % 5 === 0) {
          console.warn("Streak presentation background check failed", {
            attempt,
            error,
          });
        }
      },
    }).then((presentation) => {
      if (!presentation || controller.signal.aborted) return;

      const resolved = useStreakPresentationStore
        .getState()
        .resolvePresentation(requestId, presentation);
      if (!resolved || presentation.streak === null) return;

      console.info("[streak-presentation] presentation ready", {
        periodId: presentation.periodId,
        streak: presentation.streak,
      });

      useProfileStore
        .getState()
        .applyStreakPresentation(presentation.streak);

      void fetchStreakStatus(request.address)
        .then((status) => {
          const activeRequest = useStreakPresentationStore.getState().request;
          if (activeRequest?.id !== requestId) return;

          useProfileStore
            .getState()
            .applyStreakStatus(status, presentation.streak ?? 0);
        })
        .catch((error) => {
          console.warn("Failed to refresh streak status after presentation", error);
        });
    });

    return () => controller.abort();
  }, [accountAddress, request]);

  useEffect(() => {
    if (
      !pendingPresentation ||
      pendingPresentation.address !== accountAddress ||
      !SAFE_PRESENTATION_ROUTES.has(location.pathname)
    ) {
      return;
    }

    const { presentation, periodId, address } = pendingPresentation;
    if (presentation.streak === null) return;

    const navigated = navigateToStreakIncreased(navigate, {
      streak: presentation.streak,
      reward: presentation.reward,
      continuation: {
        type: "route",
        to: `${location.pathname}${location.search}${location.hash}`,
        replace: true,
        state: getLocationState(location.state),
      },
      replace: true,
    });

    if (navigated) {
      console.info("[streak-presentation] presentation opened", {
        periodId,
        from: location.pathname,
      });
      useStreakPresentationStore
        .getState()
        .markDelivered(address, periodId);
    }
  }, [accountAddress, location, navigate, pendingPresentation]);

  return null;
};
