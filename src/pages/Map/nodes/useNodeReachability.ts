import { useMemo } from "react";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useMapNavigationStore } from "../../../state/useMapNavigationStore";

export const useNodeReachability = (nodeId: number) => {
  const { state } = useGameStore();
  const { reachableNodes } = useMap();
  const isNodeTransactionPending = useMapNavigationStore(
    (s) => s.isNodeTransactionPending
  );
  const activeNodeId = useMapNavigationStore((s) => s.activeNodeId);

  const nodeIdString = nodeId.toString();

  return useMemo(() => {
    const stateInMap = state === GameStateEnum.Map;
    const isActiveNode = activeNodeId === nodeIdString;
    const reachable =
      reachableNodes.includes(nodeIdString) &&
      stateInMap &&
      (!isNodeTransactionPending || isActiveNode);

    return { stateInMap, isActiveNode, reachable };
  }, [state, reachableNodes, isNodeTransactionPending, activeNodeId, nodeIdString]);
};
