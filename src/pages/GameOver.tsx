import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Leaderboard } from "../components/Leaderboard";
import { GAME_ID, LAST_GAME_ID } from "../constants/localStorage";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useGameContext } from "../providers/GameProvider";
import { useGetGame } from "../queries/useGetGame";

const GAME_URL = "https://jokersofneon.com/";

export const GameOver = () => {
  const navigate = useNavigate();
  const gameId =
    getLSGameId() !== 0
      ? getLSGameId()
      : Number(localStorage.getItem(LAST_GAME_ID));
  const [lastGameId, setLastGameId] = useState(getLSGameId());
  const { restartGame } = useGameContext();
  const { data } = useGetGame(lastGameId);
  const score = data?.player_score ?? 0;

  useEffect(() => {
    localStorage.removeItem(GAME_ID);
    gameId && localStorage.setItem(LAST_GAME_ID, gameId.toString());
  }, []);

  return (
    <Background type="game" bgDecoration>
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Box>
          <Heading size="l" variant="italic" textAlign={"center"} mb={16}>
            GAME OVER
          </Heading>
          <Leaderboard gameId={lastGameId} lines={4} />
          <Button
            width={"100%"}
            variant="secondarySolid"
            sx={{
              mt: 6,
            }}
            onClick={() => {
              localStorage.removeItem(GAME_ID);
              restartGame();
              navigate("/demo");
            }}
          >
            START NEW GAME
          </Button>
        </Box>

        <Image
          position={"fixed"}
          bottom={10}
          alignSelf="center"
          src="/logos/jn-logo.png"
          alt="logo-variant"
          width={"65%"}
          maxW={"180px"}
        />
      </Flex>
    </Background>
  );
};
