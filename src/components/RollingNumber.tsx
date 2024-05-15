import { Box } from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
interface RollingNumberProps {
  n: number;
}

export const RollingNumber = ({ n }: RollingNumberProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 26, friction: 10 },
  });
  return (
    <Box sx={{ display: "inline-block" }}>
      <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
    </Box>
  );
};
