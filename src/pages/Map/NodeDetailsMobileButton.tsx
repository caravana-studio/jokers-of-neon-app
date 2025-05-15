import { Flex, Heading, Text } from "@chakra-ui/react";
import { useMap } from "../../providers/MapProvider";

export const NodeDetailsMobileButton = () => {
  const { selectedNodeData } = useMap();

  return (
    <Flex
      position="absolute"
      bottom={'80px'}
      left={5}
      zIndex={100}
      width="280px"
      backgroundColor="black"
      borderRadius="10px"
      padding="7px 20px"
      gap={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      boxShadow={"0px 0px 10px 0px #fff, 0px 0px 5px 0px #fff inset"}
    >
      <Flex flexDirection="column" gap={1}>
        <Heading fontSize="12px">{selectedNodeData?.title}</Heading>
        {selectedNodeData?.content && (
          <Text color="lightViolet" fontSize="14px" lineHeight={1.2}>
            {selectedNodeData.content}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
