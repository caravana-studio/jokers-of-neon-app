import type { UniversalDetails } from "starknet";

/**
 * Slot/Katana gameplay transactions are no-fee, so forcing tip=0 avoids
 * Starknet.js scanning recent blocks to estimate a recommended V3 tip.
 */
export function withSlotNoFeeExecuteOptions(
  details: UniversalDetails = {}
): UniversalDetails {
  return {
    ...details,
    tip: 0n,
  };
}
