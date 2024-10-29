import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { LS_GREEN } from "../../theme/colors";

export const Obstacle: React.FC = () => {
  return (
    <Box width="100%" maxWidth="400px">
      <Text
        fontFamily="Jersey"
        color={LS_GREEN}
        fontSize={"3.5rem"}
        textShadow={`5px 5px 40px ${LS_GREEN} `}
      >
        OBSTACLE
      </Text>
      <Flex direction="column" alignItems="start" gap={4}>
        <Flex alignItems="center">
          <Box as="span" mr={2}>
            &#9744;
          </Box>
          <Text>Play one straight hand.</Text>
        </Flex>
        <Flex alignItems="center">
          <Box as="span" mr={2}>
            &#9744;
          </Box>
          <Text>Do not use Jokers.</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
