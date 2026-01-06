import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";
import "./Map.css";
import EmojiNode from "./nodes/EmojiNode";

import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useBackToGameButton } from "../../components/useBackToGameButton";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useDojo } from "../../dojo/useDojo";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useMap } from "../../providers/MapProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { MobileCoins } from "../store/Coins";
import MapEdge from "./MapEdge";
import { NodeDetailsMobileButton } from "./NodeDetailsMobileButton";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
import { useNodeNavigation } from "./nodes/useNodeNavigation";
import { NodeType } from "./types";

export const Map = () => {
  const { t } = useTranslation("map");
  const {
    nodes,
    edges,
    fitViewToCurrentNode,
    fitViewToFullMap,
    fitViewToNode,
    layoutReady,
    selectedNodeData,
    reachableNodes,
    isNodeTransactionPending,
    setNodeTransactionPending,
    activeNodeId,
    setActiveNodeId,
    pulsingNodeId,
    setPulsingNodeId,
  } = useMap();

  const {
    setup: { client },
  } = useDojo();

  const { isSmallScreen } = useResponsiveValues();
  const { state, id: gameId, setShopId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();
  const { backToGameButtonProps, backToGameButton } = useBackToGameButton();
  const { handleNodeNavigation } = useNodeNavigation();
  const { refetch: refetchStore } = useStore();

  useEffect(() => {
    if (layoutReady && nodes.length > 0) {
      const timeout1 = setTimeout(() => {
        fitViewToFullMap();
      }, 400);

      // Zoom to current node on both desktop and mobile
      const timeout2 = setTimeout(() => {
        fitViewToCurrentNode();
      }, 1000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [layoutReady, nodes, isSmallScreen]);

  const isReachable = reachableNodes.includes(
    selectedNodeData?.id?.toString() ?? ""
  );

  const refetchAndNavigate = async (state: GameStateEnum) => {
    await refetchGameStore(client, gameId);
    navigate(state);
  };

  const handleGoClick = async () => {
    if (!selectedNodeData || isNodeTransactionPending) return;

    const navigateToNode = async () => {
      switch (selectedNodeData?.nodeType) {
        case NodeType.RAGE:
          await refetchAndNavigate(GameStateEnum.Rage);
          break;
        case NodeType.ROUND:
          await refetchAndNavigate(GameStateEnum.Round);
          break;
        case NodeType.STORE:
          if (selectedNodeData.shopId) {
            setShopId(selectedNodeData.shopId);
            refetchStore();
          }
          navigate(GameStateEnum.Store);
          break;
        default:
          break;
      }
    };

    handleNodeNavigation({
      nodeId: selectedNodeData.id,
      gameId,
      onNavigate: navigateToNode,
    });
  };

  return (
    <div style={{ height: "100%", width: "100%", zIndex: 10 }}>
      <MobileDecoration fadeToBlack />
      <Flex
        position="absolute"
        top={isSmallScreen ? "20px" : "35px"}
        left={isSmallScreen ? 5 : "65px"}
        zIndex={1000}
      >
        <MobileCoins />
      </Flex>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          [NodeType.NONE]: EmojiNode,
          [NodeType.RAGE]: RageNode,
          [NodeType.STORE]: RewardNode,
          [NodeType.ROUND]: RoundNode,
          [NodeType.CHALLENGE]: RoundNode,
        }}
        edgeTypes={{ map: MapEdge }}
        panOnScroll={false}
        zoomOnScroll={true}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        {!isSmallScreen && (
          <Controls
            style={{ marginBottom: "100px" }}
            showInteractive={false}
            onFitView={() => fitViewToCurrentNode()}
          />
        )}
      </ReactFlow>

      <Flex
        position="absolute"
        bottom={isSmallScreen ? 0 : "65px"}
        w="100%"
        zIndex={1000}
      >
        {isSmallScreen ? (
          <MobileBottomBar
            firstButton={
              isReachable && state === GameStateEnum.Map
                ? {
                    onClick: handleGoClick,
                    label: t("go"),
                    disabled: isNodeTransactionPending,
                  }
                : undefined
            }
          />
        ) : (
          state !== GameStateEnum.Map && (
            <Flex margin={"0 auto"}>{backToGameButton}</Flex>
          )
        )}
      </Flex>

      {isSmallScreen && selectedNodeData && <NodeDetailsMobileButton />}
    </div>
  );
};
