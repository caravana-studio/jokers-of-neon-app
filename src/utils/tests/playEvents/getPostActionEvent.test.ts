import { expect, test } from "vitest";
import { DojoEvents } from "../../../enums/dojoEvents";
import { DojoEvent } from "../../../types/DojoEvent";
import { getEventKey } from "../../getEventKey";
import { getPostActionEvent } from "../../playEvents/getPostActionEvent";

const toHex = (value: number) => `0x${value.toString(16)}`;

const buildEvent = (eventName: string, indexedData: number[]): DojoEvent => ({
  from_address: "0x0",
  keys: ["0x0", getEventKey(eventName)],
  data: indexedData.map(toHex),
});

test("parses PostActionEvent", () => {
  const event = buildEvent(DojoEvents.POST_ACTION, [0, 0, 77, 1, 10023]);

  expect(getPostActionEvent([event])).toEqual({
    game_id: 77,
    action_type: 1,
    effect_card_id: 10023,
  });
});

test("returns undefined when PostActionEvent is missing", () => {
  const event = buildEvent(DojoEvents.ROUND_SCORE, [0, 0, 0, 10]);

  expect(getPostActionEvent([event])).toBeUndefined();
});
