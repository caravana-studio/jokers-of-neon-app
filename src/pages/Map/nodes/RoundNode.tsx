import { Box, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useDojo } from "../../../dojo/useDojo";
import { useShopActions } from "../../../dojo/useShopActions";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";

const clickPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const RoundNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "round" });
  const { advanceNode } = useShopActions();
  const { id: gameId } = useGameStore();
  const navigate = useCustomNavigate();

    const {
      setup: { client },
    } = useDojo();

  const { reachableNodes, setSelectedNodeData, selectedNodeData, isNodeTransactionPending, setNodeTransactionPending, activeNodeId, setActiveNodeId, fitViewToNode, pulsingNodeId, setPulsingNodeId } = useMap();
  const { isSmallScreen } = useResponsiveValues();
  const { state, refetchGameStore } = useGameStore();

  const stateInMap = state === GameStateEnum.Map;
  const isActiveNode = activeNodeId === data.id.toString();
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap && (!isNodeTransactionPending || isActiveNode);

  const title = t("name");

  const refetchAndNavigate = async () => {
    await refetchGameStore(client, gameId);
    navigate(GameStateEnum.Round);
  };

  return (
    <Tooltip
      label={<TooltipContent title={title} />}
      placement="right"
      boxShadow={"0px 0px 15px 0px #fff, 0px 0px 5px 0px #fff inset"}
      w="1100px"
    >
      <Box
        style={{
          background:
            data.current || data.visited
              ? BLUE
              : reachable
                ? VIOLET
                : "transparent",
          padding: 10,
          borderRadius: 10,
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "white",
          cursor: isNodeTransactionPending ? "default" : (stateInMap && reachable ? "pointer" : "default"),
          boxShadow: data.current ? `0px 0px 18px 6px ${BLUE}` : "none",
          pointerEvents: isNodeTransactionPending ? "none" : "auto",
        }}
        sx={{
          transition: "all 0.2s ease-in-out",
          transform:
            selectedNodeData?.id === data.id ? "scale(1.2)" : "scale(1)",
          border: "1px solid",
          borderColor:
            selectedNodeData?.id === data.id
              ? "white"
              : reachable || data.visited || data.current
                ? "transparent"
                : "rgba(255,255,255,0.3)",
          "&:hover": {
            borderColor:
              reachable || data.visited || data.current
                ? "white"
                : "rgba(255,255,255,0.3)",
            transform: "scale(1.2)",
          },
        }}
        onClick={() => {
          if (isNodeTransactionPending) return;

          if (isSmallScreen) {
            setSelectedNodeData({
              id: data.id,
              title: title,
              nodeType: NodeType.ROUND,
            });
          } else if (data.current && !stateInMap) {
            navigate(GameStateEnum.Round);
          } else if (stateInMap && reachableNodes.includes(data.id.toString())) {
            // Desktop: navegar con un solo click
            setActiveNodeId(data.id.toString());
            setNodeTransactionPending(true);
            setPulsingNodeId(data.id.toString());
            fitViewToNode(data.id.toString());

            // Limpiar el pulso después de que termine la animación
            setTimeout(() => {
              setPulsingNodeId(null);
            }, 800);

            advanceNode(gameId, data.id)
              .then((response) => {
                if (response) {
                  setTimeout(() => {
                    refetchAndNavigate();
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
          }
        }}
      >
        <CachedImage
          src={`/map/icons/round/round${reachable || data.visited || data.current ? "" : "-off"}.png`}
          alt="round"
        />

        {pulsingNodeId === data.id.toString() && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius={10}
            border="3px solid white"
            sx={{
              animation: `${clickPulse} 0.8s ease-out forwards`,
              pointerEvents: "none",
            }}
          />
        )}

        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
      </Box>
    </Tooltip>
  );
};

export default RoundNode;
