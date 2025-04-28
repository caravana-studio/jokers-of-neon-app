import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import { getMap } from "../dojo/queries/getMap";
import { useGame } from "../dojo/queries/useGame";
import { useDojo } from "../dojo/useDojo";
import { getLayoutedElements } from "../pages/Map/layout";
import { NodeData, NodeType } from "../pages/Map/types";
import { getRageNodeData } from "../utils/getRageNodeData";

interface MapContextType {
  nodes: Node[];
  edges: Edge[];
  fitViewToCurrentNode: () => void;
  fitViewToFullMap: () => void;
  currentNode: Node | undefined;
  layoutReady: boolean;
  reachableNodes: string[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

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

export const MapProvider = ({ children }: MapProviderProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [layoutReady, setLayoutReady] = useState(false);

  const currentNode = useMemo(
    () => nodes.find((n) => n.data?.current) ?? nodes[0],
    [nodes]
  );

  const reachableNodes = useMemo(() => {
    return currentNode && edges
      ? edges
          .filter((edge) => edge.target === currentNode.id)
          .map((edge) => edge.source)
      : [];
  }, [edges, currentNode?.id]);

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
          shopId: node.nodeType === NodeType.STORE ? node.data : undefined,
          round: node.nodeType === NodeType.ROUND ? node.data : undefined,
          rageData:
            node.nodeType === NodeType.RAGE
              ? getRageNodeData(node.data)
              : undefined,
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

  const fitViewToCurrentNode = () => {
    reactFlowInstance.fitView({
      nodes: [
        currentNode,
        ...reachableNodes.map((id) => ({
          id,
        })),
      ],
      padding: 0.1,
      duration: 600,
    });
  };

  const fitViewToFullMap = () => {
    reactFlowInstance.fitView({ padding: 0.1 });
  };

  return (
    <MapContext.Provider
      value={{
        nodes,
        edges,
        fitViewToCurrentNode,
        fitViewToFullMap,
        currentNode,
        layoutReady,
        reachableNodes,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
