import { Box, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";
import { HereSign } from "./HereSign";

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

const reachablePulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

const getStoreItemsBasedOnShopId = (shopId: number) => {
  switch (shopId) {
    case 1:
      return { traditionals: 5, modifiers: 3 };
    case 2:
      return { specials: 2, powerups: 2 };
    case 3:
      return { specials: 3, lootboxes: 2 };
    case 4:
      return { levelups: 3, specials: 2 };
    case 5:
      return { modifiers: 4, lootboxes: 2 };
    case 6:
      return { lootboxes: 2, powerups: 2, levelups: 3 };
    default:
      return { traditionals: 5, modifiers: 3 };
  }
};

const StoreNode = ({ data }: any) => {
  const { t } = useTranslation("store", { keyPrefix: "config" });
  const { t: tMap } = useTranslation("map");
  const { advanceNode } = useShopActions();
  const { id: gameId } = useGameStore();
  const navigate = useCustomNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData, isNodeTransactionPending, setNodeTransactionPending, activeNodeId, setActiveNodeId, fitViewToNode, pulsingNodeId, setPulsingNodeId } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const { state, setShopId } = useGameStore();
  const { refetch } = useStore();

  const stateInMap = state === GameStateEnum.Map;
  const isActiveNode = activeNodeId === data.id.toString();
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap && (!isNodeTransactionPending || isActiveNode);

  const title = `${tMap('legend.nodes.shop.title')} ${t(`${data.shopId}.name`)}`;
  const content = t(
    `${data.shopId}.content`,
    getStoreItemsBasedOnShopId(data.shopId)
  );
  return (
    <Tooltip
      label={<TooltipContent title={title} content={content} />}
      boxShadow={"0px 0px 15px 0px #fff, 0px 0px 5px 0px #fff inset"}
      w="1100px"
      placement="right"
    >
      <Box
        style={{
          background:
            data.current || data.visited
              ? BLUE
              : reachable
                ? VIOLET
                : "transparent",

          borderRadius: "100%",
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
            selectedNodeData?.id === data.id ? "white" : "transparent",
          "&:hover": {
            borderColor:
              reachable || data.visited || data.current
                ? "white"
                : "transparent",
            transform: "scale(1.2)",
          },
          ...(reachable && !data.current
            ? {
              "&::after": {
                content: '""',
                position: "absolute",
                inset: "-8px",
                borderRadius: "100%",
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
              content: content,
              nodeType: NodeType.STORE,
              shopId: data.shopId,
            });
          } else if (data.current && !stateInMap) {
            navigate(GameStateEnum.Store);
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
                      setShopId(data.shopId);
                      refetch();
                      navigate(GameStateEnum.Store);
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
                title: title,
                content: content,
                nodeType: NodeType.STORE,
                shopId: data.shopId,
              });
            }
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                setShopId(data.shopId);
                refetch();
                navigate(GameStateEnum.Store);
              }
            });
          }
        }}
      >
        {data.current && <HereSign />}

        <CachedImage
          w="100%"
          src={`/map/icons/rewards/${data.shopId}${reachable || data.visited || data.current ? "" : "-off"}.png`}
          alt="shop"
        />

        {pulsingNodeId === data.id.toString() && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius="100%"
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

export default StoreNode;
