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

const RoundNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "round" });
  const { advanceNode } = useShopActions();
  const { id: gameId } = useGameStore();
  const navigate = useCustomNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();
  const { state } = useGameStore();

  const stateInMap = state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  const title = t("name", { round: data.round });

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
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: title,
              nodeType: NodeType.ROUND,
            });
          if (data.current && !stateInMap) {
            navigate(GameStateEnum.Round);
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate(GameStateEnum.Round);
              }
            });
          }
        }}
      >
        <CachedImage
          src={`/map/icons/round/round${reachable || data.visited || data.current ? "" : "-off"}.png`}
          alt="round"
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

export default RoundNode;
