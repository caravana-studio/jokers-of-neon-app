import { Heading, useTheme } from "@chakra-ui/react";
import { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { useCardAnimations } from "../providers/CardAnimationsProvider";

export interface IAnimatedCardProps {
  children: JSX.Element;
  idx: number;
  discarded?: boolean;
  played?: boolean;
}

export const AnimatedCard = ({
  children,
  idx,
  discarded = false,
  played = false,
}: IAnimatedCardProps) => {
  const { points, multi, animatedCardIdx } = useCardAnimations();

  const { colors } = useTheme();

  const [cardSprings, cardApi] = useSpring(() => ({
    from: { transform: "scale(1)", opacity: 1, x: 0, boxShadow: "0px" },
    config: { tension: 200, friction: 10 },
  }));

  const [pointsSprings, pointsApi] = useSpring(() => ({
    from: {
      opacity: 0,
      transform: "translateY(-30px) scale(1)",
    },
    config: { tension: 300, friction: 20 },
  }));

  useEffect(() => {
    if ((points || multi) && animatedCardIdx === idx) {
      const animateColor = points ? colors.neonGreen : colors.neonPink
      cardApi.start({
        from: {
          transform: "scale(1)",
          boxShadow: `0px 0px 5px 0px ${animateColor}`,
        },
        to: {
          transform: "scale(1.1)",
          boxShadow: `0px 0px 30px 0px  ${animateColor}`,
        },
        onRest: () => cardApi.start({ transform: "scale(1)" }),
      });

      pointsApi.start({
        from: { opacity: 0, transform: "translateY(-30px) scale(1)" },
        to: [
          { opacity: 1, transform: "translateY(-50px) scale(1.2)" },
          { opacity: 1, transform: "translateY(-40px) scale(1)" },
          { opacity: 0, transform: "translateY(-30px) scale(1)" },
        ],
      });
    }
  }, [points, multi, animatedCardIdx]);

  useEffect(() => {
    if (discarded || played) {
      cardApi.start({
        to: { x: discarded ? 1000 : -1000, opacity: 0 },
        config: { duration: 200 },
      });
    }
  }, [discarded, played]);

  return (
    <animated.div style={{ position: "relative", ...cardSprings }}>
      {!!(points || multi) && animatedCardIdx === idx && (
        <animated.div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            ...pointsSprings,
            zIndex: 99,
          }}
        >
          <Heading
            sx={{
              fontSize: 40,
              mb: 3,
              textShadow: `0 0 20px  ${points ? colors.neonGreen : colors.neonPink}`,
            }}
          >
            +{points || multi}
          </Heading>
        </animated.div>
      )}
      {children}
    </animated.div>
  );
};
