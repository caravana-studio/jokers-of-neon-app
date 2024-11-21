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
  const { blueLight, blue, violet } = theme.colors;

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

  useEffect(() => {
    if (levelUpHand) {
      setShowAnimationHeading(true);
      setTimeout(() => {
        setShowAnimationText(true);
      }, 500);
      setTimeout(() => {
        setPhase(2);
      }, 3000);

      const timer = setTimeout(() => {
        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }, 3000);
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
        >
          {phase === 1 && levelUpHand && (
            <>
              <animated.div style={headingSpring}>
                <Heading fontSize={{ base: "2rem", sm: "4rem" }}>
                  HAND LEVELED UP:
                </Heading>
              </animated.div>
              <animated.div style={textSpring}>
                <Table
                  sx={{
                    borderCollapse: "separate",
                    marginBottom: 4,
                    borderSpacing: 0,
                  }}
                  width={"100%"}
                  variant={isSmallScreen ? "store-mobile" : "store"}
                >
                  <Tbody>
                    <Tr height={"30px"} sx={{ cursor: "pointer" }}>
                      {
                        <Td
                          textAlign={"center"}
                          fontSize={isSmallScreen ? 9 : 13}
                        >
                          <Text size="xl">{PLAYS[levelUpHand.hand]}</Text>
                        </Td>
                      }
                      <Td>
                        <Box
                          color={"white"}
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"center"}
                        >
                          <Box
                            backgroundColor={`${blue}`}
                            borderRadius={4}
                            width={isSmallScreen ? "40px" : "60px"}
                            mr={1}
                            boxShadow={`0px 0px 10px 6px ${blue}`}
                            fontWeight={"400"}
                          >
                            {levelUpHand.points.toString()}
                          </Box>
                          <Heading fontSize={isSmallScreen ? "8" : "10"}>
                            x
                          </Heading>
                          <Box
                            backgroundColor={"neonPink"}
                            borderRadius={4}
                            width={isSmallScreen ? "40px" : "60px"}
                            ml={1}
                            boxShadow={`0px 0px 10px 6px ${violet}`}
                            fontWeight={"400"}
                          >
                            {levelUpHand.multi.toString()}
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
