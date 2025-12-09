import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useDojo } from "../../../dojo/useDojo";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";
import { HereSign } from "./HereSign";

const reachablePulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;
import { NodeClickPulse } from "./NodeClickPulse";
import { useNodeNavigation } from "./useNodeNavigation";

const RoundNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "round" });
  const { id: gameId } = useGameStore();
  const navigate = useCustomNavigate();
  const { handleNodeNavigation } = useNodeNavigation();

  const {
    setup: { client },
  } = useDojo();

  const { reachableNodes, setSelectedNodeData, selectedNodeData, isNodeTransactionPending, activeNodeId, pulsingNodeId } = useMap();
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
          cursor: stateInMap && reachable ? "pointer" : "default",
          boxShadow: data.current ? `0px 0px 18px 6px ${BLUE}` : "none",
          position: "relative",
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
          ...(reachable && !data.current
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: 14,
                  border: `2px solid ${VIOLET}`,
                  animation: `${reachablePulse} 1.8s ease-out infinite`,
                  pointerEvents: "none",
                  opacity: 0.8,
                  zIndex: -1,
                  transformOrigin: "center",
                },
              }
            : {}),
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
            // Desktop: navigate with a single click
            handleNodeNavigation({
              nodeId: data.id,
              gameId,
              onNavigate: refetchAndNavigate,
            });
          }
        }}
      >
        <CachedImage
          src={`/map/icons/round/round${reachable || data.visited || data.current ? "" : "-off"}.png`}
          alt="round"
        />

        {pulsingNodeId === data.id.toString() && (
          <NodeClickPulse borderRadius={10} />
        )}
        {data.current && <HereSign />}

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
