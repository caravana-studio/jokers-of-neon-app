import { Box, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { useGame } from "../../../dojo/queries/useGame";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { NodeType } from "../types";

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });

  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const game = useGame();

  const stateInMap = game?.state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip
      label={`${t("name", { round: data.rageData.round })} ${t("power", { power: data.rageData.power })}`}
      placement="right"
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          /*           background:
            data.current || data.visited
              ? BLUE
              : reachable
                ? VIOLET
                : "rgba(255,255,255,0.1)", */
          width: data.last ? 120 : 70,
          height: data.last ? 120 : 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          color: "white",
          transition: "all 0.2s ease-in-out",
          transform:
            selectedNodeData?.id === data.id || isHovered || data.current
              ? "scale(1.2)"
              : "scale(1)",
          cursor: stateInMap && reachable ? "pointer" : "default",
        }}
        onClick={() => {
          isSmallScreen &&
            setSelectedNodeData({
              id: data.id,
              title: t("name", { round: data.rageData.round }),
              content: t("power", { power: data.rageData.power }),
              nodeType: NodeType.RAGE,
            });
          if (data.current && !stateInMap) {
            navigate("/redirect/demo");
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate("/redirect/demo");
              }
            });
          }
        }}
      >
        <CachedImage
          src={`/map/icons/rage/${data.last ? "final" : "intermediate"}-${stateInMap && reachable ? "violet" : data.visited || data.current ? "blue" : "off"}${data.current || (isHovered && (data.visited || reachable)) ? "-bordered" : ""}.png`}
          alt="rage"
        />
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
      </Box>
    </Tooltip>
  );
};

export default RageNode;
