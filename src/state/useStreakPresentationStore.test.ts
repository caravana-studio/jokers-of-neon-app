import { beforeEach, describe, expect, it } from "vitest";
import { useStreakPresentationStore } from "./useStreakPresentationStore";

describe("streak presentation store", () => {
  beforeEach(() => {
    useStreakPresentationStore.setState({
      detectedMission: null,
      activePresentation: null,
    });
  });

  it("deduplicates navigation for the same player and period", () => {
    const store = useStreakPresentationStore.getState();
    store.markDailyMissionCompleted("0x1", 100);

    expect(store.getDetectedPeriodId("0x01")).toBe(100);
    expect(store.beginPresentation("0x1", 100)).toBe(true);
    expect(
      useStreakPresentationStore.getState().beginPresentation("0x01", 100)
    ).toBe(false);

    useStreakPresentationStore.getState().finishPresentation("0x1", 100);
    expect(
      useStreakPresentationStore.getState().getDetectedPeriodId("0x1")
    ).toBeNull();
  });
});
