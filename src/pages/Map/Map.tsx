import ReactFlow, { Controls, Edge, Node, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getMap } from "../../dojo/queries/getMap";
import { useGame } from "../../dojo/queries/useGame";
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
  const [layoutReady, setLayoutReady] = useState(false);

  const {
    setup: { client },
  } = useDojo();

  const reactFlowInstance = useReactFlow();

  const game = useGame();

  useEffect(() => {
    getMap(client, game?.id ?? 1, game?.level ?? 1).then((dataNodes) => {
      const transformedNodes = dataNodes.map((node) => ({
        id: node.id.toString(),
        type: node.nodeType ?? NodeType.NONE,
        position: { x: 0, y: 0 },
        data: {
          visited: node.visited,
          id: node.id,
          current: node.current,
        },
      }));

      const calculatedEdges = calculateEdges(dataNodes);

      getLayoutedElements(transformedNodes, calculatedEdges).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          setLayoutReady(true);
        }
      );
    });
  }, []);

  const fitView = () => {
    const currentNode = nodes.find((n) => n.data?.current) ?? nodes[0];
    reactFlowInstance.fitView({
      nodes: [currentNode],
      padding: 0.1,
      duration: 600,
    });
  };

  useEffect(() => {
    if (layoutReady && nodes.length > 0) {
      const timeout1 = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
      }, 400);

      const timeout2 = setTimeout(() => {
        fitView();
      }, 1000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [layoutReady, nodes]);

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
        panOnScroll={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Controls />
      </ReactFlow>

      <Button sx={{ transform: "translateY(-50px)" }} onClick={() => fitView()}>
        fit view
      </Button>
    </div>
  );
};
