import { afterEach, describe, expect, it } from "vitest";
import { useStreakPresentationStore } from "./useStreakPresentationStore";

const readyPresentation = {
  show: true,
  streak: 3,
  periodId: 100,
  reward: null,
};

describe("streak presentation store", () => {
  afterEach(() => {
    useStreakPresentationStore.getState().reset();
  });

  it("deduplicates repeated mission events for the same player and period", () => {
    const store = useStreakPresentationStore.getState();
    store.requestCheck("0x1", 100);
    const firstRequest = useStreakPresentationStore.getState().request;

    useStreakPresentationStore.getState().requestCheck("0x01", 100);

    expect(useStreakPresentationStore.getState().request?.id).toBe(
      firstRequest?.id
    );
  });

  it("starts a new check when a later daily period is detected", () => {
    useStreakPresentationStore.getState().requestCheck("0x1", 100);
    const firstRequestId = useStreakPresentationStore.getState().request?.id;

    useStreakPresentationStore.getState().requestCheck("0x1", 101);

    expect(useStreakPresentationStore.getState().request?.id).not.toBe(
      firstRequestId
    );
    expect(useStreakPresentationStore.getState().request?.periodId).toBe(101);
  });

  it("ignores stale polling results and delivers the active period once", () => {
    const store = useStreakPresentationStore.getState();
    store.requestCheck("0x1", 99);
    const staleRequestId = useStreakPresentationStore.getState().request!.id;
    store.beginPolling(staleRequestId);

    store.requestCheck("0x1", 100);
    const activeRequestId = useStreakPresentationStore.getState().request!.id;
    store.beginPolling(activeRequestId);

    expect(store.resolvePresentation(staleRequestId, readyPresentation)).toBe(
      false
    );
    expect(store.resolvePresentation(activeRequestId, readyPresentation)).toBe(
      true
    );

    store.markDelivered("0x01", 100);
    expect(useStreakPresentationStore.getState().phase).toBe("delivered");
    expect(
      useStreakPresentationStore.getState().pendingPresentation
    ).toBeNull();
  });
});
