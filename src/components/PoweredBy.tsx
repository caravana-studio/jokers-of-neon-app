import { Box, Text } from "@chakra-ui/react";

export const PoweredBy = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "8vh",
        zIndex: 1000,
        color: "white",
        filter: "blur(0.5px)",
        opacity: 0.7,
        letterSpacing: "0.25em",
        maxW: "70%"
      }}
    >
      <Text textAlign="center" fontFamily="Orbitron">powered by Dojo and Starknet</Text>
    </Box>
  );
};
