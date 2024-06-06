import { Box, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaderboard } from "../components/Leaderboard";
import { GAME_ID } from "../constants/localStorage";
import { noisyTv } from "../scripts/noisyTv";

export const GameOver = () => {
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
      {/* 
      <Heading
        sx={{
          mt: "180px",
        }}
        variant="neonWhite"
        size="xl"
      >
        LEVEL <RollingNumber n={level} />
      </Heading>
      <Heading variant="neonGreen" size="l">
        <RollingNumber n={score} /> points
      </Heading> */}
      <Box sx={{ mt: "180px" }}>
        <Leaderboard lines={4} />
      </Box>
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
