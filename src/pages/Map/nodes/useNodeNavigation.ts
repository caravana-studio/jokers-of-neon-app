import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useMap } from "../../../providers/MapProvider";

interface NodeNavigationParams {
  nodeId: number;
  gameId: string;
  onNavigate: () => Promise<void>;
}

export const useNodeNavigation = () => {
  const { advanceNode } = useShopActions();
  const {
    setActiveNodeId,
    setNodeTransactionPending,
    setPulsingNodeId,
    fitViewToNode,
  } = useMap();

  const handleNodeNavigation = async ({
    nodeId,
    gameId,
    onNavigate,
  }: NodeNavigationParams) => {
    const nodeIdString = nodeId.toString();

    // Set node as active and start pulsing animation
    setActiveNodeId(nodeIdString);
    setNodeTransactionPending(true);
    setPulsingNodeId(nodeIdString);
    fitViewToNode(nodeIdString);

    // Clear pulsing animation after it completes
    const pulseTimeout = setTimeout(() => {
      setPulsingNodeId(null);
    }, 800);

    try {
      const response = await advanceNode(gameId, nodeId);

      if (response) {
        // Navigate after blockchain transaction completes
        await onNavigate();
      } else {
        setNodeTransactionPending(false);
        setActiveNodeId(null);
      }
    } catch (error) {
      setNodeTransactionPending(false);
      setActiveNodeId(null);
    } finally {
      clearTimeout(pulseTimeout);
    }
  };

  return { handleNodeNavigation };
};
