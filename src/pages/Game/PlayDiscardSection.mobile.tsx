import { Box, Button, Heading } from "@chakra-ui/react";
import { useGameContext } from "../../providers/GameProvider";
import { useGetRound } from "../../queries/useGetRound";

export const PlayDiscardSection = () => {
  const { play, discard, gameId } = useGameContext();
  const { data: round } = useGetRound(gameId);
  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  return (
    <>
      <Button
        size="m"
        onClick={(e) => {
          e.stopPropagation();
          play();
        }}
        width="48%"
      >
        <Box>
          play
          <Heading mt={0.5} fontSize={8} color="black">
            {handsLeft} left
          </Heading>
        </Box>
      </Button>
      <Button
        size="m"
        onClick={(e) => {
          e.stopPropagation();
          discard();
        }}
        width="48%"
      >
        <Box>
          discard
          <Heading mt={0.5} fontSize={8} color="black">
            {discardsLeft} left
          </Heading>
        </Box>
      </Button>
    </>
  );
};
