import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Clock } from "../../components/Clock";
import { BLUE, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SeasonPass } from "../../components/SeasonPass";

export const SeasonProgressionHeader = () => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Flex
      w="100%"
      position="fixed"
      top={0}
      zIndex={1}
      h={isSmallScreen ? "120px" : "200px"}
      borderBottom={`1px solid ${BLUE}`}
      pt={isSmallScreen ? "25px" : "70px"}
      px={isSmallScreen ? "15px" : "30px"}
      pb={3}
      gap={2}
      bgColor="rgba(0,0,0,0.4)"
    >
      <Flex
        w="50%"
        flexWrap="nowrap"
        overflowX="visible"
        gap={2}
        position="relative"
        justifyContent={"center"}
        alignItems="flex-end"
      >
        <Flex position="absolute" w="250px" gap={3} top={0} left={0}>
          <Heading
            size="sm"
            variant="italic"
            textOverflow={"initial"}
            whiteSpace={"nowrap"}
            wordBreak={"keep-all"}
          >
            SEASON 1
          </Heading>
          <Box>
            <Clock date={new Date()} />
          </Box>
        </Flex>
        <Heading mb={3} fontWeight={100} fontSize={11}>FREE REWARDS</Heading>
      </Flex>
      <Flex
        w="50%"
        justifyContent={"center"}
        alignItems="flex-end"
        flexDir={"column"}
      >
        <Flex flexDir="column" textAlign="center" w="90%">
          <Heading size="xs">MORE REWARDS WITH</Heading>
          <Heading fontSize="sm" color={VIOLET_LIGHT}>
            SEASON PASS
          </Heading>
        </Flex>
        <Flex mt={2} justifyContent="center" w="90%">
          <Button w="130px" h="22px" justifyContent={"space-between"}>
            <Flex w="60%">
              <Text textAlign={"center"} w="100%">
                BUY
              </Text>
            </Flex>
            <Box justifyContent="flex-end">
              <SeasonPass rotate="-20deg" />
            </Box>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
