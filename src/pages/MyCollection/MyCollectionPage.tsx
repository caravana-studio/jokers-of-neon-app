
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { COLLECTIONS } from "./mocks";
import CollectionGrid from "./Collection";

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
        <Heading size="sm" variant={"italic"}>
          My Collection
        </Heading>
        <Divider my={3} borderColor={BLUE} />
        <Flex w="100%" h="100%" minH={0} flexGrow={1} flexDir="column" gap={4} overflowY="auto">
          {COLLECTIONS.map((collection) => (
            <CollectionGrid key={collection.id} collection={collection} />
          ))}
          
        </Flex>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
