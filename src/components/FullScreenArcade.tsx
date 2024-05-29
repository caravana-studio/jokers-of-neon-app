import { Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export const FullScreenArcade = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        backgroundImage: "url(arcade-neon.gif)",
        boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.3)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        imageRendering: "pixelated !important",
        fontFamily: "Sys",
        pointerEvents: "all",
        color: "#FFF",
      }}
    >
      {children}
    </Box>
  );
};
