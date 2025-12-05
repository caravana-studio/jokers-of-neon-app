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
import MapEdge from "./MapEdge";
import { NodeDetailsMobileButton } from "./NodeDetailsMobileButton";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
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
  const { advanceNode } = useShopActions();
  const { state, id: gameId, setShopId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();
  const { backToGameButtonProps, backToGameButton } = useBackToGameButton();

  useEffect(() => {
    if (layoutReady && nodes.length > 0) {
      const timeout1 = setTimeout(() => {
        fitViewToFullMap();
      }, 400);

      let timeout2: ReturnType<typeof setTimeout> | undefined;

      // Solo hacer zoom al nodo actual en desktop
      if (!isSmallScreen) {
        timeout2 = setTimeout(() => {
          fitViewToCurrentNode();
        }, 1000);
      }

      return () => {
        clearTimeout(timeout1);
        if (timeout2) clearTimeout(timeout2);
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

  const handleGoClick = () => {
    if (!selectedNodeData) return;

    setActiveNodeId(selectedNodeData.id.toString());
    setNodeTransactionPending(true);
    setPulsingNodeId(selectedNodeData.id.toString());
    fitViewToNode(selectedNodeData.id.toString());

    // Limpiar el pulso después de que termine la animación
    setTimeout(() => {
      setPulsingNodeId(null);
    }, 800);

    advanceNode(gameId, selectedNodeData.id)
      .then((response) => {
        if (response) {
          setTimeout(() => {
            switch (selectedNodeData?.nodeType) {
              case NodeType.RAGE:
                refetchAndNavigate(GameStateEnum.Rage);
                break;
              case NodeType.ROUND:
                refetchAndNavigate(GameStateEnum.Round);
                break;
              case NodeType.STORE:
                selectedNodeData.shopId && setShopId(selectedNodeData.shopId);
                navigate(GameStateEnum.Store);
                break;
              default:
                break;
            }
          }, 900);
        } else {
          setNodeTransactionPending(false);
          setActiveNodeId(null);
        }
      })
      .catch(() => {
        setNodeTransactionPending(false);
        setActiveNodeId(null);
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
