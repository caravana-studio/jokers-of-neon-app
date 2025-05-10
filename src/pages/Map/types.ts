export enum NodeType {
    NONE = "NONE",
    RAGE = "RAGE",
    REWARD = "REWARD",
    ROUND = "ROUND",
    STORE = "STORE",
    CHALLENGE = "CHALLENGE",
}

export interface NodeData {
    id: number;
    nodeType: NodeType;
    data: number;
    children: number[];
    visited: boolean;
    current?: boolean;
    last?: boolean;
}
