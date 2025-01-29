import { useTheme } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { IAnimatedCardProps } from "./AnimatedCard";

export const AnimatedPowerUp = ({ children, idx }: IAnimatedCardProps) => {
  const { animatedPowerUp } = useCardAnimations();
  const animatedPowerUpIdx = animatedPowerUp?.idx;
  const points = useMemo(
    () => animatedPowerUp?.points,
    [animatedPowerUp?.points]
  );
  const multi = useMemo(() => animatedPowerUp?.multi, [animatedPowerUp?.multi]);

  const animationIndex = useMemo(
    () => animatedPowerUp?.animationIndex,
    [animatedPowerUp?.animationIndex]
  );

  const { isSmallScreen } = useResponsiveValues();

  const { colors } = useTheme();

  const [powerUpSprings, powerUpApi] = useSpring(() => ({
    from: {
      transform: "scale(1)",
      opacity: 1,
      x: 0,
      boxShadow: "0px",
      border: "2px solid transparent",
    },
    config: { tension: 200, friction: 10 },
  }));

  const getColor = () => {
    if (multi) {
      return colors.neonPink;
    } else {
      return colors.neonGreen;
    }
  };

  useEffect(() => {
    if ((points || multi) && animatedPowerUpIdx === idx) {
      const animateColor = getColor();
      powerUpApi.start({
        from: {
          transform: "scale(1)",
          boxShadow: `0px 0px 5px 0px ${animateColor}`,
          border: `2px solid ${animateColor}`,
        },
        to: {
          transform: "scale(1.1)",
          boxShadow: `0px 0px ${isSmallScreen ? 10 : 20}px ${isSmallScreen ? 6 : 12}px  ${animateColor}`,
          border: `2px solid ${animateColor}`,
        },
        onRest: () =>
          powerUpApi.start({
            transform: "scale(1)",
            boxShadow: `0px 0px 0px 0px ${animateColor}`,
            border: `2px solid transparent`,
          }),
      });
    }
  }, [points, multi, animatedPowerUpIdx, animationIndex]);

  return (
    <animated.div
      className={"game-tutorial-power-up-" + idx}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isSmallScreen ? "4px 6px" : "6px 8px",
        borderRadius: isSmallScreen ? "17px" : "25px",
        ...powerUpSprings,
      }}
    >
      {children}
    </animated.div>
  );
};
