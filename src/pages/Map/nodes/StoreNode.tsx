import { Box, Tooltip } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useMapNavigationStore } from "../../../state/useMapNavigationStore";
import { useUnlockProgressStore } from "../../../state/useUnlockProgressStore";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import {
  buildShopTooltipContent,
} from "../../../utils/shopTooltipUnlocks";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";
import { HereSign } from "./HereSign";
import { NodeClickPulse } from "./NodeClickPulse";
import { getReachablePulseSx } from "./reachablePulseAnimation";
import { useNodeNavigation } from "./useNodeNavigation";
import { useNodeReachability } from "./useNodeReachability";

const StoreNode = memo(({ data }: any) => {
  const { t } = useTranslation("store", { keyPrefix: "config" });
  const { t: tMap } = useTranslation("map");
  const { id: gameId, setShopId } = useGameStore();
  const navigate = useCustomNavigate();
  const { handleNodeNavigation } = useNodeNavigation();
  const unlockedShopItems = useUnlockProgressStore(
    (state) => state.unlockedShopItems
  );

  const { setSelectedNodeData, selectedNodeData } = useMap();
  const isNodeTransactionPending = useMapNavigationStore((s) => s.isNodeTransactionPending);
  const pulsingNodeId = useMapNavigationStore((s) => s.pulsingNodeId);
  const { isSmallScreen } = useResponsiveValues();

  const { refetch } = useStore();

  const { stateInMap, reachable } = useNodeReachability(data.id);

  const title = `${tMap('legend.nodes.shop.title')} ${t(`${data.shopId}.name`)}`;
  const content = useMemo(
    () => buildShopTooltipContent(data.shopId, t, unlockedShopItems),
    [data.shopId, t, unlockedShopItems]
  );

  const refetchAndNavigate = async () => {
    setShopId(data.shopId);
    refetch();
    navigate(GameStateEnum.Store);
  };
  return (
    <Tooltip
      label={<TooltipContent title={title} content={content} />}
      boxShadow={"0px 0px 15px 0px #fff, 0px 0px 5px 0px #fff inset"}
      w="1100px"
      placement="right"
    >
      <Box
        className="map-tutorial-store-node"
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
          opacity: !data.visited && !data.current && !reachable ? 0.4 : 1,
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
            ? getReachablePulseSx("100%", "-8px")
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
          } else if (reachable) {
            handleNodeNavigation({
              nodeId: data.id,
              gameId,
              onNavigate: refetchAndNavigate,
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
          <NodeClickPulse borderRadius="100%" />
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
});

export default StoreNode;
