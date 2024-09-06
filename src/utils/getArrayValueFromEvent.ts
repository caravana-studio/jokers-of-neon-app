import { DojoEvent } from "../types/DojoEvent";

export const getArrayValueFromEvent = (
  event: DojoEvent,
  indexToGet: number
): number[] | undefined => {
  const txValue = event.data.at(indexToGet);
  console.log(txValue)
  return []
};
