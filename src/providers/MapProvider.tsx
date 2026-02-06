import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import { BOSS_LEVEL } from "../constants/general";
import { getMap } from "../dojo/queries/getMap";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { getLayoutedElements } from "../pages/Map/layout";
import { NodeData, NodeType } from "../pages/Map/types";
import { useGameStore } from "../state/useGameStore";
import { BLUE, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { getRageNodeData } from "../utils/getRageNodeData";

export interface SelectedNodeData {
  id: number;
  title: string;
  content?: string;
  nodeType: NodeType;
  shopId?: number;
}

interface MapContextType {
  nodes: Node[];
  edges: Edge[];
  fitViewToCurrentNode: () => void;
  fitViewToFullMap: () => void;
  fitViewToNode: (nodeId: string) => void;
  currentNode: Node | undefined;
  layoutReady: boolean;
  reachableNodes: string[];
  selectedNodeData: SelectedNodeData | undefined;
  setSelectedNodeData: (data: SelectedNodeData | undefined) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [baseEdges, setBaseEdges] = useState<Edge[]>([]);
  const [layoutReady, setLayoutReady] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<
    SelectedNodeData | undefined
  >();

  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: { client },
  } = useDojo();

  const reactFlowInstance = useReactFlow();

  const { state, level, id } = useGameStore();
  const isBossLevel = level === BOSS_LEVEL;

  const stateInMap = state === GameStateEnum.Map;

  const currentNode = useMemo(
    () => nodes.find((n) => n.data?.current) ?? nodes[0],
    [nodes]
  );

  const reachableNodeIds = useMemo(() => {
    if (!currentNode || baseEdges.length === 0) return [];
    return baseEdges
      .filter((edge) => edge.target === currentNode.id)
      .map((edge) => edge.source);
  }, [baseEdges, currentNode?.id]);

  // Calculate styled edges derivatively to avoid re-renders from setEdges
  const styledEdges = useMemo(() => {
    if (!currentNode || baseEdges.length === 0) return baseEdges;

    return baseEdges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      const isEdgeToCurrentNode = targetNode?.id === currentNode.id;
      const sourceVisited = Boolean(sourceNode?.data?.visited);
      const targetVisited = Boolean(targetNode?.data?.visited);
      const isCompletedPath = sourceVisited && targetVisited;

      const visibleLine = isCompletedPath || (isEdgeToCurrentNode && stateInMap);
      const shouldPulse = !isCompletedPath && visibleLine;

      return {
        ...edge,
        data: {
          ...edge.data,
          shouldPulse,
        },
        style: {
          stroke: visibleLine ? (shouldPulse ? VIOLET_LIGHT : BLUE) : "#fff",
          strokeWidth: 2,
          strokeDasharray: visibleLine ? undefined : "5 5",
          opacity: visibleLine ? 1 : 0.12,
        },
      };
    });
  }, [baseEdges, currentNode, nodes, stateInMap, reachableNodeIds]);

  const reachableNodes = reachableNodeIds;

  useEffect(() => {
    getMap(client, id).then((dataNodes) => {
      const transformedNodes = dataNodes.map((node, index) => {
        const isFirstNode = index === 0;
        const shouldBeFinalRage = isFirstNode && level >= 2;

        const nodeType = shouldBeFinalRage
          ? NodeType.RAGE
          : node.nodeType ?? NodeType.NONE;

        return {
          id: node.id.toString(),
          type: nodeType,
          position: { x: 0, y: 0 },
          data: {
            visited: node.visited,
            id: node.id,
            current: node.current,
            shopId: node.nodeType === NodeType.STORE ? node.data : undefined,
            round: node.nodeType === NodeType.ROUND ? node.data : undefined,
            last: shouldBeFinalRage ? true : node.last,
            rageData:
              nodeType === NodeType.RAGE
                ? getRageNodeData(node.data)
                : undefined,
            isBossLevel,
            isFirstNode,
          },
        };
      });

      const calculatedEdges = calculateEdges(dataNodes);

      getLayoutedElements(transformedNodes, calculatedEdges).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setBaseEdges(layoutedEdges);
          setLayoutReady(true);
        }
      );
    });
  }, []);


  const calculateEdges = (nodes: NodeData[]): Edge[] => {
    const edges: Edge[] = [];
    nodes.forEach((node) => {
      node.children.forEach((childId) => {
        edges.push({
          id: node.id + "-" + childId,
          source: node.id.toString(),
          target: childId.toString(),
          type: "map",
          style: {
            stroke: "#fff",
            opacity: 0.2,
          },
        });
      });
    });

    return edges;
  };

  const fitViewToCurrentNode = () => {
    reactFlowInstance.fitView({
      nodes: [
        currentNode,
        ...reachableNodes.map((id) => ({
          id,
        })),
      ],
      padding: 0.2,
      duration: 750,
      maxZoom: isSmallScreen ? 0.84 : 1.44,
    });
  };

  const fitViewToFullMap = () => {
    reactFlowInstance.fitView({ padding: 0.2 });
  };

  const fitViewToNode = (nodeId: string) => {
    reactFlowInstance.fitView({
      nodes: [{ id: nodeId }],
      padding: 0.3,
      duration: 3500,
      maxZoom: 3,
    });
  };

  return (
    <MapContext.Provider
      value={{
        nodes,
        edges: styledEdges,
        fitViewToCurrentNode,
        fitViewToFullMap,
        fitViewToNode,
        currentNode,
        layoutReady,
        reachableNodes,
        selectedNodeData,
        setSelectedNodeData,
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
