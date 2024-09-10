import { Box, Button, Flex, Heading, Img } from "@chakra-ui/react";
import { useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Leaderboard } from "../components/Leaderboard";
import { PoweredBy } from "../components/PoweredBy";
import { useDojo } from "../dojo/useDojo";

export const Home = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [playButtonClicked, setPlayButtonClicked] = useState(false);
  const { account } = useDojo();
  const navigate = useNavigate();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (account && playButtonClicked) {
      navigate("/demo");
    }
  }, [account, playButtonClicked]);

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
            gap={{ base: 6, sm: 8, md: 12 }}
          >
            <Heading
              size="xl"
              color="white"
              fontSize={{ base: 10, sm: 20, md: 25, lg: 30 }}
            >
              BUIDL YOUR DECK, RULE THE GAME
            </Heading>
            <Img
              width={{ base: "95%", sm: "85%", md: "80%" }}
              src="/logos/logo.png"
              alt="logo"
            />

            <Flex
              gap={{ base: 4, sm: 6 }}
              flexWrap={{ base: "wrap", sm: "nowrap" }}
              justifyContent="center"
            >
              <Button
                onClick={() => {
                  setLeaderboardOpen(true);
                }}
              >
                SEE LEADERBOARD
              </Button>
              <Button
                variant="secondarySolid"
                onClick={() => {
                  setPlayButtonClicked(true);
                  connect({ connector: connectors[0] });
                }}
              >
                PLAY DEMO
              </Button>
            </Flex>
          </Flex>
        )}
        <PoweredBy />
      </Flex>
    </Background>
  );
};
