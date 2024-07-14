import { Box, Button, Flex, Heading, Img, Link } from "@chakra-ui/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Leaderboard } from "../components/Leaderboard";

export const DemoClosedHome = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <Background type="home">
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={3}
      >
        {leaderboardOpen ? (
          <Box>
            <Heading size="l" variant="italic" textAlign={"center"} mb={12}>
              LEADERBOARD
            </Heading>
            {isMobile ? (
              <Box sx={{ transform: "scale(0.7)" }}>
                <Leaderboard lines={6} />
              </Box>
            ) : (
              <Leaderboard />
            )}
            <Button
              mt={8}
              width="100%"
              onClick={() => {
                setLeaderboardOpen(false);
              }}
            >
              GO BACK HOME
            </Button>
          </Box>
        ) : (
          <Flex
            flexDirection="column"
            alignItems="center"
            gap={{ base: 3, sm: 3, md: 4 }}
          >
            <Heading
              size="xl"
              color="white"
              fontSize={{ base: 8, sm: 17, md: 23, lg: 27 }}
            >
              BUIDL YOUR DECK, RULE THE GAME
            </Heading>
            <Img
              width={{ base: "85%", sm: "75%", md: "70%" }}
              src="/logos/logo.png"
              alt="logo"
            />
            <Flex gap={6} flexDirection="column" alignItems="center">
              <Heading
                size="xl"
                fontSize={{ base: 10, sm: 19, md: 25, lg: 30 }}
              >
                Demo phase 1 is now closed
              </Heading>
              <Heading
                fontSize={{ base: 6, sm: 10, md: 13, lg: 16 }}
                size="sm"
                variant="italic"
              >
                Follow us on X to stay updated on future releases
              </Heading>
            </Flex>
            <Flex
              mt={8}
              gap={{ base: 4, sm: 6 }}
              flexWrap={{ base: "wrap", sm: "nowrap" }}
              justifyContent="center"
            >
              <Button
                onClick={() => {
                  setLeaderboardOpen(true);
                }}
                size="sm"
              >
                SEE PHASE 1 LEADERBOARD
              </Button>
              <Link target="_blank" href="https://twitter.com/JokersOfNeon">
                <Button size="sm" variant="secondarySolid">
                  FOLLOW @JokersOfNeon
                </Button>
              </Link>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Background>
  );
};
