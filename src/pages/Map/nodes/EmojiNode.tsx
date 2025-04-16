// EmojiNode.tsx
import { Handle, Position } from "reactflow";

const EmojiNode = ({ data }: any) => {
  return (
    <div
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
    </div>
  );
};

export default EmojiNode;
