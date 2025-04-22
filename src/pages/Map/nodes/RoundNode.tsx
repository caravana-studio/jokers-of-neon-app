import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";

const RoundNode = ({ data }: any) => {
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;

  return (
    <Box
      style={{
        background: data.visited ? "green" : "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 10,
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        color: "white",
        border: "1px solid yellow",
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
      🃏
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0 }}
      />
    </Box>
  );
};

export default RoundNode;
