import { Box, Flex, Text, type BoxProps } from "@chakra-ui/react";
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
  incompleteColor?: string;
  completeColor?: string;
  animated?: boolean;
  playSound?: () => void;
  height?: BoxProps["h"];
  width?: BoxProps["w"];
  mt?: BoxProps["mt"];
  borderRadius?: BoxProps["borderRadius"];
  borderWidth?: BoxProps["borderWidth"];
  label?: string;
  labelFontSize?: BoxProps["fontSize"];
  labelColor?: string;
}
export const ProgressBar = ({
  progress,
  color,
  incompleteColor = BLUE_LIGHT,
  completeColor = VIOLET_LIGHT,
  animated = false,
  playSound,
  height = "14px",
  width = "100%",
  mt = 1.5,
  borderRadius = "full",
  borderWidth = "2px",
  label,
  labelFontSize = "10px",
  labelColor = "white",
}: IProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const baseColor =
    color ?? (clampedProgress >= 100 ? completeColor : incompleteColor);
  const [barColor, setBarColor] = useState(baseColor);
  const [glowSize, setGlowSize] = useState(BASE_GLOW);
  const prevProgressRef = useRef(progress);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { level } = useGameStore();

  const resetGlow = useCallback(() => {
    setBarColor(baseColor);
    setGlowSize(BASE_GLOW);
  }, [baseColor]);

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

  return (
    <Box mt={mt} position="relative" w={width}>
      <Box
        w={width}
        h={height}
        borderRadius={borderRadius}
        border={`${borderWidth} solid white`}
        position="relative"
        zIndex={2}
      ></Box>

      <Box
        h="100%"
        w={`${clampedProgress}%`}
        bg={barColor}
        boxShadow={
          clampedProgress
            ? `0px 0px ${glowSize.blur}px ${glowSize.spread}px ${barColor}`
            : "none"
        }
        borderRadius={borderRadius}
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        transition="width 1s ease, background-color 0.4s ease, box-shadow 0.4s ease"
      />
      {label && (
        <Flex
          position="absolute"
          inset={0}
          justifyContent="center"
          alignItems="center"
          zIndex={3}
          pointerEvents="none"
        >
          <Text
            fontSize={labelFontSize}
            color={labelColor}
            lineHeight={1}
            textShadow="0 0 8px rgba(0,0,0,0.85)"
          >
            {label}
          </Text>
        </Flex>
      )}
    </Box>
  );
};
