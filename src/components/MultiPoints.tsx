import { Box, Heading } from "@chakra-ui/react";
import { RollingNumber } from "./RollingNumber";

interface MultiPointsProps {
  multi: number;
  points: number;
}

export const MultiPoints = ({ multi, points }: MultiPointsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <PointBox type="points">
        <Heading>POINTS</Heading>
        <Heading sx={{ fontSize: 40, color: "#33effa" }}>
          <RollingNumber n={points} />
        </Heading>
      </PointBox>
      <Heading sx={{ fontSize: 25 }}>x</Heading>
      <PointBox type="multi">
        <Heading>MULTI</Heading>
        <Heading sx={{ fontSize: 40, color: "#fd4bad" }}>
          {multi}
        </Heading>
      </PointBox>
    </Box>
  );
};

interface PointBoxProps {
  children: JSX.Element[];
  type: "points" | "multi";
}
export const PointBox = ({ children, type }: PointBoxProps) => {
  const color = type === "points" ? "#33effa" : "#fd4bad";
  return (
    <Box
      sx={{
        border: `2px solid ${color}`,
        p: 2,
        width: 150,
        height: 100,
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
