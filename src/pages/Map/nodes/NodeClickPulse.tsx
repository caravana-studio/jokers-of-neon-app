import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const clickPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

interface NodeClickPulseProps {
  borderRadius?: string | number;
  width?: string;
  height?: string;
}

export const NodeClickPulse = ({
  borderRadius = 10,
  width = "100%",
  height = "100%"
}: NodeClickPulseProps) => {
  return (
    <Box
      position="absolute"
      width={width}
      height={height}
      borderRadius={borderRadius}
      border="3px solid white"
      sx={{
        animation: `${clickPulse} 0.8s ease-out forwards`,
        pointerEvents: "none",
      }}
    />
  );
};
