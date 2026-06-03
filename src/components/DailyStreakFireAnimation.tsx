import { Box } from "@chakra-ui/react";
import Lottie from "lottie-react";
import dailyStreakFireAnimation from "../assets/daily-streak-fire.json";

interface DailyStreakFireAnimationProps {
  size?: number;
}

export const DailyStreakFireAnimation = ({
  size = 112,
}: DailyStreakFireAnimationProps) => {
  return (
    <Box
      width={`${size}px`}
      height={`${size}px`}
      pointerEvents="none"
      aria-label="Daily streak fire"
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
