import { Flex, Heading, Text } from "@chakra-ui/react";
import { useMap } from "../../providers/MapProvider";

export const NodeDetailsMobileButton = () => {
  const { selectedNodeData } = useMap();

  return (
    <Flex
      position="absolute"
      top={'30px'}
      right={3}
      zIndex={100}
      width="250px"
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
    </Flex>
  );
};
