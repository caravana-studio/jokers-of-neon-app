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

const RoundNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "round" });
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes } = useMap();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  return (
    <Tooltip label={t("name", { round: data.round })} placement="right">
      <Box
        style={{
          opacity: reachable || data.visited || data.current ? 1 : 0.5,
          background:
            reachable || data.current ? VIOLET : "rgba(255,255,255,0.1)",
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
        <CachedImage src={"/map/icons/cards.png"} alt="round" />

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
