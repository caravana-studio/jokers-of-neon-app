import { Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { animated, useSpring } from "react-spring";

export interface IAnimatedCardProps {
  children: JSX.Element;
  points?: number;
  discarded?: boolean;
  played?: boolean;
}

export const AnimatedCard = ({
  children,
  points = 0,
  discarded = false,
  played = false,
}: IAnimatedCardProps) => {
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
    if (points) {
      cardApi.start({
        from: { transform: "scale(1)", boxShadow: "0px 0px 5px 0px #33effa" },
        to: { transform: "scale(1.1)", boxShadow: "0px 0px 30px 0px #33effa" },
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
  }, [points]);

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
      {!!points && (
        <animated.div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            ...pointsSprings,
          }}
        >
          <Heading sx={{ fontSize: 40, mb: 3, textShadow: "0 0 20px #33effa" }}>
            +{points}
          </Heading>
        </animated.div>
      )}
      {children}
    </animated.div>
  );
};
