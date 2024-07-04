import { Box, Button, Heading } from "@chakra-ui/react";
import { useGameContext } from "../../providers/GameProvider";

export const PlayDiscardSection = () => {
  const {
    play,
    discard,
    preSelectedCards,
    preSelectionLocked,
    handsLeft,
    discardsLeft,
  } = useGameContext();

  return (
    <>
      <Button
        size="m"
        onClick={(e) => {
          e.stopPropagation();
          play();
        }}
        width="48%"
        isDisabled={
          preSelectionLocked ||
          preSelectedCards?.length === 0 ||
          !handsLeft ||
          handsLeft === 0
        }
      >
        <Box>
          play
          <Heading mt={0.5} fontSize={9} color="black">
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
        isDisabled={
          preSelectionLocked ||
          preSelectedCards?.length === 0 ||
          !discardsLeft ||
          discardsLeft === 0
        }
      >
        <Box>
          discard
          <Heading mt={0.5} fontSize={9} color="black">
            {discardsLeft} left
          </Heading>
        </Box>
      </Button>
    </>
  );
};
