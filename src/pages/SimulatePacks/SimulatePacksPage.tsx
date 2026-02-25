import { Box, Flex, Heading } from "@chakra-ui/react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SimulatePackRow } from "./SimulatePackRow";

const PACK_IDS = [1, 2, 3, 4, 5, 6, 21, 22, 23, 24, 25, 26];

export const SimulatePacksPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration fadeToBlack />
      <Flex
        flexDir={"column"}
        w="100%"
        h="100%"
        overflowY={"auto"}
        overflowX={"hidden"}
      >
        <Flex
          w="100%"
          borderBottom={`1px solid ${BLUE}`}
          height={isSmallScreen ? "60px" : "140px"}
          pt={isSmallScreen ? "25px" : "70px"}
          px={isSmallScreen ? "15px" : "30px"}
          pb={3}
        >
          <Heading
            zIndex={10}
            fontSize={isSmallScreen ? "sm" : "lg"}
            variant="italic"
          >
            Simulate Packs
          </Heading>
        </Flex>
        <Box>
          {PACK_IDS.map((packId) => (
            <SimulatePackRow key={packId} packId={packId} />
          ))}
        </Box>
      </Flex>
    </DelayedLoading>
  );
};
