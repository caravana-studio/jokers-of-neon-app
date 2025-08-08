import { Box, Flex, Heading } from "@chakra-ui/react";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";

export const MyCollectionPage = () => {
  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex h="100%" w="100%" my="30px" flexDir="column" justifyContent="space-between" alignItems="center">
        <Heading variant={'italic'}>My Collection</Heading>
        <Heading sx={{letterSpacing: '5px', wordSpacing: '5px'}}>Coming Soon</Heading>
        <Box h="50px" />
      </Flex>
    </DelayedLoading>
  );
};
