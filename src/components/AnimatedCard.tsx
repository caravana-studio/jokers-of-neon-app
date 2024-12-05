import { Heading, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useCardAnimations } from "../providers/CardAnimationsProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CashSymbol } from "./CashSymbol";

export interface IAnimatedCardProps {
  children: JSX.Element;
  idx: number;
  discarded?: boolean;
  played?: boolean;
  isSpecial?: boolean;
  scale?: number;
}

const TRANSLATE_Y_BASE = 40;

export const AnimatedCard = ({
  children,
  idx,
  discarded = false,
  played = false,
  isSpecial = false,
  scale,
}: IAnimatedCardProps) => {
  const { animatedCard } = useCardAnimations();
  const animatedCardIdxArray = useMemo(() => {
    return isSpecial ? [animatedCard?.special_idx] : animatedCard?.idx;
  }, [animatedCard?.idx, animatedCard?.special_idx, isSpecial]);
  const points = useMemo(() => animatedCard?.points, [animatedCard?.points]);
  const multi = useMemo(() => animatedCard?.multi, [animatedCard?.multi]);
  const suit = useMemo(() => animatedCard?.suit, [animatedCard?.suit]);
  const cash = useMemo(() => animatedCard?.cash, [animatedCard?.cash]);
  const animationIndex = useMemo(
    () => animatedCard?.animationIndex,
    [animatedCard?.animationIndex]
  );

  const { cardScale, isCardScaleCalculated, isSmallScreen } =
    useResponsiveValues();

  const cardBorderRadius = useBreakpointValue(
    {
      base: "5px",
      sm: "10px",
    },
    { ssr: false }
  );
  const { colors } = useTheme();

  const getColor = () => {
    if (suit) {
      return colors[suit];
    } else if (multi) {
      return colors.neonPink;
    } else if (cash) {
      return colors.DIAMONDS;
    } else {
      return colors.neonGreen;
    }
  };

  const [cardSprings, cardApi] = useSpring(() => ({
    from: {
      transform: "scale(1)",
      opacity: 1,
      x: 0,
      boxShadow: "0px",
      border: "2px solid transparent",
    },
    config: { tension: 200, friction: 10 },
  }));

  const [pointsSprings, pointsApi] = useSpring(() => ({
    from: {
      opacity: 0,
      transform: `translateY(-${(TRANSLATE_Y_BASE - 10) / (isSmallScreen ? 2 : 1)}px) scale(1)`,
    },
    config: { tension: 300, friction: 20 },
  }));

  useEffect(() => {
    if (
      (points || multi || suit || cash) &&
      animatedCardIdxArray?.includes(idx)
    ) {
      const animateColor = getColor();
      cardApi.start({
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
          cardApi.start({
            transform: "scale(1)",
            boxShadow: `0px 0px 0px 0px ${animateColor}`,
            border: `2px solid ${animateColor}`,
          }),
      });

      pointsApi.start({
        from: { opacity: 0, transform: "translateY(-30px) scale(1)" },
        to: [
          {
            opacity: 1,
            transform: `translateY(-${(TRANSLATE_Y_BASE + 10) / (isSmallScreen ? 2 : 1)}px) scale(1.2)`,
          },
          {
            opacity: 1,
            transform: `translateY(-${TRANSLATE_Y_BASE / (isSmallScreen ? 2 : 1)}px) scale(1)`,
          },
          {
            opacity: 0,
            transform: `translateY(-${(TRANSLATE_Y_BASE - 10) / (isSmallScreen ? 2 : 1)}px) scale(1)`,
          },
        ],
      });
    }
  }, [points, multi, suit, animatedCardIdxArray, animationIndex]);

  useEffect(() => {
    if (played) {
      cardApi.start({
        to: { x: 1000, opacity: 0 },
        config: { duration: 200 },
      });
    }
  }, [played]);

  useEffect(() => {
    if (discarded) {
      cardApi.start({
        to: { x: -1000, opacity: 0 },
        config: { duration: 200 },
      });
    } else {
      cardApi.start({
        to: { x: 0, opacity: 1 },
        config: { duration: 200 },
      });
    }
  }, [discarded]);

  if (!isCardScaleCalculated) return null;

  if (!scale) scale = cardScale;

  return (
    <animated.div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${(CARD_WIDTH + (isSmallScreen ? 12 : 8)) * scale}px`,
        height: `${(CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * scale}px`,
        borderRadius: cardBorderRadius,
        ...cardSprings,
      }}
    >
      {!!(points || multi || cash) &&
        // this will avoid showing the points and multi if the card is a special and we are already animating the traditional card
        (!(isSpecial && animatedCard?.idx?.length) || cash) &&
        animatedCardIdxArray?.includes(idx) && (
          <animated.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              ...pointsSprings,
              zIndex: 99,
            }}
          >
            <Heading
              color={getColor()}
              mb={[4, 6]}
              fontSize={[12, 24]}
              sx={{
                textShadow: `0 0 5px  ${getColor()}`,
              }}
            >
              {/* {isSpecial && cash ? (
                <>
                  +{cash}
                  <CashSymbol />
                </>
              ) : (
                <>{(points || multi) && <> + {points || multi}</>}</>
              )} */}
              +{points || multi || (isSpecial && cash)}
              {isSpecial && cash && <CashSymbol />}
            </Heading>
          </animated.div>
        )}
      {children}
    </animated.div>
  );
};
