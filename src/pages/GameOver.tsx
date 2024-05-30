import { Box, Button, Heading, useTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RollingNumber } from "../components/RollingNumber";
import { GAME_ID } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { getRound } from "../dojo/utils/getRound";
import { noisyTv } from "../scripts/noisyTv";

export const GameOver = () => {
  const [gameId, setGameId] = useState<number>(
    Number(localStorage.getItem(GAME_ID)) ?? 0
  );
  const { colors } = useTheme();

  const {
    setup: {
      systemCalls: { createGame, checkHand, discard, play },
      clientComponents: { Game, Round },
    },
    account,
  } = useDojo();

  const round = getRound(gameId, Round);
  const score = round?.score ? Number(round?.score) : 0;

  const navigate = useNavigate();

  useEffect(() => {
    noisyTv(100);
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

      <Heading
        sx={{
          mt: "180px",
        }}
        variant="neonWhite"
        size="xl"
      >
        SCORE: <RollingNumber n={score} />
      </Heading>
      <Button
        size="l"
        variant="outline"
        sx={{
          mt: 10,
          backgroundColor: "transparent",
        }}
        onClick={() => {
          localStorage.removeItem(GAME_ID);
          navigate("/demo");
        }}
      >
        START NEW GAME
      </Button>
    </Box>
  );
};
