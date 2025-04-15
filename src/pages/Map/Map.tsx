import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { useEffect, useState } from "react";
import { getMap } from "../../dojo/queries/getMap";
import { useDojo } from "../../dojo/useDojo";
import { getLayoutedElements } from "./layout";

const initialNodes = [
  {
    id: "start",
    data: { icon: "🏁" },
    type: "emoji",
    position: { x: 0, y: 0 },
  },
  {
    id: "node1",
    data: { icon: "🃏" },
    type: "emoji",
    position: { x: 0, y: 0 },
  },
  {
    id: "node2",
    data: { icon: "🧙" },
    type: "emoji",
    position: { x: 0, y: 0 },
  },
  { id: "boss", data: { icon: "💀" }, type: "emoji", position: { x: 0, y: 0 } },
];

const initialEdges = [
  { id: "e1", source: "start", target: "node1" },
  { id: "e2", source: "start", target: "node2" },
  { id: "e3", source: "node1", target: "boss" },
  { id: "e4", source: "node2", target: "boss" },
];

export const Map = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    getMap(client, 1, 1);
    getLayoutedElements(initialNodes, initialEdges).then(({ nodes, edges }) => {
      setNodes(nodes);
      setEdges(edges);
    });
  }, []);
  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ emoji: EmojiNode }}
        fitView
        panOnScroll={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
