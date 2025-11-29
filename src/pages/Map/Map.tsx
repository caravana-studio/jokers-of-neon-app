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
import { useShopActions } from "../../dojo/useShopActions";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useMap } from "../../providers/MapProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { MobileCoins } from "../store/Coins";
import { NodeDetailsMobileButton } from "./NodeDetailsMobileButton";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
import MapEdge from "./MapEdge";
import { NodeType } from "./types";

export const Map = () => {
  const { t } = useTranslation("map");
  const {
    nodes,
    edges,
    fitViewToCurrentNode,
    fitViewToFullMap,
    fitViewToNode,
    animateToNodeDuringTransaction,
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
  const { advanceNode } = useShopActions();
  const { state, id: gameId, setShopId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();
  const { backToGameButtonProps, backToGameButton } = useBackToGameButton();

  useEffect(() => {
    if (layoutReady && nodes.length > 0) {
      const timeout1 = setTimeout(() => {
        fitViewToFullMap();
      }, 400);

      const timeout2 = setTimeout(() => {
        fitViewToCurrentNode();
      }, 1000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [layoutReady, nodes]);

  const isReachable = reachableNodes.includes(
    selectedNodeData?.id?.toString() ?? ""
  );

  const refetchAndNavigate = async (state: GameStateEnum) => {
    await refetchGameStore(client, gameId);
    navigate(state);
  };

  const handleGoClick = async () => {
    if (!selectedNodeData) return;

    setActiveNodeId(selectedNodeData.id.toString());
    setNodeTransactionPending(true);
    setPulsingNodeId(selectedNodeData.id.toString());

    const transactionPromise = advanceNode(gameId, selectedNodeData.id);

    try {
      await animateToNodeDuringTransaction(
        selectedNodeData.id.toString(),
        transactionPromise
      );

      const response = await transactionPromise;

      setPulsingNodeId(null);

      if (response) {
        switch (selectedNodeData?.nodeType) {
          case NodeType.RAGE:
            await refetchAndNavigate(GameStateEnum.Rage);
            break;
          case NodeType.ROUND:
            await refetchAndNavigate(GameStateEnum.Round);
            break;
          case NodeType.STORE:
            selectedNodeData.shopId && setShopId(selectedNodeData.shopId);
            navigate(GameStateEnum.Store);
            break;
          default:
            break;
        }
      } else {
        setNodeTransactionPending(false);
        setActiveNodeId(null);
      }
    } catch (error) {
      setPulsingNodeId(null);
      setNodeTransactionPending(false);
      setActiveNodeId(null);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", zIndex: 10 }}>
      <MobileDecoration fadeToBlack />
      {isSmallScreen ? (
        <Flex position="absolute" top={"10px"} left={5} zIndex={1000}>
          <MobileCoins fontSize={"15px"} iconSize={19} />
        </Flex>
      ) : (
        <Flex position="absolute" top={"17px"} left={"55px"} zIndex={1000}>
          <MobileCoins fontSize={"20px"} iconSize={24} />
        </Flex>
      )}
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
        panOnScroll={!isNodeTransactionPending}
        zoomOnScroll={!isNodeTransactionPending}
        panOnDrag={!isNodeTransactionPending}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        zoomOnPinch={!isNodeTransactionPending}
        zoomOnDoubleClick={!isNodeTransactionPending}
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
