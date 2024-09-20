import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Leaderboard } from "../components/Leaderboard";
import { GAME_ID, LAST_GAME_ID } from "../constants/localStorage";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useGameContext } from "../providers/GameProvider";
import { useGetGame } from "../queries/useGetGame";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";

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
  const { data: fullLeaderboard } = useGetLeaderboard();
  const actualPlayer = fullLeaderboard?.find((player) => player.id === gameId);

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
          <Flex mt={8} justifyContent={"space-between"} gap={2}>
          <Button
            width={"50%"}
            variant="secondarySolid"
            onClick={() => {
              localStorage.removeItem(GAME_ID);
              restartGame();
              navigate("/demo");
            }}
          >
            START NEW GAME
          </Button>
          <Button
            width={"50%"}
            variant="solid"
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=%F0%9F%83%8F%20I%20just%20finished%20a%20game%20in%20Jokers%20of%20Neon%20%E2%80%94%20check%20out%20my%20results%3A%0A%F0%9F%94%A5%20Level%3A%20${actualPlayer?.level}%0A%F0%9F%8F%85%20Rank%3A%20${actualPlayer?.position}%0A%0AThink%20you%20can%20top%20that%3F%20The%20demo%20is%20live%20for%20a%20limited%20time!%20%E2%8F%B3%0A%0AGive%20it%20a%20try%20at%20https%3A%2F%2Fjokersofneon.com%2F%20%F0%9F%83%8F%E2%9C%A8`,
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
          </Flex>
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
