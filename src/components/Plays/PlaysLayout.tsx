import {
  Box,
  Heading
} from "@chakra-ui/react";
import { PlaysTable } from "./PlaysTable";

export const PlaysLayout = () => {
  return (
    <Box backgroundColor="darkGrey" py={4} px={8}>
      <Heading size="l" color="aqua" textAlign={"center"}>
        AVAILABLE PLAYS
      </Heading>

      <PlaysTable />
    </Box>
  );
};
