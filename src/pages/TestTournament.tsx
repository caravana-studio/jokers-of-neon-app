import { Box, Button } from "@chakra-ui/react";
import { useUsername } from "../dojo/utils/useUsername";
import { useTournaments } from "../hooks/useTournaments";
import manifest from "../manifest_tournaments.json";
import { useGameContext } from "../providers/GameProvider";
import { useGameState } from "../state/useGameState";
import { getNumberValueFromEvent } from "../utils/getNumberValueFromEvent";

const REGISTRATION_EVENT_KEY =
  "0x4e2e644a78cbd3f34c269bf04c1aa8945d757ee70365a91aa3ff1c725e5e422";

const translateEvent = (event: any) => {
  const name = translateName(event.keys[1]);
  console.log("name", name);
};

export const translateName = (selector: string) => {
  const model = manifest.models.find(
    (model: any) => model.selector === selector
  );
  return model?.tag?.split("-")[1];
};

export const TestTournament = () => {
  const { enterTournament, getPlayerGames } = useTournaments();
  const username = useUsername();
  const { setError } = useGameState();

  const { executeCreateGame } = useGameContext();
  return (
    <Box>
      <Button
        onClick={async () => {
          if (username) {
            const result = await enterTournament(2, username);
            console.log("result", result);
            (result as any).events.forEach(translateEvent);
            const registrationEvent = (result as any).events.find(
              (e: any) => e.keys[1] === REGISTRATION_EVENT_KEY
            );
            console.log("registrationEvent", registrationEvent);
            const gameId = getNumberValueFromEvent(registrationEvent, 4) ?? 0;
            console.log("gameId", gameId);
            executeCreateGame(gameId);
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
