import { Box, Heading } from "@chakra-ui/react";

interface MultiPointsProps {
  multi: number;
  points: number;
}

export const MultiPoints = ({ multi, points }: MultiPointsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <PointBox>
        <Heading>POINTS</Heading>
        <Heading sx={{fontSize: 40}}>{points}</Heading>
      </PointBox>
      <Heading sx={{fontSize: 25}}>x</Heading>
      <PointBox>
        <Heading>MULTI</Heading>
        <Heading sx={{fontSize: 40}}>{multi}</Heading>
      </PointBox>
    </Box>
  );
};

interface PointBoxProps {
  children: JSX.Element[];
}
export const PointBox = ({ children }: PointBoxProps) => {
  return (
    <Box
      sx={{
        border: "2px solid white",
        p: 2,
        width: 150,
        height: 100,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {children}
    </Box>
  );
};
