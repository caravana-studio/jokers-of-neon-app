import { Flex } from "@chakra-ui/react";
import { Map } from "./Map";

export const MapPage = () => {
  return (
    <Flex
      height="100%"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Map />
    </Flex>
  );
};
