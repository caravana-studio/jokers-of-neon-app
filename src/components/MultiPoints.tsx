import { Box, Heading, useTheme } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { RollingNumber } from "./RollingNumber";

export const MultiPoints = () => {
  const { points, multi } = useGameContext();
  return (
    <Box
      gap={{ base: 1, md: 2 }}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <PointBox type="points">
        <Heading size="s">POINTS</Heading>
        <Heading size="m">
          <RollingNumber n={points} />
        </Heading>
      </PointBox>
      <Heading size="s">x</Heading>
      <PointBox type="multi">
        <Heading size="s">MULTI</Heading>
        <Heading size="m">
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
      height={{ base: 35, md: 81 }}
      minWidth={{ base: 75, md: 140 }}
      p={{ base: 1, md: 2 }}
      sx={{
        border: `2px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: `0px 0px 17px 7px ${color} `,
        textShadow: `0 0 5px ${color}`,
        borderRadius: 20,
      }}
    >
      {children}
    </Box>
  );
};
