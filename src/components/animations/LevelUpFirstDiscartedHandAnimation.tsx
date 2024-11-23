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
  const [showNewDataText, setNewDataText] = useState(false);
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

  const oldLevelSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showAnimationText) {
        await next({ x: 0, opacity: 1, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await next({ x: 1000, opacity: 0, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 200));

        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }
    },
  });

  const newLevelSpring = useSpring({
    from: { x: -1000, opacity: 0 },
    to: async (next) => {
      if (showNewDataText) {
        await next({ x: 0, opacity: 1, config: { duration: 200 } });
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
      setTimeout(() => {
        setNewDataText(true);
      }, 2000);

      const timer = setTimeout(() => {
        setShowAnimationHeading(false);
        setShowAnimationText(false);
        setLevelUpHand(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [levelUpHand]);

  const tableData = (
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
          <Td textAlign="center" fontSize={isSmallScreen ? "1rem" : "2rem"}>
            <Text size="xl">
              {!showNewDataText
                ? "PREVIOUS LEVEL: " + levelUpHand?.old_level
                : "NEW LEVEL: " + levelUpHand?.level}
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
                {!showNewDataText
                  ? levelUpHand?.old_points.toString()
                  : levelUpHand?.points.toString()}
              </Box>
              <Heading fontSize={isSmallScreen ? "0.5rem" : "1rem"}>x</Heading>
              <Box
                backgroundColor="neonPink"
                borderRadius={4}
                width={isSmallScreen ? "40px" : "60px"}
                fontSize={isSmallScreen ? "1rem" : "2rem"}
                ml={1}
                boxShadow={`0px 0px 10px 10px ${violet}`}
                fontWeight="400"
              >
                {!showNewDataText
                  ? levelUpHand?.old_multi.toString()
                  : levelUpHand?.multi.toString()}
              </Box>
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

              {!showNewDataText ? (
                <animated.div style={oldLevelSpring}>{tableData}</animated.div>
              ) : (
                <animated.div style={newLevelSpring}>{tableData}</animated.div>
              )}
            </>
          )}
        </Flex>
      )}
    </>
  );
};
