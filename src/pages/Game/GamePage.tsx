import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { RemoveScroll } from "react-remove-scroll";
import { animated, config, useSpring } from "react-spring";
import { Background } from "../../components/Background";
import { LOGGED_USER } from "../../constants/localStorage";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { GameContent } from "./GameContent";
import { MobileGameContent } from "./GameContent.mobile";

export const GamePage = () => {
  const {
    setup: { masterAccount },
    account: { account },
  } = useDojo();
  const username = localStorage.getItem(LOGGED_USER);
  const { checkOrCreateGame } = useGameContext();
  const [showAnimationHeading, setShowAnimationHeading] = useState(false);
  const [showAnimationText, setShowAnimationText] = useState(false);

  const { isRageRound } = useGameContext();

  const headingSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationHeading) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { ...config.wobbly, duration: 200 },
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
    config: { ...config.wobbly, duration: 200 },
  });

  useEffect(() => {
    if (account !== masterAccount && username) {
      checkOrCreateGame();
    }
  }, [account, username]);

  useEffect(() => {
    if (isRageRound) {
      setShowAnimationHeading(true);
      setTimeout(() => {
        setShowAnimationText(true);
      }, 500);
      const timer = setTimeout(() => {
        setShowAnimationHeading(false);
        setShowAnimationText(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRageRound]);

  return (
    <Background type="rage">
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
        >
          <animated.div style={headingSpring}>
            <Heading fontSize="4rem">RAGE ROUND</Heading>
          </animated.div>
          <animated.div style={textSpring}>
            <Text size="xl">
              Heart suited cards will not score during this level
            </Text>
          </animated.div>
        </Flex>
      )}
      {isMobile ? <MobileGameContent /> : <GameContent />}
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </Background>
  );
};
