import { Box } from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
interface RollingNumberProps {
  from?: number;
  n: number;
  className?: string;
  delay?: number;
}

export const RollingNumber = ({
  n,
  className = "headline",
  from = 0,
  delay = 100,
}: RollingNumberProps) => {
  const { number } = useSpring({
    from: { number: from },
    number: n,
    delay: delay,
    config: { mass: 1, tension: 26, friction: 10 },
  });
  return (
    <Box sx={{ display: "inline-block" }}>
      <animated.div className={className}>
        {number.to((n) => n.toFixed(0))}
      </animated.div>
    </Box>
  );
};
