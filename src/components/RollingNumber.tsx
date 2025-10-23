import { Box } from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
interface RollingNumberProps {
  n: number;
  className?: string;
  delay?: number;
}

export const RollingNumber = ({ n, className = 'headline', delay = 100 }: RollingNumberProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay,
    config: { mass: 1, tension: 26, friction: 10 },
  });
  return (
    <Box as="span" sx={{ display: "inline-block" }}>
      <animated.span className={className}>{number.to((n) => n.toFixed(0))}</animated.span>
    </Box>
  );
};
