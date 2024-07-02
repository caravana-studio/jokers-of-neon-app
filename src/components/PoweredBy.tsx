import { Box, Heading } from "@chakra-ui/react";

export const PoweredBy = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        zIndex: 1000,
        color: "white",
        filter: "blur(0.5px)",
        opacity: 0.7,
      }}
    >
      <Heading size="s">powered by Dojo and Starknet</Heading>
    </Box>
  );
};
