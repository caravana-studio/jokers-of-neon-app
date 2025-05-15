import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { Button, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useShopActions } from "../../dojo/useShopActions";
import { useGameContext } from "../../providers/GameProvider";
import { useMap } from "../../providers/MapProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { MobileCoins } from "../store/Coins";
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
    layoutReady,
    selectedNodeData,
    reachableNodes,
  } = useMap();

  const { isSmallScreen } = useResponsiveValues();
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

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

  const handleGoClick = () => {
    selectedNodeData &&
      advanceNode(gameId, selectedNodeData.id).then((response) => {
        if (response) {
          switch (selectedNodeData?.nodeType) {
            case NodeType.RAGE:
              navigate("/redirect/demo");
              break;
            case NodeType.ROUND:
              navigate("/redirect/demo");
              break;
            case NodeType.STORE:
              navigate("/redirect/store");
              break;
            default:
              break;
          }
        }
      });
  };

  return (
    <div style={{ height: "100%", width: "100%", zIndex: 10 }}>
      <MobileDecoration fadeToBlack />
      {isSmallScreen ? (
        <Flex position="absolute" top={"10px"} left={5} zIndex={1000}>
          <MobileCoins fontSize={"15px"} iconSize={19} />
        </Flex>
      ) : (
        <Flex position="absolute" top={"17px"} left={'55px'} zIndex={1000}>
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
      {isSmallScreen && (
        <Flex position="absolute" bottom={0} w="100%" zIndex={1000}>
          <MobileBottomBar
            firstButton={undefined}
            secondButton={
              isReachable && (
                <Button
                  minWidth={"100px"}
                  size={"xs"}
                  lineHeight={1.6}
                  fontSize={10}
                  onClick={handleGoClick}
                >
                  {t("go")}
                </Button>
              )
            }
            hideDeckButton
          />
        </Flex>
      )}
      {isSmallScreen && selectedNodeData && <NodeDetailsMobileButton />}
    </div>
  );
};
