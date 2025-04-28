import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";
import { VIOLET } from "../../../theme/colors";
import CachedImage from "../../../components/CachedImage";

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });

  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();
  const { reachableNodes } = useMap();

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
          cursor: stateInMap ? "pointer" : "default",
          boxShadow: data.current ? "0px 0px 15px 12px #fff" : "none",
        }}
        onClick={() => {
          if (stateInMap) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate("/redirect/demo");
              }
            });
          } else if (data.current) {
            navigate("/redirect/demo");
          }
        }}
      >
        <CachedImage src={data.last ? "/map/icons/rage-final.png" : "/map/icons/rage-normal.png"} alt="rage" />
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
