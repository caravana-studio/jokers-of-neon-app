import { Box, Button } from "@chakra-ui/react";
import { useUsername } from "../dojo/utils/useUsername";
import { useTournaments } from "../hooks/useTournaments";
import { useGameState } from "../state/useGameState";

export const TestTournament = () => {
  const { enterTournament, getPlayerGames } = useTournaments();
  const username = useUsername();
  const { setError } = useGameState();

  return (
    <Box>
      <Button
        onClick={async () => {
          if (username) {
            const result = await enterTournament(2, username);
            console.log("result", result);
          } else {
            console.error("No username");
            setError(true);
          }
        }}
      >
        Enter tournament
      </Button>
      <Button
        onClick={async () => {
          const result = await getPlayerGames();
          console.log("result", result);
        }}
      >
        get player games
      </Button>
    </Box>
  );
};
