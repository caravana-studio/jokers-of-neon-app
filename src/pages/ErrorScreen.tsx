import { Box, Heading } from "@chakra-ui/react";

export const ErrorScreen = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading size="lg">error loading game</Heading>
    </Box>
  );
};
