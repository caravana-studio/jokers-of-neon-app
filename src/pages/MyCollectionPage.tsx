import { Box, Flex, Heading } from "@chakra-ui/react";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const MyCollectionPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt={isSmallScreen ? "30px" : "80px"}
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading variant={"italic"}>My Collection</Heading>
        <Heading sx={{ letterSpacing: "5px", wordSpacing: "5px" }}>
          Coming Soon
        </Heading>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
