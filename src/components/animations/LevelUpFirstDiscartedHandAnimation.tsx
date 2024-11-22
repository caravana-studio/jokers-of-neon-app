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
import { animated, useSpring } from "react-spring";
import { useGameContext } from "../../providers/GameProvider";
import { PLAYS } from "../../constants/plays";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import theme from "../../theme/theme";

export const LevelUpFirstDiscartedHandAnimation = () => {
  const [showAnimationHeading, setShowAnimationHeading] = useState(false);
  const [showAnimationText, setShowAnimationText] = useState(false);
  const [phase, setPhase] = useState(1);
  const { levelUpHand, setLevelUpHand } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const { blue, violet } = theme.colors;

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

  // const levelSpring = useSpring({
  //   from: { x: -1000, opacity: 0 },
  //   to: async (next) => {
  //     if (showAnimationText) {
  //       // Show old level
  //       await next({
  //         x: 0,
  //         opacity: 1,
  //         config: { duration: 200 },
  //       });

  //       // Wait 2 seconds
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //       setPhase(2);

  //       // Transition to new level
  //       await next({
  //         x: 1000,
  //         opacity: 0,
  //         config: { duration: 200 },
  //       });

  //       // Final timeout before closing
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       // Close animation
  //       setShowAnimationHeading(false);
  //       setShowAnimationText(false);
  //       setLevelUpHand(undefined);
  //     }
  //   },
  // });

  const levelSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationText) {
        // Show old data
        await next({ x: 0, opacity: 1, config: { duration: 200 } });

        // Wait for display duration
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Transition old data out
        await next({ x: 1000, opacity: 0, config: { duration: 200 } });

        // Switch to new phase
        setPhase(2);

        // Wait before showing new data
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Show new data
        await next({ x: -1000, opacity: 0, immediate: true }); // Reset position for new data
        await next({ x: 0, opacity: 1, config: { duration: 200 } });

        // Wait for final display
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Transition new data out
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
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

      const timer = setTimeout(() => {
        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [levelUpHand]);

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

              <animated.div style={levelSpring}>
                {/* <Heading fontSize={isSmallScreen ? "1rem" : "2rem"}>
                  {phase === 1 ? "PREVIOUS LEVEL:" : "NEW LEVEL:"}
                </Heading> */}
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
                      <Td
                        textAlign="center"
                        fontSize={isSmallScreen ? "1rem" : "2rem"}
                      >
                        <Text size="xl">
                          {phase === 1
                            ? "PREVIOUS LEVEL: " + levelUpHand.old_level
                            : "NEW LEVEL: " + levelUpHand.level}
                        </Text>
                      </Td>
                      <Td>
                        <Box
                          color="white"
                          display="flex"
                          flexDirection="row"
                          justifyContent="center"
                          gap={3}
                        >
                          <Box
                            backgroundColor={blue}
                            borderRadius={4}
                            width={isSmallScreen ? "40px" : "60px"}
                            fontSize={isSmallScreen ? "1rem" : "2rem"}
                            mr={1}
                            boxShadow={`0px 0px 10px 10px ${blue}`}
                            fontWeight="400"
                          >
                            {phase === 1
                              ? levelUpHand.old_points.toString()
                              : levelUpHand.points.toString()}
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
                            boxShadow={`0px 0px 10px 10px ${violet}`}
                            fontWeight="400"
                          >
                            {phase === 1
                              ? levelUpHand.old_multi.toString()
                              : levelUpHand.multi.toString()}
                          </Box>
                        </Box>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </animated.div>
            </>
          )}
        </Flex>
      )}
    </>
  );
};
