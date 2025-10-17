import { Box, Flex, Heading } from "@chakra-ui/react";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Clock } from "../../components/Clock";

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
    >
        <Flex w="50%" bgColor={'red'} flexWrap="nowrap" overflowX="visible" gap={2} position="relative">
            <Flex position="absolute" w="250px" gap={3}>
            <Heading size="sm" variant="italic" textOverflow={"initial"} whiteSpace={"nowrap"} wordBreak={"keep-all"} >SEASON 1</Heading>
            <Box>
            <Clock date={new Date()} />
            </Box>

            </Flex>
        </Flex>
        <Flex w="50%" bgColor="blue">

        </Flex>
    </Flex>
  );
};
