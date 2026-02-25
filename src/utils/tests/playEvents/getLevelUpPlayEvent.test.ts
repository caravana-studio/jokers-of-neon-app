import { expect, test } from "vitest";
import { DojoEvents } from "../../../enums/dojoEvents";
import { DojoEvent } from "../../../types/DojoEvent";
import { getEventKey } from "../../getEventKey";
import { getLevelUpPlayEvent } from "../../discardEvents/getLevelUpPlayEvent";

const toHex = (value: number) => `0x${value.toString(16)}`;

const buildEvent = (eventName: string, indexedData: number[]): DojoEvent => ({
  from_address: "0x0",
  keys: ["0x0", getEventKey(eventName)],
  data: indexedData.map(toHex),
});

test("parses PokerHandLevelUpEvent with new field order", () => {
  const event = buildEvent(DojoEvents.POKER_HAND_LEVEL_UP, [
    0, 0, 0, 10, 2, 3, 7, 11, 100, 120,
  ]);

  expect(getLevelUpPlayEvent([event])).toEqual({
    hand: 10,
    old_level: 2,
    old_points: 100,
    old_multi: 7,
    level: 3,
    points: 120,
    multi: 11,
  });
});

test("parses legacy LevelUpHandEvent with old field order", () => {
  const event = buildEvent(DojoEvents.LEVEL_UP_HAND, [
    0, 0, 0, 10, 2, 100, 7, 3, 120, 11,
  ]);

  expect(getLevelUpPlayEvent([event])).toEqual({
    hand: 10,
    old_level: 2,
    old_points: 100,
    old_multi: 7,
    level: 3,
    points: 120,
    multi: 11,
  });
});
