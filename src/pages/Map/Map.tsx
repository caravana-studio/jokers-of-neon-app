import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";
import EmojiNode from "./nodes/EmojiNode";

import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "../../providers/MapProvider";
import RageNode from "./nodes/RageNode";
import RoundNode from "./nodes/RoundNode";
import RewardNode from "./nodes/StoreNode";
import { NodeType } from "./types";

export const Map = () => {
  const { t } = useTranslation("map");
  const { nodes, edges, fitViewToCurrentNode, fitViewToFullMap, layoutReady } =
    useMap();

  useEffect(() => {
    if (layoutReady && nodes.length > 0) {
      const timeout1 = setTimeout(() => {
        fitViewToFullMap();
      }, 400);

      const timeout2 = setTimeout(() => {
        fitViewToCurrentNode();
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
        zoomOnScroll={true}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Controls showInteractive={false} />
      </ReactFlow>

      <Button
        sx={{ position: "absolute", bottom: "30px", right: "80px" }}
        onClick={() => fitViewToCurrentNode()}
        size="sm"
      >
        {t("go-to-current-node")}
      </Button>
    </div>
  );
};
