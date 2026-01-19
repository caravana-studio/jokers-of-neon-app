import { Flex } from "@chakra-ui/react";
import Galaxy from "./Galaxy";
import { galaxyIntensityConfigs } from "./config";

import { Intensity } from "../../../types/intensity";

interface GalaxyBackgroundProps {
  opacity?: number;
  intensity?: Intensity;
}

export const GalaxyBackground = ({
  opacity = 1,
  intensity = Intensity.MEDIUM,
}: GalaxyBackgroundProps) => {
  return (
    <Flex
      opacity={opacity}
      transition="opacity 2s ease"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1}
      pointerEvents="none"
      backgroundColor="black"
    >
      <Galaxy
        mouseRepulsion={false}
        mouseInteraction={false}
        {...galaxyIntensityConfigs[intensity]}
      />
    </Flex>
  );
};
