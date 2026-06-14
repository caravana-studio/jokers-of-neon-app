import type { UniversalDetails } from "starknet";

export function withSlotNoFeeExecuteOptions(
  details: UniversalDetails = {}
): UniversalDetails {
  return {
    ...details,
    tip: details.tip ?? 0,
  };
}
