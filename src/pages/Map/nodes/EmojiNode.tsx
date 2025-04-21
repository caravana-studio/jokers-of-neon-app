import { Box } from "@chakra-ui/react";
import { Handle, Position } from "reactflow";
import { useGame } from "../../../dojo/queries/useGame";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";

const EmojiNode = ({ data }: any) => {
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();

  const game = useGame();
  console.log("game", game);
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
      }}
      onClick={() => {
        console.log("advancingNode", gameId, data.id);
        advanceNode(gameId, data.id);
      }}
    >
      {data.icon}
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
