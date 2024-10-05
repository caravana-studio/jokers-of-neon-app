import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { isMobile } from "react-device-detect";
import { useGameContext } from "../../providers/GameProvider";
import { ButtonContainer } from "./ButtonContainer";

interface DiscardButtonProps {
  itemDragged?: boolean;
  highlight?: boolean;
}

export const DiscardButton = ({
  itemDragged = false,
  highlight = false,
}: DiscardButtonProps) => {
  const { preSelectedCards, discard, preSelectionLocked, discards } =
    useGameContext();

  const { setNodeRef } = useDroppable({
    id: "play-discard",
  });

  const cantDiscard =
    !highlight &&
    !itemDragged &&
    (preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !discards ||
      discards === 0);

  return (
    <ButtonContainer>
      <Button
        ref={setNodeRef}
        width={isMobile ? "48%" : "170px"}
        onClick={() => {
          discard();
        }}
        variant={cantDiscard ? "defaultOutline" : "solid"}
        isDisabled={cantDiscard}
        className="game-tutorial-step-3"
      >
        {isMobile ? (
          <Box>
            <Text
              fontFamily="Orbitron"
              fontSize={itemDragged ? 12 : 16}
              height={"16px"}
            >
              {itemDragged ? "drop here to " : ""}discard
            </Text>
            <Heading mt={1} fontSize={9}>
              {discards} left
            </Heading>
          </Box>
        ) : (
          "DISCARD"
        )}
      </Button>
      {!isMobile && <Text size="l">{discards} left</Text>}
    </ButtonContainer>
  );
};
