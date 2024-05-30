import { Box } from "@chakra-ui/react";

export const PoweredBy = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        zIndex: 1000,
        color: "white",
        fontFamily: "Sys",
        fontSize: 17,
        filter: "blur(1px)",
        opacity: 0.7,
      }}
    >
      powered by Dojo and Starknet
    </Box>
  );
};
