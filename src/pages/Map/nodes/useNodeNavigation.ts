import { isMockGameApiMode } from "../../../config/gameMode";
import { useShopActions } from "../../../dojo/useShopActions";
import { useMap } from "../../../providers/MapProvider";
import { useRoguelikeRuntimeStore } from "../../../state/roguelike/useRoguelikeRuntimeStore";
import { useRunStore } from "../../../state/roguelike/useRunStore";
import { useMapNavigationStore } from "../../../state/useMapNavigationStore";

interface NodeNavigationParams {
  nodeId: number;
  gameId: number;
  onNavigate: () => Promise<void>;
  optionId?: string;
  shopId?: number;
}

export const useNodeNavigation = () => {
  const { advanceNode } = useShopActions();
  const { fitViewToNode, nodes } = useMap();
  const chooseMapOption = useRoguelikeRuntimeStore((state) => state.chooseMapOption);
  const advanceRound = useRunStore((state) => state.advanceRound);
  const { setActiveNodeId, setNodeTransactionPending, setPulsingNodeId } =
    useMapNavigationStore();

  const handleNodeNavigation = async ({
    nodeId,
    gameId,
    onNavigate,
    optionId: optionIdFromParams,
    shopId,
  }: NodeNavigationParams) => {
    const resetNavigationState = () => {
      setNodeTransactionPending(false);
      setActiveNodeId(null);
      setPulsingNodeId(null);
    };

    const nodeIdString = nodeId.toString();

    // Set node as active and start pulsing animation
    setActiveNodeId(nodeIdString);
    setNodeTransactionPending(true);
    setPulsingNodeId(nodeIdString);
    if (nodes.some((node) => node.id === nodeIdString)) {
      fitViewToNode(nodeIdString);
    }

    // Clear pulsing animation after it completes
    const pulseTimeout = setTimeout(() => {
      setPulsingNodeId(null);
    }, 800);
    const navigationFailsafeTimeout = setTimeout(() => {
      resetNavigationState();
    }, 5000);

    try {
      if (isMockGameApiMode) {
        const optionIdFromNode = nodes.find((node) => node.id === nodeIdString)?.data
          ?.optionId as string | undefined;
        const runtimeMapOptions = useRoguelikeRuntimeStore.getState().mapOptions;
        const optionIdFromShop = shopId
          ? runtimeMapOptions.find(
              (option) => option.type === "STORE" && option.shopId === shopId
            )?.id
          : undefined;
        const optionId = optionIdFromParams ?? optionIdFromNode ?? optionIdFromShop;

        if (!optionId) {
          return;
        }

        const result = chooseMapOption(optionId);
        if (!result.nextPath) {
          return;
        }

        if (result.nextPath === "/demo") {
          await advanceRound();
        }

        await onNavigate();
        return;
      }

      const response = await advanceNode(gameId, nodeId);

      if (response) {
        // Navigate after blockchain transaction completes
        await onNavigate();
      }
    } catch (error) {
      console.error("Node navigation failed", error);
    } finally {
      clearTimeout(pulseTimeout);
      clearTimeout(navigationFailsafeTimeout);
      resetNavigationState();
    }
  };

  return { handleNodeNavigation };
};
