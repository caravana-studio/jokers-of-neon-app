import { describe, expect, it } from "vitest";
import { getMiniAppWeeklyLeaderboardPeriod } from "./getMiniAppWeeklyLeaderboardPeriod";

describe("getMiniAppWeeklyLeaderboardPeriod", () => {
  const defaultResetAt = new Date("2026-04-13T06:00:00.000Z");
  const defaultPeriod = {
    startDate: "2026-04-06",
    endDate: "2026-04-12",
    currentDate: "2026-04-09",
    resetAt: defaultResetAt,
  };

  it("keeps the default weekly period when the tournament is inactive", () => {
    expect(
      getMiniAppWeeklyLeaderboardPeriod(defaultPeriod, {
        isActive: false,
        startDate: new Date("2026-04-03T00:00:00.000Z"),
        finishDate: new Date("2026-04-12T23:59:59.999Z"),
      })
    ).toEqual(defaultPeriod);
  });

  it("overrides both query dates and clock when external dates are provided", () => {
    const finishDate = new Date("2026-04-12T23:59:59.999Z");

    expect(
      getMiniAppWeeklyLeaderboardPeriod(defaultPeriod, {
        isActive: true,
        startDate: new Date("2026-04-03T00:00:00.000Z"),
        finishDate,
      })
    ).toEqual({
      ...defaultPeriod,
      startDate: "2026-04-03",
      endDate: "2026-04-12",
      resetAt: finishDate,
    });
  });

  it("supports partial overrides when only one external date is provided", () => {
    expect(
      getMiniAppWeeklyLeaderboardPeriod(defaultPeriod, {
        isActive: true,
        startDate: new Date("2026-04-03T00:00:00.000Z"),
        finishDate: null,
      })
    ).toEqual({
      ...defaultPeriod,
      startDate: "2026-04-03",
    });

    const finishDate = new Date("2026-04-10T23:59:59.999Z");

    expect(
      getMiniAppWeeklyLeaderboardPeriod(defaultPeriod, {
        isActive: true,
        startDate: null,
        finishDate,
      })
    ).toEqual({
      ...defaultPeriod,
      endDate: "2026-04-10",
      resetAt: finishDate,
    });
  });
});
