import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { RollingNumber } from "../components/RollingNumber";
import { GAME_ID } from "../constants/localStorage";
import { useDojo } from "../dojo/useDojo";
import { getRound } from "../dojo/utils/getRound";
import { noisyTv } from "../scripts/noisyTv";
import { useNavigate } from "react-router-dom";

export const GameOver = () => {
  const [gameId, setGameId] = useState<number>(
    Number(localStorage.getItem(GAME_ID)) ?? 0
  );

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
          fontSize: 50,
          color: "white",
          textShadow: "0 0 20px #fd4bad",
          filter: "blur(1px)",
        }}
        className="ui-text"
      >
        SCORE: <RollingNumber n={score} />
      </Heading>
      <Button
        sx={{
          fontSize: 40,
          px: 90,
          py: 8,
          borderRadius: 0,
          mt: 10,
          fontFamily: "Sys",
          filter: "blur(1px)",
          textShadow: "0 0 20px #33effa",
          backgroundColor: "transparent",
          boxShadow: `0px 0px 15px 0px #33effa `,
          pointerEvents: "all",
        }}
        onClick={() => {
          localStorage.removeItem(GAME_ID)
          navigate('/demo')
        }}
      >
        START NEW GAME
      </Button>
    </Box>
  );
};
