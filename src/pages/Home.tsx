import { Box, Button, Flex, Heading, Img } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import CountdownTimer from "../components/CountdownTimer";
import { Leaderboard } from "../components/Leaderboard";
import { PoweredBy } from "../components/PoweredBy";
import { useTranslation } from 'react-i18next';


export const Home = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  

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
              <CountdownTimer
                targetDate={new Date("2024-10-05T21:00:00.000Z")}
              />
            </Box>

            <Leaderboard />
            <Button
              mt={8}
              width="100%"
              onClick={() => {
                setLeaderboardOpen(false);
              }}
            >
              {t('leaderboard.btn.returnLeaderboard-btn')}
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
              {t('home.slogan')}
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
                {t('home.btn.leaderboard-btn')}
              </Button>
              <Button
                variant="secondarySolid"
                onClick={() => {
                  navigate("/login");
                }}
              >
                {t('home.btn.playDemo-btn')}
              </Button>
            </Flex>
          </Flex>
        )}
        <PoweredBy />
      </Flex>
    </Background>
  );
};
