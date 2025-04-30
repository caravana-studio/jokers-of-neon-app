import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";

const EmojiNode = ({ data }: any) => {
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
        borderRadius: 20,
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        color: "white",
        border: "2px solid #fff",
        cursor: stateInMap ? "pointer" : "default",
      }}
      onClick={() => {
        if (stateInMap) {
          advanceNode(gameId, data.id).then(() => {
            navigate("/redirect");
          });
        }
      }}
    >
      ?
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#fff" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#fff" }}
      />
    </Box>
  );
};

export default EmojiNode;
