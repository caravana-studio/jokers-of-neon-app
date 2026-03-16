import ReactFlow, { Controls, CoordinateExtent } from "reactflow";
import "reactflow/dist/style.css";
import "./Map.css";
import EmojiNode from "./nodes/EmojiNode";

import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useRef } from "react";
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
import { useMapNavigationStore } from "../../state/useMapNavigationStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { MobileCoins } from "../store/Coins";
import MapEdge from "./MapEdge";
import { NodeDetailsMobileButton } from "./NodeDetailsMobileButton";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
import { useNodeNavigation } from "./nodes/useNodeNavigation";
import { NodeType } from "./types";

// Memoized outside component to prevent ReactFlow re-renders
const NODE_TYPES = {
  [NodeType.NONE]: EmojiNode,
  [NodeType.RAGE]: RageNode,
  [NodeType.STORE]: RewardNode,
  [NodeType.ROUND]: RoundNode,
  [NodeType.CHALLENGE]: RoundNode,
};

const EDGE_TYPES = { map: MapEdge };
const MAP_EXTENT_PADDING_X = 220;
const MAP_EXTENT_PADDING_Y = 220;
const FALLBACK_NODE_SIZE = 60;

export const Map = () => {
  const { t } = useTranslation("map");
  const {
    nodes,
    edges,
    fitViewToCurrentNode,
    fitViewToFullMap,
    layoutReady,
    selectedNodeData,
    reachableNodes,
  } = useMap();

  const isNodeTransactionPending = useMapNavigationStore(
    (state) => state.isNodeTransactionPending
  );

  const {
    setup: { client },
  } = useDojo();

  const { isSmallScreen } = useResponsiveValues();
  const { state, id: gameId, setShopId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();
  const { backToGameButtonProps, backToGameButton } = useBackToGameButton();
  const { handleNodeNavigation } = useNodeNavigation();
  const { refetch: refetchStore } = useStore();
  const hasInitialFitView = useRef(false);

  const translateExtent = useMemo<CoordinateExtent | undefined>(() => {
    if (nodes.length === 0) return undefined;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
      const nodeWidth = node.width ?? FALLBACK_NODE_SIZE;
      const nodeHeight = node.height ?? FALLBACK_NODE_SIZE;

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    }

    return [
      [
        Math.floor(minX - MAP_EXTENT_PADDING_X),
        Math.floor(minY - MAP_EXTENT_PADDING_Y),
      ],
      [
        Math.ceil(maxX + MAP_EXTENT_PADDING_X),
        Math.ceil(maxY + MAP_EXTENT_PADDING_Y),
      ],
    ];
  }, [nodes]);

  useEffect(() => {
    if (layoutReady && nodes.length > 0 && !hasInitialFitView.current) {
      hasInitialFitView.current = true;

      // Double rAF ensures React has committed and browser has painted nodes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fitViewToFullMap();

          // Zoom to current node on both desktop and mobile
          setTimeout(() => {
            fitViewToCurrentNode();
          }, 600);
        });
      });
    }
  }, [layoutReady]);

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
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        translateExtent={translateExtent}
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
