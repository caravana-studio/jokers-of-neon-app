import { Box, Heading, useTheme } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";

export const MultiPoints = () => {
  const { points, multi } = useGameContext();
  return (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <PointBox type="points">
        <Heading size="s">POINTS</Heading>
        <Heading size="l" sx={{ color: "neonGreen" }}>
          <RollingNumber n={points} />
        </Heading>
      </PointBox>
      <Heading sx={{ fontSize: 25 }}>x</Heading>
      <PointBox type="multi">
        <Heading size="s">MULTI</Heading>
        <Heading size="l" sx={{ color: "neonPink" }}>
          <RollingNumber n={multi} />
        </Heading>
      </PointBox>
    </Box>
  );
};

interface PointBoxProps {
  children: JSX.Element[];
  type: "points" | "multi" | "level";
}

export const PointBox = ({ children, type }: PointBoxProps) => {
  const { colors } = useTheme();
  const colorMap = {
    points: colors.neonGreen,
    multi: colors.neonPink,
    level: "#FFF",
  };

  const color = colorMap[type];
  return (
    <Box
      height={{ base: 65, md: 100 }}
      minWidth={type === "level" ? { base: 50, md: 100 } : { base: 85, md: 150 }}
      sx={{
        border: `2px solid ${color}`,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: `0px 0px 15px 0px ${color} `,
        textShadow: `0 0 5px ${color}`,
      }}
    >
      {children}
    </Box>
  );
};
