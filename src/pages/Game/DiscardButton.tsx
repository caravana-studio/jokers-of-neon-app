import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useGameContext } from "../../providers/GameProvider";
import { ButtonContainer } from "./ButtonContainer";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../../theme/responsiveSettings";

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

  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();

  return (
    <ButtonContainer>
      <Button
        ref={setNodeRef}
        width={["48%", "48%", "150px"]}
        onClick={() => {
          discard();
        }}
        variant={cantDiscard ? "defaultOutline" : "solid"}
        isDisabled={cantDiscard}
        className="game-tutorial-step-3"
      >
        {isSmallScreen ? (
          <Box>
            <Text
              fontFamily="Orbitron"
              fontSize={itemDragged ? 12 : 16}
              height={"16px"}
            >
              {itemDragged
                ? t("game.preselected-cards-section.discard-btn-lbl.lbl") + " "
                : ""}
              {t("game.preselected-cards-section.discard-btn-lbl.discard")}
            </Text>
            <Heading mt={1} fontSize={9}>
              {t("game.preselected-cards-section.discard-btn-lbl.left", {
                discards: discards,
              })}
            </Heading>
          </Box>
        ) : (
          t(
            "game.preselected-cards-section.discard-btn-lbl.discard"
          ).toUpperCase()
        )}
      </Button>
      {!isSmallScreen && (
        <Text size="l">
          {t("game.preselected-cards-section.discard-btn-lbl.left", {
            discards: discards,
          })}
        </Text>
      )}
    </ButtonContainer>
  );
};
