import { expect, test } from "vitest";
import { DojoEvents } from "../../../enums/dojoEvents";
import { DojoEvent } from "../../../types/DojoEvent";
import { getEventKey } from "../../getEventKey";
import { getForcedHandDiscardEvent } from "../../playEvents/getForcedHandDiscardEvent";

const toHex = (value: number) => `0x${value.toString(16)}`;

const buildEvent = (eventName: string, indexedData: number[]): DojoEvent => ({
  from_address: "0x0",
  keys: ["0x0", getEventKey(eventName)],
  data: indexedData.map(toHex),
});

test("parses ForcedHandDiscardEvent discarded hand indexes", () => {
  const event = buildEvent(DojoEvents.FORCED_HAND_DISCARD, [
    0, 0, 77, 3, 4, 1, 6,
  ]);

  expect(getForcedHandDiscardEvent([event])).toEqual({
    game_id: 77,
    discarded_hand_indexes: [4, 1, 6],
  });
});

test("returns undefined when ForcedHandDiscardEvent is missing", () => {
  const event = buildEvent(DojoEvents.ROUND_SCORE, [0, 0, 0, 10]);

  expect(getForcedHandDiscardEvent([event])).toBeUndefined();
});
