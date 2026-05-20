import { Box } from "@chakra-ui/react";
import CachedImage from "../../components/CachedImage";
import { VIOLET } from "../../theme/colors";

interface DailyMissionCheckboxProps {
  completed: boolean;
}

export const DailyMissionCheckbox = ({
  completed,
}: DailyMissionCheckboxProps) => {
  return (
    <Box
      position="relative"
      w={{ base: "24px", sm: "30px" }}
      h={{ base: "24px", sm: "30px" }}
      flexShrink={0}
      border="2px solid white"
      borderRadius={{base: "10px", sm: "13px"}}
      backgroundColor={completed ? VIOLET : "transparent"}
      boxShadow={
        completed
          ? `0 0 12px ${VIOLET}, inset 0 0 8px rgba(255,255,255,0.25)`
          : "none"
      }
    >
      {completed && (
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
      )}
    </Box>
  );
};
