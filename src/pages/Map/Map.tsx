import ReactFlow, { Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { useEffect, useState } from "react";
import { getMap } from "../../dojo/queries/getMap";
import { useDojo } from "../../dojo/useDojo";
import { getLayoutedElements } from "./layout";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
import { NodeData, NodeType } from "./types";

const calculateEdges = (nodes: NodeData[]) => {
  const edges: Edge[] = [];
  nodes.forEach((node) => {
    node.children.forEach((childId) => {
      edges.push({
        id: node.id + "-" + childId,
        source: node.id.toString(),
        target: childId.toString(),
        type: "straight",
      });
    });
  });

  return edges;
};

export const Map = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const {
    setup: { client },
  } = useDojo();

  useEffect(() => {
    getMap(client, 1, 1).then((dataNodes) => {
      const transformedNodes = dataNodes.map((node) => {
        return {
          id: node.id.toString(),
          type: node.nodeType ?? NodeType.NONE,
          position: { x: 0, y: 0 },
          data: {
            visited: node.visited,
            id: node.id,
            current: node.current,
          },
        };
      });
      const calculatedEdges = calculateEdges(dataNodes);
      getLayoutedElements(transformedNodes, calculatedEdges).then(
        ({ nodes, edges }) => {
          setNodes(nodes);
          setEdges(edges);
        }
      );
    });
  }, []);
  return (
    <div style={{ height: "100vh", width: "100vw", zIndex: 10 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          [NodeType.NONE]: EmojiNode,
          [NodeType.RAGE]: RageNode,
          [NodeType.STORE]: RewardNode,
          [NodeType.ROUND]: RoundNode,
        }}
        fitView
        panOnScroll={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};
