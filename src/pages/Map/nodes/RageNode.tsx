import { Box, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useDojo } from "../../../dojo/useDojo";
import { useShopActions } from "../../../dojo/useShopActions";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE } from "../../../theme/colors";
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

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });

  const { advanceNode } = useShopActions();
  const { id: gameId, refetchGameStore } = useGameStore();
  const navigate = useCustomNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData, isNodeTransactionPending, setNodeTransactionPending, activeNodeId, setActiveNodeId, fitViewToNode, pulsingNodeId, setPulsingNodeId } = useMap();
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
            // Desktop: verificar si ya está seleccionado para navegarlo o solo seleccionarlo
            if (selectedNodeData?.id === data.id) {
              // Segundo click: navegar con animación
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
            } else {
              // Primer click: solo mostrar información
              setSelectedNodeData({
                id: data.id,
                title,
                content,
                nodeType: NodeType.RAGE,
              });
            }
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

        <Box zIndex={1}>
          <CachedImage
            src={`/map/icons/rage/${data.last ? "final" : "intermediate"}-${stateInMap && reachable ? "violet" : data.visited || data.current ? "blue" : "off"}${data.current || (isHovered && (data.visited || reachable)) ? "-bordered" : ""}.png`}
            alt="rage"
          />
        </Box>

        {pulsingNodeId === data.id.toString() && (
          <Box
            position="absolute"
            width="90%"
            height="90%"
            borderRadius="full"
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

export default RageNode;
