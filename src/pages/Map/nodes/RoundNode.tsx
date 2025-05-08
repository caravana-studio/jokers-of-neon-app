import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";
import { BLUE, VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { NodeType } from "../types";

const RoundNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "round" });
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();
  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  return (
    <Tooltip label={t("name", { round: data.round })} placement="right">
      <Box
        style={{
          opacity: reachable || data.visited || data.current ? 1 : 0.5,
          background:
            data.current || data.visited
              ? BLUE
              : reachable
                ? VIOLET
                : "rgba(255,255,255,0.1)",
          padding: 10,
          borderRadius: 10,
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "white",
          border: "1px solid white",
          transform:
            selectedNodeData?.id === data.id ? "scale(1.2)" : "scale(1)",
          cursor: stateInMap && reachable ? "pointer" : "default",
          boxShadow: data.current ? `0px 0px 18px 6px ${BLUE}` : "none",
        }}
        onClick={() => {
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: t("name", { round: data.round }),
              // content: t("description", { round: data.round }),
              nodeType: NodeType.ROUND,
            });
          if (data.current && !stateInMap) {
            navigate("/redirect/demo");
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate("/redirect/demo");
              }
            });
          }
        }}
      >
        <CachedImage src={"/map/icons/round/round.png"} alt="round" />

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
