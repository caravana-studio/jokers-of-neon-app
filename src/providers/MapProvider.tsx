import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import { isMockGameApiMode } from "../config/gameMode";
import { BOSS_LEVEL } from "../constants/general";
import { getMap } from "../dojo/queries/getMap";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { getLayoutedElements } from "../pages/Map/layout";
import { NodeData, NodeType } from "../pages/Map/types";
import { useRoguelikeRuntimeStore } from "../state/roguelike/useRoguelikeRuntimeStore";
import { useGameStore } from "../state/useGameStore";
import { useMapNavigationStore } from "../state/useMapNavigationStore";
import { BLUE, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { getRageNodeData } from "../utils/getRageNodeData";

export interface SelectedNodeData {
  id: number;
  title: string;
  content?: string;
  nodeType: NodeType;
  shopId?: number;
  optionId?: string;
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

type MapSourceNode = NodeData & { optionId?: string };

const mapOptionTypeToNodeType = (type: "ROUND" | "STORE" | "RAGE"): NodeType => {
  if (type === "STORE") {
    return NodeType.STORE;
  }

  if (type === "RAGE") {
    return NodeType.RAGE;
  }

  return NodeType.ROUND;
};

const encodeRageNodeData = (round: number, power: number): number => {
  return round * Math.pow(2, 32) + power;
};

const ROOT_NODE_ID = 1;
const getLaneOptionNodeId = (laneIndex: number, optionIndex: number): number => {
  return 1000 + laneIndex * 100 + optionIndex;
};

const buildMockMapNodes = (): MapSourceNode[] => {
  const runtime = useRoguelikeRuntimeStore.getState();
  const lanes = runtime.mapLanes;
  const currentLaneIndex = runtime.currentMapLaneIndex;

  const rootNode: MapSourceNode = {
    id: ROOT_NODE_ID,
    nodeType: runtime.round % 3 === 0 ? NodeType.RAGE : NodeType.ROUND,
    data:
      runtime.round % 3 === 0
        ? encodeRageNodeData(runtime.round, Math.max(1, runtime.level * 8))
        : runtime.round,
    children: [],
    visited: true,
    current: currentLaneIndex === 0,
    last: false,
  };

  const optionNodes: MapSourceNode[] = [];
  let hasCurrentNode = rootNode.current ?? false;

  lanes.forEach((lane, laneIndex) => {
    const previousNodeIds =
      laneIndex === 0
        ? [ROOT_NODE_ID]
        : (() => {
            const previousLane = lanes[laneIndex - 1];
            const allPreviousIds = previousLane.options.map((_, optionIndex) =>
              getLaneOptionNodeId(laneIndex - 1, optionIndex)
            );

            if (!previousLane.selectedOptionId) {
              return allPreviousIds;
            }

            const selectedPreviousIndex = previousLane.options.findIndex(
              (option) => option.id === previousLane.selectedOptionId
            );

            if (selectedPreviousIndex < 0) {
              return allPreviousIds;
            }

            return [getLaneOptionNodeId(laneIndex - 1, selectedPreviousIndex)];
          })();

    lane.options.forEach((option, optionIndex) => {
      const optionNodeId = getLaneOptionNodeId(laneIndex, optionIndex);
      const isSelected = lane.selectedOptionId === option.id;
      const isCurrent = currentLaneIndex > 0 &&
        laneIndex === currentLaneIndex - 1 &&
        isSelected;

      if (isCurrent) {
        hasCurrentNode = true;
      }

      const targetRound =
        option.targetRound ?? runtime.round + Math.max(1, Math.floor((laneIndex + 1) / 2));
      const targetLevel =
        option.targetLevel ?? Math.max(1, Math.ceil(targetRound / 3));

      optionNodes.push({
        id: optionNodeId,
        nodeType: mapOptionTypeToNodeType(option.type),
        data:
          option.type === "STORE"
            ? option.shopId ?? 1
            : option.type === "RAGE"
              ? encodeRageNodeData(targetRound, Math.max(1, targetLevel * 10))
              : targetRound,
        children: previousNodeIds,
        visited: isSelected,
        current: isCurrent,
        last: option.type === "RAGE",
        optionId: option.id,
      });
    });
  });

  if (!hasCurrentNode) {
    rootNode.current = true;
  }

  return [rootNode, ...optionNodes];
};

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

  const activeNodeId = useMapNavigationStore((s) => s.activeNodeId);

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

      // When a node is actively selected, dim edges to other reachable nodes
      const dimmedBySelection =
        activeNodeId && visibleLine && shouldPulse && edge.source !== activeNodeId;

      return {
        ...edge,
        data: {
          ...edge.data,
          shouldPulse: shouldPulse && !dimmedBySelection,
        },
        style: {
          stroke: visibleLine && !dimmedBySelection
            ? (shouldPulse ? VIOLET_LIGHT : BLUE)
            : "#fff",
          strokeWidth: 2,
          strokeDasharray: visibleLine && !dimmedBySelection ? undefined : "5 5",
          opacity: dimmedBySelection ? 0.12 : visibleLine ? 1 : 0.12,
        },
      };
    });
  }, [baseEdges, currentNode, nodes, stateInMap, reachableNodeIds, activeNodeId]);

  const reachableNodes = reachableNodeIds;

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      const dataNodes: MapSourceNode[] = isMockGameApiMode
        ? buildMockMapNodes()
        : await getMap(client, id);

      const transformedNodes = dataNodes.map((node, index) => {
        const isFirstNode = index === 0;
        const shouldBeFinalRage = !isMockGameApiMode && isFirstNode && level >= 2;

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
            optionId: node.optionId,
            isBossLevel,
            isFirstNode,
          },
        };
      });

      const calculatedEdges = calculateEdges(dataNodes);
      const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(
        transformedNodes,
        calculatedEdges
      );

      if (cancelled) {
        return;
      }

      setNodes(layoutedNodes);
      setBaseEdges(layoutedEdges);
      setLayoutReady(true);
    };

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, [client, id, level, isBossLevel]);

  const calculateEdges = (nodes: Array<{ id: number; children: number[] }>): Edge[] => {
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
      duration: 700,
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
