import { useEffect, useRef } from "react";

type ClaimLives = () => Promise<unknown>;

export const useClaimLivesOnAccountReady = (
  accountAddress: string | undefined,
  claimLives: ClaimLives
) => {
  const claimLivesRef = useRef(claimLives);

  useEffect(() => {
    claimLivesRef.current = claimLives;
  }, [claimLives]);

  useEffect(() => {
    if (!accountAddress) {
      return;
    }

    claimLivesRef.current().catch(() => {});
  }, [accountAddress]);
};
