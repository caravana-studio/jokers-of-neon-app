import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { isMobile } from "react-device-detect";

interface BackgroundProps extends PropsWithChildren {
  type?: "game" | "store" | "home";
  dark?: boolean;
  scrollOnMobile?: boolean;
}

export const Background = ({
  children,
  type = "game",
  dark = false,
  scrollOnMobile = false,
}: BackgroundProps) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(bg/${type}-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100svh",
        width: "100vw",
        position: isMobile && !scrollOnMobile ? "fixed" : "unset",
        bottom: isMobile && !scrollOnMobile ? 0 : "unset",
        boxShadow: dark ? "inset 0 0 0 1000px rgba(0,0,0,.4)" : "none",
      }}
    >
      {children}
    </Box>
  );
};
