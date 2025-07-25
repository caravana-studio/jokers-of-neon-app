import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";

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
      return { lootboxes: 2, powerups: 2, levelups: 2 };
    default:
      return { traditionals: 5, modifiers: 3 };
  }
};

const StoreNode = ({ data }: any) => {
  const { t } = useTranslation("store", { keyPrefix: "config" });
  const { advanceNode } = useShopActions();
  const { id: gameId } = useGameStore();
  const navigate = useCustomNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const { state, setRound } = useGameStore();

  const stateInMap = state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  const title = t(`${data.shopId}.name`);
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
        }}
        onClick={() => {
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: title,
              content: content,
              nodeType: NodeType.STORE,
            });

          if (data.current && !stateInMap) {
            navigate(GameStateEnum.Store);
          } else if (stateInMap && reachable && !isSmallScreen) {
            console.log("gameId", gameId);
            console.log("data.id", data.id);
            advanceNode(gameId, data.id).then((response) => {
              console.log("response", response);
              if (response) {
                navigate(GameStateEnum.Store);
                setRound(data.id);
              }
            });
          }
        }}
      >
        <CachedImage
          w="100%"
          src={`/map/icons/rewards/${data.shopId}${reachable || data.visited || data.current ? "" : "-off"}.png`}
          alt="shop"
        />

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
