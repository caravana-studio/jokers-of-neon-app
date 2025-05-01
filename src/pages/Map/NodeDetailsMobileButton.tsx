import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useShopActions } from "../../dojo/useShopActions";
import { useGameContext } from "../../providers/GameProvider";
import { useMap } from "../../providers/MapProvider";
import { NodeType } from "./types";

export const NodeDetailsMobileButton = () => {
  const { selectedNodeData, reachableNodes } = useMap();
  const navigate = useNavigate();
  const { t } = useTranslation("map");
  const { advanceNode } = useShopActions();
  const { gameId } = useGameContext();

  const handleGoClick = () => {
    selectedNodeData &&
      advanceNode(gameId, selectedNodeData.id).then((response) => {
        if (response) {
          switch (selectedNodeData?.nodeType) {
            case NodeType.RAGE:
              navigate("/redirect/demo");
              break;
            case NodeType.ROUND:
              navigate("/redirect/demo");
              break;
            case NodeType.STORE:
              navigate("/redirect/store");
              break;
            default:
              break;
          }
        }
      });
  };

  const isReachable = reachableNodes.includes(
    selectedNodeData?.id?.toString() ?? ""
  );

  return (
    <Flex
      position="absolute"
      bottom={4}
      right={4}
      zIndex={100}
      width="70%"
      backgroundColor="black"
      borderRadius="15px"
      padding="7px 20px"
      gap={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      boxShadow={"0px 0px 10px 0px #fff"}
    >
      <Flex flexDirection="column" gap={1}>
        <Heading size="sm">{selectedNodeData?.title}</Heading>
        {selectedNodeData?.content && (
          <Text fontSize="13px" lineHeight={1.2}>
            {selectedNodeData.content}
          </Text>
        )}
      </Flex>
      {isReachable && (
        <Button w="50px" size="md" onClick={handleGoClick}>
          {t("go")}
        </Button>
      )}
    </Flex>
  );
};
