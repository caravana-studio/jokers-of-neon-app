import { Box, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Handle, Position } from "reactflow";
import CachedImage from "../../../components/CachedImage";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useMap } from "../../../providers/MapProvider";
import { useGameStore } from "../../../state/useGameStore";
import { BLUE } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { TooltipContent } from "../TooltipContent";
import { NodeType } from "../types";

const RageNode = ({ data }: any) => {
  const { t } = useTranslation("map", { keyPrefix: "rage" });

  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();
  const navigate = useNavigate();

  const { reachableNodes, setSelectedNodeData, selectedNodeData } = useMap();
  const { isSmallScreen } = useResponsiveValues();

  const { state } = useGameStore();

  const stateInMap = state === GameStateEnum.Map;
  const reachable = reachableNodes.includes(data.id.toString()) && stateInMap;
  const [isHovered, setIsHovered] = useState(false);

  const title = `${t("name", { round: data.rageData.round })} - ${t(data.last ? "final" : "intermediate")}`;
  const content = `${t("power", { power: data.rageData.power })}`;

  return (
    <Tooltip
      label={<TooltipContent title={title} content={content} />}
      boxShadow={"0px 0px 15px 0px #fff, 0px 0px 5px 0px #fff inset"}
      w="1100px"
      placement="right"
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
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
              title,
              content,
              nodeType: NodeType.RAGE,
            });
          if (data.current && !stateInMap) {
            navigate("/demo");
          } else if (stateInMap && reachable && !isSmallScreen) {
            advanceNode(gameId, data.id).then((response) => {
              if (response) {
                navigate("/demo");
              }
            });
          }
        }}
      >
        {data.current && (
          <Box
            position="absolute"
            width="90%"
            height="90%"
            borderRadius="full"
            boxShadow={`0px 0px 18px 6px ${BLUE}`}
            zIndex={0}
          />
        )}

        <Box zIndex={1}>
          <CachedImage
            src={`/map/icons/rage/${data.last ? "final" : "intermediate"}-${stateInMap && reachable ? "violet" : data.visited || data.current ? "blue" : "off"}${data.current || (isHovered && (data.visited || reachable)) ? "-bordered" : ""}.png`}
            alt="rage"
          />
        </Box>
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
