import { shortString } from "starknet";
import { describe, expect, it } from "vitest";
import { MISSION_PERIOD } from "../../../data/dailyMissions";
import { DojoEvents } from "../../../enums/dojoEvents";
import type { DojoEvent } from "../../../types/DojoEvent";
import { getEventKey } from "../../getEventKey";
import { getDailyMissionCompleteEvent } from "../../playEvents/getDailyMissionCompleteEvent";

const PLAYER =
  "0x06198d0d1cc89b1e11e3650cbe7ace2000000000000000000000000029827";

const toHex = (value: number) => `0x${value.toString(16)}`;

const missionValues = () => [
  PLAYER,
  toHex(MISSION_PERIOD.DAILY),
  toHex(20_654),
  shortString.encodeShortString("daily-play-hand"),
  shortString.encodeShortString("daily-play-hand"),
  toHex(1),
  toHex(1),
  toHex(1),
  toHex(10),
  toHex(15_057),
];

const buildEvent = (data: string[]): DojoEvent => ({
  from_address: "0x0",
  keys: ["0x0", getEventKey(DojoEvents.DAILY_MISSION_COMPLETE)],
  data,
});

describe("getDailyMissionCompleteEvent", () => {
  it("parses the period id from a Dojo transaction receipt", () => {
    const event = buildEvent(["0x0", "0x0", ...missionValues()]);

    expect(getDailyMissionCompleteEvent([event])).toEqual([
      {
        player: PLAYER,
        dailyMissionId: "daily-play-hand",
        missionId: "daily-play-hand",
        templateId: "daily-play-hand",
        periodType: "daily",
        periodId: 20_654,
        difficulty: 1,
        target: 1,
        progress: 1,
        base_xp: 10,
        gameId: 15_057,
      },
    ]);
  });

  it("parses the same event without the Dojo receipt prefix", () => {
    const event = buildEvent(missionValues());

    expect(getDailyMissionCompleteEvent([event])?.[0]).toMatchObject({
      player: PLAYER,
      periodType: "daily",
      periodId: 20_654,
      base_xp: 10,
    });
  });

  it("rejects a shifted layout instead of treating period type as period id", () => {
    const event = buildEvent([
      "0x0",
      PLAYER,
      toHex(MISSION_PERIOD.DAILY),
      toHex(20_654),
      "0x0",
      shortString.encodeShortString("daily-play-hand"),
      shortString.encodeShortString("daily-play-hand"),
      toHex(1),
      toHex(1),
      toHex(1),
      toHex(10),
      toHex(15_057),
    ]);

    expect(getDailyMissionCompleteEvent([event])).toEqual([]);
  });
});
