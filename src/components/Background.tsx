import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface BackgroundProps extends PropsWithChildren {
  type?: "game" | "store" | "home";
  dark?: boolean;
}

export const Background = ({
  children,
  type = "game",
  dark = false,
}: BackgroundProps) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(bg/${type}-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        boxShadow: dark ? "inset 0 0 0 1000px rgba(0,0,0,.4)" : "none",
      }}
    >
      {children}
    </Box>
  );
};
