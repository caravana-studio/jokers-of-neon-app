import { Box, Tooltip } from "@chakra-ui/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { isMockGameApiMode } from "../../../config/gameMode";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { UnlockableSystem } from "../../../domain/roguelike/types";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useProgressStore } from "../../../state/roguelike/useProgressStore";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useMapNavigationStore } from "../../../state/useMapNavigationStore";
import { getMockShopItemCounts, StoreItemCounts } from "../../../state/roguelike/mockShopRules";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";
import { HereSign } from "./HereSign";
import { NodeClickPulse } from "./NodeClickPulse";
import { getReachablePulseSx } from "./reachablePulseAnimation";
import { useNodeNavigation } from "./useNodeNavigation";
import { useNodeReachability } from "./useNodeReachability";

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

const toStoreTranslationValues = (counts: StoreItemCounts) => ({
  traditionals: counts.traditionals ?? 0,
  modifiers: counts.modifiers ?? 0,
  specials: counts.specials ?? 0,
  powerups: counts.powerups ?? 0,
  lootboxes: counts.lootboxes ?? 0,
  levelups: counts.levelups ?? 0,
});

const StoreNode = memo(({ data }: any) => {
  const { t } = useTranslation("store", { keyPrefix: "config" });
  const { t: tMap } = useTranslation("map");
  const { id: gameId, setShopId } = useGameStore();
  const profile = useProgressStore((state) => state.profile);
  const unlockedSystems: UnlockableSystem[] = profile?.unlockedSystems ?? [];
  const navigate = useCustomNavigate();
  const { handleNodeNavigation } = useNodeNavigation();

  const { setSelectedNodeData, selectedNodeData } = useMap();
  const isNodeTransactionPending = useMapNavigationStore((s) => s.isNodeTransactionPending);
  const pulsingNodeId = useMapNavigationStore((s) => s.pulsingNodeId);
  const { isSmallScreen } = useResponsiveValues();

  const { refetch } = useStore();

  const { stateInMap, reachable } = useNodeReachability(data.id);

  const title = `${tMap('legend.nodes.shop.title')} ${t(`${data.shopId}.name`)}`;
  const counts = isMockGameApiMode
    ? getMockShopItemCounts(data.shopId, unlockedSystems)
    : getStoreItemsBasedOnShopId(data.shopId);
  const content = t(
    `${data.shopId}.content`,
    toStoreTranslationValues(counts)
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
              optionId: data.optionId,
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
