import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useGameContext } from "../../providers/GameProvider";

interface PlayDiscardSectionProps {
  itemDragged?: boolean;
}

export const PlayDiscardSection = ({
  itemDragged = false,
}: PlayDiscardSectionProps) => {
  const {
    play,
    discard,
    preSelectedCards,
    preSelectionLocked,
    handsLeft,
    discardsLeft,
  } = useGameContext();
  const { setNodeRef } = useDroppable({ id: "play-discard" });

  return (
    <>
      <Button
        size="m"
        onClick={(e) => {
          e.stopPropagation();
          play();
        }}
        width="48%"
        py={1}
        isDisabled={
          preSelectionLocked ||
          preSelectedCards?.length === 0 ||
          !handsLeft ||
          handsLeft === 0
        }
      >
        <Box>
          <Text fontFamily="Orbitron" fontSize={16} height={"16px"}>
            play
          </Text>
          <Heading mt={1} fontSize={9} color="black">
            {handsLeft} left
          </Heading>
        </Box>
      </Button>
      <Button
        ref={setNodeRef}
        size="m"
        variant="secondarySolid"
        onClick={(e) => {
          e.stopPropagation();
          discard();
        }}
        width="48%"
        py={1}
        isDisabled={
          !itemDragged &&
          (preSelectionLocked ||
            preSelectedCards?.length === 0 ||
            !discardsLeft ||
            discardsLeft === 0)
        }
      >
        <Box>
          <Text
            fontFamily="Orbitron"
            fontSize={itemDragged ? 12 : 16}
            height={"16px"}
          >
            {itemDragged ? "drop here to " : ""}discard
          </Text>
          <Heading mt={1} fontSize={9} color="black">
            {discardsLeft} left
          </Heading>
        </Box>
      </Button>
    </>
  );
};
