import { Box, Button, Flex } from "@chakra-ui/react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaderboard } from "../components/Leaderboard";
import { GAME_ID, LAST_GAME_ID } from "../constants/localStorage";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useGameContext } from "../providers/GameProvider";
import { useGetGame } from "../queries/useGetGame";
import { noisyTv } from "../scripts/noisyTv";

const GAME_URL = "https://jokersofneon.com/play";

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
    noisyTv(100);
    localStorage.removeItem(GAME_ID);
    gameId && localStorage.setItem(LAST_GAME_ID, gameId.toString());
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        animation: "5s ease 2000ms normal none infinite running glitch",
      }}
    >
      <Box
        sx={{
          fontSize: "120px",
          whiteSpace: "nowrap",
          width: "720px",
        }}
        className="text"
      >
        <span>GAME OVER</span>
        <span>GAME OVER</span>
        <span>GAME OVER</span>
        <span>GAME OVER</span>
        <span>GAME OVER</span>
      </Box>
      <Box sx={{ mt: "180px" }}>
        <Leaderboard gameId={lastGameId} lines={4} />
      </Box>
      <Button
        sx={{ mt: 4 }}
        onClick={() => {
          window.open(
            `https://twitter.com/intent/tweet?text=%20%F0%9F%94%A5%20Just%20scored%20${score}%20points%20in%20Jokers%20of%20Neon!%20%F0%9F%94%A5%20Think%20you%20can%20beat%20me?%20Give%20it%20a%20shot%20at%20${GAME_URL}%20%F0%9F%83%8F%E2%9C%A8`,
            "_blank"
          );
        }}
        data-size="large"
      >
        Share on
        <Flex sx={{ ml: 2.5 }}>
          <FontAwesomeIcon fontSize={22} icon={faXTwitter} />
        </Flex>
      </Button>
      <Button
        size="l"
        variant="outline"
        sx={{
          mt: 10,
          backgroundColor: "transparent",
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
  );
};
