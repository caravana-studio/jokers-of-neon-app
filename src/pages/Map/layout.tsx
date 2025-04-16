import ELK from "elkjs/lib/elk.bundled.js";
import { Edge, Node } from "reactflow";
const elk = new ELK();

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "60",
  "elk.layered.spacing.nodeNodeBetweenLayers": "80",
  // "elk.layered.edgeRouting": "ORTHOGONAL",
  "elk.layered.nodeAlignment.default": "CENTER", 
  // "elk.layered.cycleBreaking.strategy": "DFS", 
  // "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF", 
};

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((node) => ({
      id: node.id ?? "",
      width: 80,
      height: 80,
    })),
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
