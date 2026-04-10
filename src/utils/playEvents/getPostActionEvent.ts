import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { PostActionEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const POST_ACTION_EVENT_KEY = getEventKey(DojoEvents.POST_ACTION);

export const getPostActionEvent = (
  events: DojoEvent[]
): PostActionEvent | undefined => {
  const postActionEvent = events.find(
    (event) => event.keys[1] === POST_ACTION_EVENT_KEY
  );

  if (!postActionEvent) return undefined;

  const game_id = getNumberValueFromEvent(postActionEvent, 2) ?? 0;
  const action_type = getNumberValueFromEvent(postActionEvent, 3) ?? 0;
  const effect_card_id = getNumberValueFromEvent(postActionEvent, 4) ?? 0;
  return {
    game_id,
    action_type,
    effect_card_id,
  };
};
