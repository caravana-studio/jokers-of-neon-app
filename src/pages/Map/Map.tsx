import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { useEffect, useState } from "react";
import { getMap } from "../../dojo/queries/getMap";
import { useDojo } from "../../dojo/useDojo";
import { getLayoutedElements } from "./layout";
import { NodeData } from "./types";

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

const calculateEdges = (nodes: NodeData[]) => {
  const edges: Edge[] = [];
  nodes.forEach((node) => {
    node.children.forEach((childId) => {
      edges.push({ id: node.id + "-" + childId, source: node.id.toString(), target: childId.toString() });
    })
  })

  return edges;
}

export const Map = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    getMap(client, 1, 1).then((dataNodes) => {
        const transformedNodes = dataNodes.map((node) => {
          return {
            id: node.id.toString(),
            type: "emoji",
            position: { x: 0, y: 0 },
            data: {icon: "🧙" }
          }
        })
        const calculatedEdges = calculateEdges(dataNodes);
        console.log('calculatedEdges', calculatedEdges);
        getLayoutedElements(transformedNodes, calculatedEdges).then(({ nodes, edges }) => {
          setNodes(nodes);
          setEdges(edges);
        });
    })
  }, []);
  return (
    <div style={{ height: "100vh", width: "100vw", zIndex: 10 }}>
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
