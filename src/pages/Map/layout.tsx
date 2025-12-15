import ELK from "elkjs/lib/elk.bundled.js";
import { Edge, Node } from "reactflow";
import { NodeType } from "./types";
const elk = new ELK();

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "80",
  "elk.layered.spacing.nodeNodeBetweenLayers": "60",
  // "elk.layered.edgeRouting": "ORTHOGONAL",
  "elk.layered.nodeAlignment.default": "CENTER", 
  // "elk.layered.cycleBreaking.strategy": "DFS", 
  // "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF", 
};

const getNodeDimensions = (node: Node) => {
  const data = node.data as {
    last?: boolean;
    visited?: boolean;
    isBossLevel?: boolean;
  };

  if (node.type === NodeType.RAGE) {
    const isFinalRage = Boolean(data?.last);
    const isVisited = Boolean(data?.visited);

    if (isFinalRage && !isVisited) {
      const size = data?.isBossLevel ? 180 : 120;
      return { width: size, height: size };
    }

    if (isFinalRage) {
      return { width: 50, height: 50 };
    }

    return { width: 70, height: 70 };
  }

  if (
    node.type === NodeType.ROUND ||
    node.type === NodeType.CHALLENGE ||
    node.type === NodeType.STORE ||
    node.type === NodeType.REWARD ||
    node.type === NodeType.NONE
  ) {
    return { width: 50, height: 50 };
  }

  return { width: 60, height: 60 };
};

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((node) => {
      const { width, height } = getNodeDimensions(node);
      return {
        id: node.id ?? "",
        width,
        height,
      };
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
