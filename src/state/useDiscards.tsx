import { useMemo, useState } from "react";
import { useRound } from "../dojo/queries/useRound";

export const useDiscards = () => {
  const round = useRound();
  const discardsLeft = round?.discard ?? 0;
  const [optimisticDiscards, setOptimisticDiscards] = useState<
    number | undefined
  >(undefined);

  const discards = useMemo(() => {
    return optimisticDiscards ?? discardsLeft;
  }, [optimisticDiscards, discardsLeft]);

  const discard = () => {
    setOptimisticDiscards(discards - 1);
  };

  const rollbackDiscard = () => {
    setOptimisticDiscards(discards + 1);
  };

  return {
    discards,
    discard,
    rollbackDiscard,
  };
};
