import { Box } from "@chakra-ui/react";
import Lottie from "lottie-react";
import dailyStreakFireAnimation from "../assets/daily-streak-fire.json";

interface DailyStreakFireAnimationProps {
  size?: number;
  grayscale?: boolean;
}

export const DailyStreakFireAnimation = ({
  size = 112,
  grayscale = false,
}: DailyStreakFireAnimationProps) => {
  return (
    <Box
      width={`${size}px`}
      height={`${size}px`}
      pointerEvents="none"
      aria-label="Daily streak fire"
      filter={grayscale ? "grayscale(1) saturate(0)" : undefined}
    >
      <Lottie
        animationData={dailyStreakFireAnimation}
        autoplay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};
