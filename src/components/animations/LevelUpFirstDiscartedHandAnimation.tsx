import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { useGameContext } from "../../providers/GameProvider";
import { PLAYS } from "../../constants/plays";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import theme from "../../theme/theme";
import { ArrowRight } from "lucide-react";
import { runConfettiAnimation } from "../../utils/runConfettiAnimation";
import {
  BLUE,
  BLUE_LIGHT,
  NEON_GREEN,
  NEON_PINK,
  PASTEL_PINK,
  VIOLET,
  VIOLET_LIGHT,
} from "../../theme/colors";

export const LevelUpFirstDiscartedHandAnimation = () => {
  const [showAnimationHeading, setShowAnimationHeading] = useState(false);
  const [showAnimationText, setShowAnimationText] = useState(false);
  const [showNewDataText, setNewDataText] = useState(false);
  const { levelUpHand, setLevelUpHand } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const { blue, violet } = theme.colors;

  const confettiConfig = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 11,
    colors: [
      BLUE,
      BLUE_LIGHT,
      VIOLET,
      VIOLET_LIGHT,
      PASTEL_PINK,
      NEON_GREEN,
      "#FFF",
      NEON_PINK,
    ],
  };

  const headingSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationHeading) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { duration: 200 },
  });

  const oldLevelSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationText) {
        await next({ x: 0, opacity: 1, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await next({ x: 1000, opacity: 0, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 200));

        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }
    },
  });

  const arrowSpring = useSpring({
    from: { x: -1000, opacity: 0, scale: 0.5 },
    to: async (next) => {
      if (showNewDataText) {
        await next({
          x: 0,
          opacity: 1,
          scale: 1,
          config: config.wobbly,
        });
        await next({
          x: 0,
          scale: 1,
          config: { tension: 100 },
        });

        await new Promise((resolve) => setTimeout(resolve, 600));

        await new Promise((resolve) => setTimeout(resolve, 1800));
        await next({ x: 1000, opacity: 0, config: { duration: 200 } });
      }
    },
  });

  const newLevelSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    delay: 400,
    to: async (next) => {
      if (showNewDataText) {
        await next({ x: 0, opacity: 1, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 2700));
        await next({ x: 1000, opacity: 0, config: { duration: 200 } });

        // Reset animation state
        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }
    },
  });

  const textSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationText) {
        await next({ x: 0, opacity: 1 });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await next({ x: 1000, opacity: 0 });
      }
    },
    config: { duration: 200 },
  });

  useEffect(() => {
    if (levelUpHand) {
      setShowAnimationHeading(true);
      setTimeout(() => {
        setShowAnimationText(true);
      }, 500);
      setTimeout(() => {
        setNewDataText(true);
      }, 500);

      const timer = setTimeout(() => {
        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [levelUpHand]);

  useEffect(() => {
    runConfettiAnimation(100, confettiConfig);
  }, []);

  const tableData = (showNewDataText: boolean) => (
    <Table
      sx={{
        borderCollapse: "separate",
        marginBottom: 4,
        borderSpacing: 0,
      }}
      width="100%"
      variant={isSmallScreen ? "store-mobile" : "store"}
    >
      <Tbody>
        <Tr height="30px" sx={{ cursor: "pointer" }}>
          <Td>
            <Box
              color="white"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap={isSmallScreen ? 3 : 5}
            >
              <Text size="xl">
                LEVEL{" "}
                {!showNewDataText ? levelUpHand?.old_level : levelUpHand?.level}
              </Text>

              <Flex gap={isSmallScreen ? 0 : 3}>
                <Box
                  backgroundColor={blue}
                  borderRadius={4}
                  width={isSmallScreen ? "40px" : "60px"}
                  fontSize={isSmallScreen ? "1rem" : "2rem"}
                  mr={1}
                  boxShadow={
                    isSmallScreen
                      ? `0px 0px 10px 6px ${blue}`
                      : `0px 0px 10px 10px ${blue}`
                  }
                  fontWeight="400"
                >
                  {!showNewDataText
                    ? levelUpHand?.old_points.toString()
                    : levelUpHand?.points.toString()}
                </Box>
                <Heading fontSize={isSmallScreen ? "0.5rem" : "1rem"}>
                  x
                </Heading>
                <Box
                  backgroundColor="neonPink"
                  borderRadius={4}
                  width={isSmallScreen ? "40px" : "60px"}
                  fontSize={isSmallScreen ? "1rem" : "2rem"}
                  ml={1}
                  boxShadow={
                    isSmallScreen
                      ? `0px 0px 10px 6px ${violet}`
                      : `0px 0px 10px 10px ${violet}`
                  }
                  fontWeight="400"
                >
                  {!showNewDataText
                    ? levelUpHand?.old_multi.toString()
                    : levelUpHand?.multi.toString()}
                </Box>
              </Flex>
            </Box>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );

  return (
    <>
      {showAnimationHeading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={10}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          backdropFilter="blur(5px)"
          backgroundColor=" rgba(0, 0, 0, 0.5)"
          gap={3}
        >
          {levelUpHand && (
            <>
              <animated.div style={headingSpring}>
                <Heading fontSize={isSmallScreen ? "1rem" : "2rem"}>
                  HAND LEVELED UP
                </Heading>
              </animated.div>

              <animated.div style={textSpring}>
                <Text fontSize={{ base: "2rem", sm: "4rem" }}>
                  {PLAYS[levelUpHand.hand]}
                </Text>
              </animated.div>

              <Flex gap={isSmallScreen ? 3 : 0}>
                <animated.div style={oldLevelSpring}>
                  {tableData(false)}
                </animated.div>

                {showNewDataText && (
                  <Box
                    display={"flex"}
                    alignContent={"baseline"}
                    justifyContent={"center"}
                  >
                    <animated.div
                      style={{
                        ...arrowSpring,
                      }}
                    >
                      <ArrowRight
                        size={isSmallScreen ? 30 : 35}
                        color="white"
                      />
                    </animated.div>
                    <animated.div style={newLevelSpring}>
                      {tableData(true)}
                    </animated.div>
                  </Box>
                )}
              </Flex>
            </>
          )}
        </Flex>
      )}
    </>
  );
};
