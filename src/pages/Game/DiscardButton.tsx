import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { isMobile } from "react-device-detect";
import { useRound } from "../../dojo/queries/useRound";
import { useGameContext } from "../../providers/GameProvider";
import { ButtonContainer } from "./ButtonContainer";
import { useTranslation } from "react-i18next";

interface DiscardButtonProps {
  itemDragged?: boolean;
  highlight?: boolean;
}

export const DiscardButton = ({ itemDragged = false, highlight = false }: DiscardButtonProps) => {
  const { preSelectedCards, discard, preSelectionLocked } =
    useGameContext();

  const round = useRound();
  const discardsLeft = round?.discard ?? 0;
  const { setNodeRef } = useDroppable({
    id: "play-discard",
  });

  const cantDiscard = !highlight && !itemDragged &&
  (preSelectionLocked ||
    preSelectedCards?.length === 0 ||
    !discardsLeft ||
    discardsLeft === 0);

    const { t } = useTranslation(["game"]);

  return (
    <ButtonContainer>
      <Button
        ref={setNodeRef}
        width={isMobile ? "48%" : "170px"}
        onClick={(e) => {
          e.stopPropagation();
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
              {itemDragged ?  t('game.preselected-cards-section.discard-btn-lbl.lbl') +" " : ""}{t('game.preselected-cards-section.discard-btn-lbl.discard')}
            </Text>
            <Heading mt={1} fontSize={9}>
              {discardsLeft} {t('game.preselected-cards-section.discard-btn-lbl.left')}
            </Heading>
          </Box>
        ) : (
          t('game.preselected-cards-section.discard-btn-lbl.discard').toUpperCase()
        )}
      </Button>
      {!isMobile && <Text size="l">{discardsLeft} {t('game.preselected-cards-section.discard-btn-lbl.left')}</Text>}
    </ButtonContainer>
  );
};
