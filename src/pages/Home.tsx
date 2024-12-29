import { Box, Button, Flex, Heading, Img, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { Leaderboard } from "../components/Leaderboard";

export const Home = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <Background type="home">
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        {leaderboardOpen ? (
          <Box>
            <Heading size="l" variant="italic" textAlign={"center"}>
              LEADERBOARD
            </Heading>
            <Box mb={10} textAlign={"center"}>
              <Text size="l">FINAL RESULTS</Text>
            </Box>

            <Leaderboard />
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
              BUILD YOUR DECK, RULE THE GAME
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
                Tournament is now closed
              </Heading>
              <Heading
                fontSize={{ base: 6, sm: 10, md: 13, lg: 16 }}
                size="sm"
                variant="italic"
              >
                Follow us to stay updated on future releases
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
                SEE LEADERBOARD
              </Button>
              <Link target="_blank" href="https://twitter.com/JokersOfNeon">
                <Button size="sm" variant="secondarySolid">
                  FOLLOW @JokersOfNeon
                </Button>
              </Link>
              <Link target="_blank" href="https://discord.gg/4y296W6jaq">
                <Button size="sm">Join Discord</Button>
              </Link>
            </Flex>
          </Flex>
        )}
      </Flex>
      <PositionedDiscordLink />
    </Background>
  );
};
