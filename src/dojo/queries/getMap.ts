import { NodeData, NodeType } from "../../pages/Map/types";

interface NodeTypeCairo {
  None: any;
  Rage: any;
  Reward: any;
  Round: any;
  Store: any;
}

interface MapTxResult {
  level_nodes: Array<
    Array<{
      0: {
        id: number;
        node_type: {
          variant: NodeTypeCairo;
        };
        data: number;
      };
      1: {
        node_id: number;
        childs: Array<number>;
      };
    }>
  >;
  traveled_nodes: Array<number>;
}

const getNodeType = (nodeType: NodeTypeCairo) => {
  if (nodeType.Rage !== undefined) {
    return NodeType.RAGE;
  } else if (nodeType.Reward !== undefined) {
    return NodeType.REWARD;
  } else if (nodeType.Round !== undefined) {
    return NodeType.ROUND;
  } else if (nodeType.Store !== undefined) {
    return NodeType.STORE;
  } else {
    return NodeType.NONE;
  }
};

export const getMap = async (
  client: any,
  gameId: number,
  level: number
): Promise<NodeData[]> => {
  try {
    let tx_result: MapTxResult = await client.map_system.getLevelMap(
      gameId,
      level
    );

    console.log("map", tx_result);

    const lastVisitedNode =
      tx_result.traveled_nodes[tx_result.traveled_nodes.length - 1];
    const flatNodes = tx_result.level_nodes.flatMap((subArray) => subArray);

    const nodes = flatNodes.map((node) => {
      const id = Number(node[0].id);
      return {
        id,
        nodeType: getNodeType(node[0].node_type.variant),
        data: Number(node[0].data),
        children: node[1].childs.map((childId) => Number(childId)),
        visited: tx_result.traveled_nodes.includes(node[0].id),
        current: node[0].id === lastVisitedNode,
      };
    });

    return nodes;
  } catch (e) {
    console.log(e);
    return [];
  }
};
