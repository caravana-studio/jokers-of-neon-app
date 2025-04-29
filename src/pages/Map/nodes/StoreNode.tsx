import { Box, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";
import { VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { NodeType } from "../types";

const getStoreItemsBasedOnShopId = (shopId: number) => {
  switch (shopId) {
    case 1:
      return { traditionals: 5, modifiers: 3 };
    case 2:
      return { specials: 3, powerups: 2 };
    case 3:
      return { specials: 3, lootboxes: 2 };
    case 4:
      return { levelups: 3, specials: 2 };
    case 5:
      return { modofiers: 4, lootboxes: 2 };
    case 6:
      return { lootboxes: 2, powerups: 2, levelups: 2 };
    default:
      return { traditionals: 5, modifiers: 3 };
  }
};

const StoreNode = ({ data }: any) => {
  const { t } = useTranslation("store", { keyPrefix: "config" });
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  const description = useMemo(
    () =>
      `${t(`${data.shopId}.name`)}: 
        ${t(
          `${data.shopId}.content`,
          getStoreItemsBasedOnShopId(data.shopId)
        )}`,
    [data.shopId]
  );
  return (
    <Tooltip label={description} placement="right">
      <Box
        style={{
          opacity: reachable || data.visited || data.current ? 1 : 0.5,
          background:
            reachable || data.current ? VIOLET : "rgba(255,255,255,0.1)",
          padding: 10,
          borderRadius: "100%",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "white",
          border: "1px solid #fff",
          transform: selectedNodeData?.id === data.id ? "scale(1.2)" : "scale(1)",
          cursor: stateInMap && reachable ? "pointer" : "default",
          boxShadow: data.current ? "0px 0px 15px 12px #fff" : "none",
        }}
        onClick={() => {
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: t("shop"),
              content: description,
              nodeType: NodeType.STORE,
            });

          if (data.current && !stateInMap) {
            navigate("/redirect/store");
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate("/redirect/store");
              }
            });
          }
        }}
      >
        <CachedImage src={"/map/icons/shop.png"} alt="shop" />

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
