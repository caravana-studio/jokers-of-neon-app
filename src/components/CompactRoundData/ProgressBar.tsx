import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBackgroundAnimation } from "../../providers/BackgroundAnimationProvider";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT, VIOLET_LIGHT } from "../../theme/colors";
import { Intensity } from "../../types/intensity";

const BASE_GLOW = { blur: 6, spread: 3 };
const GLOW_LEVELS = {
  none: BASE_GLOW,
  low: { blur: BASE_GLOW.blur * 2, spread: BASE_GLOW.spread * 2 },
  mid: { blur: BASE_GLOW.blur * 4, spread: BASE_GLOW.spread * 4 },
  high: { blur: BASE_GLOW.blur * 8, spread: BASE_GLOW.spread * 8 },
};
const RESET_DELAY_MS = 1200;

interface IProgressBarProps {
  progress: number;
  color?: string;
  animated?: boolean;
  playSound?: () => void;
}
export const ProgressBar = ({
  progress,
  color = BLUE_LIGHT,
  animated = false,
  playSound,
}: IProgressBarProps) => {
  const [barColor, setBarColor] = useState(color);
  const [glowSize, setGlowSize] = useState(BASE_GLOW);
  const prevProgressRef = useRef(progress);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { level } = useGameStore();

  const resetGlow = useCallback(() => {
    setBarColor(color);
    setGlowSize(BASE_GLOW);
  }, [color]);

  const { showLightPillarAnimation } = useBackgroundAnimation();

  useEffect(() => {
    const prevProgress = prevProgressRef.current;
    const isIncreasing = progress > prevProgress;
    const delta = Math.max(progress - prevProgress, 0);

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    if (animated && isIncreasing) {
      let glowLevel: keyof typeof GLOW_LEVELS = "none";
      let intensityLevel: Intensity | undefined;

      if (level <= 1) {
        if (delta >= 100) {
          glowLevel = "low";
          intensityLevel = Intensity.LOW;
        }
      } else if (level === 2) {
        if (delta >= 50) {
          glowLevel = "low";
          intensityLevel = Intensity.LOW;
        } else if (delta >= 100) {
          glowLevel = "mid";
          intensityLevel = Intensity.MEDIUM;
        }
      } else {
        if (delta >= 100) {
          glowLevel = "high";
          intensityLevel = Intensity.HIGH;
        } else if (delta >= 50) {
          glowLevel = "mid";
          intensityLevel = Intensity.MEDIUM;
        } else if (delta >= 30) {
          glowLevel = "low";
          intensityLevel = Intensity.LOW;
        }
      }

      setBarColor(VIOLET_LIGHT);
      setGlowSize(GLOW_LEVELS[glowLevel]);
      if (intensityLevel !== undefined) {
        showLightPillarAnimation({ intensityLevel });
        playSound?.();
      }

      resetTimeoutRef.current = setTimeout(() => {
        resetGlow();
        resetTimeoutRef.current = null;
      }, RESET_DELAY_MS);
    } else {
      resetGlow();
    }

    prevProgressRef.current = progress;
  }, [progress, animated, resetGlow, level, showLightPillarAnimation]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Box mt={1.5} position="relative" w="100%">
      <Box
        h="14px"
        borderRadius="full"
        border="2px solid white"
        position="relative"
        zIndex={2}
      ></Box>

      <Box
        h="100%"
        bg={barColor}
        boxShadow={
          clampedProgress
            ? `0px 0px ${glowSize.blur}px ${glowSize.spread}px ${barColor}`
            : "none"
        }
        width={`${clampedProgress}%`}
        borderRadius="full"
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        transition="width 1s ease, background-color 0.4s ease, box-shadow 0.4s ease"
      />
    </Box>
  );
};
