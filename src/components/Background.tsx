import { Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

interface BackgroundProps  extends PropsWithChildren {
  type?: 'game' | 'store' | 'home'
}

export const Background = ({ children, type = 'game' }: BackgroundProps) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${type}-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      {children}
    </Box>
  );
};
