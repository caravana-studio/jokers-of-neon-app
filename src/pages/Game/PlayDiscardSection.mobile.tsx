import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useGameContext } from "../../providers/GameProvider";
import { useGetRound } from "../../queries/useGetRound";
import { useDroppable } from '@dnd-kit/core';

interface PlayDiscardSectionProps {
  itemDragged?: boolean;
}

export const PlayDiscardSection = ({ itemDragged = false } : PlayDiscardSectionProps) => {
  const { play, discard, gameId, preSelectedCards } = useGameContext();
  const { setNodeRef } = useDroppable({ id: "play-discard",});
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
        isDisabled={
          preSelectedCards?.length === 0 || !handsLeft || handsLeft === 0
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
        ref={setNodeRef}
        size="m"
        onClick={(e) => {
          e.stopPropagation();
          discard();
        }}
        width="48%"
        isDisabled={
          !itemDragged && (
          preSelectedCards?.length === 0 || !discardsLeft || discardsLeft === 0)
        }
      >
        <Box>
          <Text fontSize={itemDragged ? 12 : 16} height={"16px"}>
            {itemDragged ? "drop here to " : ""}discard
          </Text>
          <Heading mt={0.5} fontSize={9} color="black">
            {discardsLeft} left
          </Heading>
        </Box>
      </Button>
    </>
  );
};
