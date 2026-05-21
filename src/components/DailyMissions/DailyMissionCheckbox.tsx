import { Box, Text, type BoxProps } from "@chakra-ui/react";
import CachedImage from "../../components/CachedImage";
import { VIOLET } from "../../theme/colors";

interface DailyMissionCheckboxProps {
  completed: boolean;
  label?: string;
  size?: BoxProps["w"];
  borderRadius?: BoxProps["borderRadius"];
  fontSize?: BoxProps["fontSize"];
}

export const DailyMissionCheckbox = ({
  completed,
  label,
  size = { base: "24px", sm: "30px" },
  borderRadius = { base: "10px", sm: "13px" },
  fontSize = { base: "10px", sm: "12px" },
}: DailyMissionCheckboxProps) => {
  return (
    <Box
      position="relative"
      w={size}
      h={size}
      flexShrink={0}
      border="2px solid white"
      borderRadius={borderRadius}
      backgroundColor={completed ? VIOLET : "transparent"}
      boxShadow={
        completed
          ? `0 0 12px ${VIOLET}, inset 0 0 8px rgba(255,255,255,0.25)`
          : "none"
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {completed ? (
        <CachedImage
          src="/check.png"
          alt="Completed mission"
          position="absolute"
          top="40%"
          left="65%"
          transform="translate(-50%, -50%)"
          w="100%"
          h="auto"
          objectFit="contain"
          pointerEvents="none"
          zIndex={1}
          filter="drop-shadow(0 0 3px rgba(255,255,255,0.95))"
        />
      ) : (
        label && (
          <Text
            fontFamily="Orbitron"
            fontSize={fontSize}
            lineHeight={1}
            color="white"
            textShadow="0 0 8px rgba(0,0,0,0.85)"
          >
            {label}
          </Text>
        )
      )}
    </Box>
  );
};
