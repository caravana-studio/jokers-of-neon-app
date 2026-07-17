import { useEffect, useRef, useState } from "react";

type ClaimLives = () => Promise<unknown>;

export const useClaimLivesOnAccountReady = (
  accountAddress: string | undefined,
  claimLives: ClaimLives
) => {
  const claimLivesRef = useRef(claimLives);
  const [claimState, setClaimState] = useState<{
    address?: string;
    isClaiming: boolean;
  }>({
    address: accountAddress,
    isClaiming: Boolean(accountAddress),
  });

  useEffect(() => {
    claimLivesRef.current = claimLives;
  }, [claimLives]);

  useEffect(() => {
    if (!accountAddress) {
      setClaimState({ isClaiming: false });
      return;
    }

    let active = true;
    setClaimState({ address: accountAddress, isClaiming: true });

    claimLivesRef
      .current()
      .catch(() => {})
      .finally(() => {
        if (active) {
          setClaimState({ address: accountAddress, isClaiming: false });
        }
      });

    return () => {
      active = false;
    };
  }, [accountAddress]);

  return Boolean(
    accountAddress &&
      (claimState.address !== accountAddress || claimState.isClaiming)
  );
};
