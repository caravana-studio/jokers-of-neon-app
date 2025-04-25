import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";

const RageNode = ({ data }: any) => {
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();
  const { reachableNodes } = useMap();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;

  return (
    <Box
      style={{
        background: reachable
          ? "violet"
          : data.visited
            ? "green"
            : "rgba(255,255,255,0.1)",
        padding: 10,
        width: 90,
        height: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
        color: "white",
        border: "1px solid red",
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
      💀
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </Box>
  );
};

export default RageNode;
