import { Box, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
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

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });
  const { id: gameId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();
  const { handleNodeNavigation } = useNodeNavigation();

  const { reachableNodes, setSelectedNodeData, selectedNodeData, isNodeTransactionPending, activeNodeId, pulsingNodeId } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: { client },
  } = useDojo();

  const { state } = useGameStore();

  const stateInMap = state === GameStateEnum.Map;
  const isActiveNode = activeNodeId === data.id.toString();
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap && (!isNodeTransactionPending || isActiveNode);
  const [isHovered, setIsHovered] = useState(false);

  const title = `${t("name")} - ${t(data.last ? "final" : "intermediate")}`;
  const content = `${t("power", { power: data.rageData.power })}`;

  const refetchAndNavigate = async () => {
    await refetchGameStore(client, gameId);
    navigate(GameStateEnum.Rage);
  };

  return (
    <Tooltip
      label={<TooltipContent title={title} content={content} />}
      boxShadow={"0px 0px 15px 0px #fff, 0px 0px 5px 0px #fff inset"}
      w="1100px"
      placement="right"
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: data.last ? (!data.visited ? 120 : 50) : 70,
          height: data.last ? (!data.visited ? 120 : 50) : 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          color: "white",
          transition: "all 0.2s ease-in-out",
          transform:
            selectedNodeData?.id === data.id || isHovered || data.current
              ? "scale(1.2)"
              : "scale(1)",
          cursor: stateInMap && reachable ? "pointer" : "default",
          position: "relative",
        }}
        sx={{
          ...(reachable && !data.current
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: "-10px",
                  borderRadius: "50%",
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
              title,
              content,
              nodeType: NodeType.RAGE,
            });
          } else if (data.current && !stateInMap) {
            navigate(GameStateEnum.Rage);
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
        {data.current && (
          <Box
            position="absolute"
            width="90%"
            height="90%"
            borderRadius="full"
            boxShadow={`0px 0px 18px 6px ${BLUE}`}
            zIndex={0}
          />
        )}

        {data.current && <HereSign />}

        <Box zIndex={1}>
          <CachedImage
            src={`/map/icons/rage/${data.last ? "final" : "intermediate"}-${stateInMap && reachable ? "violet" : data.visited || data.current ? "blue" : "off"}${data.current || (isHovered && (data.visited || reachable)) ? "-bordered" : ""}.png`}
            alt="rage"
          />
        </Box>

        {pulsingNodeId === data.id.toString() && (
          <NodeClickPulse borderRadius="full" width="90%" height="90%" />
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

export default RageNode;
