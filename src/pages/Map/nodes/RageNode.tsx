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
import { VIOLET } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { NodeType } from "../types";

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });

  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes, setSelectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  return (
    <Tooltip
      label={`${t("name", { round: data.rageData.round })} ${t("power", { power: data.rageData.power })}`}
      placement="right"
    >
      <Box
        style={{
          opacity: reachable || data.visited || data.current ? 1 : 0.5,
          background:
            reachable || data.current ? VIOLET : "rgba(255,255,255,0.1)",
          padding: 10,
          width: data.last ? 120 : 70,
          height: data.last ? 120 : 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          color: "white",
          border: "1px solid white",
          cursor: stateInMap && reachable ? "pointer" : "default",
          boxShadow: data.current ? "0px 0px 15px 12px #fff" : "none",
        }}
        onClick={() => {
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: t("name", { round: data.rageData.round }),
              content: t("power", { power: data.rageData.power }),
              nodeType: NodeType.RAGE,
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
        <CachedImage
          src={
            data.last
              ? "/map/icons/rage-final.png"
              : "/map/icons/rage-normal.png"
          }
          alt="rage"
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

export default RageNode;
