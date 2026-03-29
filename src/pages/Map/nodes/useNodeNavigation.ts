import { useShopActions } from "../../../dojo/useShopActions";
import { datadogRum } from "../../../monitoring/datadogRum";
import { useMap } from "../../../providers/MapProvider";
import { useMapNavigationStore } from "../../../state/useMapNavigationStore";

interface NodeNavigationParams {
  nodeId: number;
  gameId: number;
  onNavigate: () => Promise<void>;
}

export const useNodeNavigation = () => {
  const { advanceNode } = useShopActions();
  const { fitViewToNode } = useMap();
  const { setActiveNodeId, setNodeTransactionPending, setPulsingNodeId } =
    useMapNavigationStore();

  const logNavigationAction = (
    action: string,
    context: Record<string, string | number | boolean | null>
  ) => {
    datadogRum.addAction(`map.node_navigation.${action}`, context);
  };

  const handleNodeNavigation = async ({
    nodeId,
    gameId,
    onNavigate,
  }: NodeNavigationParams) => {
    const nodeIdString = nodeId.toString();
    logNavigationAction("start", {
      nodeId,
      gameId,
    });

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
        logNavigationAction("advance_success", {
          nodeId,
          gameId,
        });
        // Navigate after blockchain transaction completes
        await onNavigate();
        logNavigationAction("navigate_success", {
          nodeId,
          gameId,
        });
      } else {
        logNavigationAction("advance_failed", {
          nodeId,
          gameId,
        });
      }
    } catch (error) {
      logNavigationAction("error", {
        nodeId,
        gameId,
      });
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      datadogRum.addError(normalizedError, {
        nodeId,
        gameId,
      });
    } finally {
      clearTimeout(pulseTimeout);
      setPulsingNodeId(null);
      setNodeTransactionPending(false);
      setActiveNodeId(null);
      logNavigationAction("finish", {
        nodeId,
        gameId,
      });
    }
  };

  return { handleNodeNavigation };
};
