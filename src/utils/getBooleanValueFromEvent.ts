import { Type } from "@dojoengine/recs";
import { parseComponentValue } from "@dojoengine/utils";
import { DojoEvent } from "../types/DojoEvent";

export const getBooleanValueFromEvent = (
  event: DojoEvent,
  indexToGet: number
): boolean => {
  const txValue = event.data.at(indexToGet);
  return txValue ? (parseComponentValue(txValue, Type.Boolean) as boolean) : false;
};
