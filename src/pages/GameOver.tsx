import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
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
  const { restartGame, setIsRageRound } = useGameContext();
  const { data } = useGetGame(lastGameId);
  const score = data?.player_score ?? 0;

  useEffect(() => {
    localStorage.removeItem(GAME_ID);
    gameId && localStorage.setItem(LAST_GAME_ID, gameId.toString());
    setIsRageRound(false);
  }, []);

  return (
    <Background type="home">
      <Box
        position="fixed"
        height="15%"
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="0 50px"
      >
        <Image
          alignSelf="center"
          justifySelf="end"
          src="/logos/logo-variant.svg"
          alt="logo-variant"
          width={"65%"}
          maxW={"300px"}
        />
        {!isMobile && (
          <Image
            alignSelf="center"
            justifySelf="end"
            src="/logos/joker-logo.png"
            alt="/logos/joker-logo.png"
            width={"25%"}
            maxW={"150px"}
          />
        )}
      </Box>
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Box>
          <Heading size="l" variant="italic" textAlign={"center"} mb={12}>
            GAME OVER
          </Heading>
          <Leaderboard gameId={lastGameId} lines={4} />
        </Box>
        <Button
          sx={{ mt: 4 }}
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=%20%F0%9F%94%A5%20Just%20scored%20${score}%20points%20in%20Jokers%20of%20Neon!%20%F0%9F%94%A5%0A%0AThink%20you%20can%20beat%20me?%0ADemo%20is%20open%20for%20limited%20time!!%20%E2%8F%B3%E2%8F%B3%0A%0AGive%20it%20a%20shot%20at%20${GAME_URL}%20%F0%9F%83%8F%E2%9C%A8`,
              "_blank"
            );
          }}
          data-size="large"
        >
          SHARE YOUR SCORE ON
          <Flex sx={{ ml: 2.5 }}>
            <FontAwesomeIcon fontSize={22} icon={faXTwitter} />
          </Flex>
        </Button>
        <Button
          variant="secondarySolid"
          sx={{
            mt: 10,
          }}
          onClick={() => {
            localStorage.removeItem(GAME_ID);
            restartGame();
            navigate("/demo");
          }}
        >
          START NEW GAME
        </Button>
      </Flex>
    </Background>
  );
};
