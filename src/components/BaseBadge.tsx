import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const ICON_SIZE = {
  sm: 10,
  md: 16,
  lg: 22,
};
export const FONT_SIZE = {
  sm: 12,
  md: 18,
  lg: 26,
};
export const GAP = {
  sm: 1,
  md: 1.5,
  lg: 2,
};
export const PADDING = {
  sm: "0 3px",
  md: "1px 8px",
  lg: "1px 10px",
};
export const ICON_MT = {
  sm: 0.5,
  md: 0.5,
  lg: 1,
};
export const MARGIN = {
  sm: 0.5,
  md: 1,
  lg: 2,
};

interface BaseBadgeProps extends BoxProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  background?: string;
  opacity?: number;
}

export const BaseBadge: React.FC<BaseBadgeProps> = ({
  children,
  size = "md",
  background,
  opacity = 1,
  ...props
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: MARGIN[size],
        right: MARGIN[size],
        zIndex: 10,
        opacity,
        padding: PADDING[size],
        background,
        borderRadius: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        direction: "row",
        gap: GAP[size],
      }}
      transform={"scale(0.8) translateZ(60px);"}
      {...props}
    >
      {children}
    </Box>
  );
};
