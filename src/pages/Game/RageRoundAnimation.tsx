import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import CachedImage from "../../components/CachedImage";
import { useGameContext } from "../../providers/GameProvider";
import { getCardData } from "../../utils/getCardData";

export const RageRoundAnimation = () => {
  const [showAnimationHeading, setShowAnimationHeading] = useState(false);
  const [showAnimationText, setShowAnimationText] = useState(false);
  const [phase, setPhase] = useState(1);

  const {
    isRageRound,
    rageCards,
    destroyedSpecialCardId,
    setDestroyedSpecialCardId,
  } = useGameContext();

  const descriptions = rageCards?.map((card) => getCardData(card).description);

  const headingSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationHeading) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { duration: 200 },
  });

  const textSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationText) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { duration: 200 },
  });

  const destroyedSpecialCardSpring = useSpring({
    delay: 3000,
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (destroyedSpecialCardId) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { duration: 200 },
  });

  useEffect(() => {
    if (isRageRound) {
      setShowAnimationHeading(true);
      setTimeout(() => {
        setShowAnimationText(true);
      }, 500);
      setTimeout(() => {
        setPhase(2);
      }, 3000);

      const timer = setTimeout(
        () => {
          setShowAnimationHeading(false);
          setShowAnimationText(false);
          setDestroyedSpecialCardId(undefined);
        },
        destroyedSpecialCardId ? 6000 : 3000
      );
      return () => clearTimeout(timer);
    }
  }, [isRageRound]);
  return (
    <>
      {showAnimationHeading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={1000}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          backdropFilter="blur(5px)"
          backgroundColor=" rgba(0, 0, 0, 0.5)"
        >
          {phase === 1 && (
            <>
              <animated.div style={headingSpring}>
                <Heading fontSize={{ base: "2rem", sm: "4rem" }}>
                  RAGE ROUND
                </Heading>
              </animated.div>
              <animated.div style={textSpring}>
                {descriptions.map((description) => {
                  return (
                    <Text key={description} size="xl">
                      {description}
                    </Text>
                  );
                })}
              </animated.div>
            </>
          )}
          {destroyedSpecialCardId && phase === 2 && (
            <animated.div
              style={{
                ...destroyedSpecialCardSpring,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Heading mb={8} variant="italic">
                Sacrificed card:
              </Heading>
              <Box boxShadow={"0px 0px 20px 7px red"} borderRadius="20px">
                <CachedImage src={`/Cards/big/${destroyedSpecialCardId}.png`} />
              </Box>
            </animated.div>
          )}
        </Flex>
      )}
    </>
  );
};
