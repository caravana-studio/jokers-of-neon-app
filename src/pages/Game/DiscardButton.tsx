import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { ButtonContainer } from "./ButtonContainer";

interface DiscardButtonProps {
  highlight?: boolean;
}

export const DiscardButton = ({ highlight = false }: DiscardButtonProps) => {
  const { preSelectedCards, discard, preSelectionLocked, discards } =
    useGameContext();

  const cantDiscard =
    !highlight &&
    (preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !discards ||
      discards === 0);

  const { t } = useTranslation(["game"]);

  return (
    <ButtonContainer>
      <Button
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
            <Text fontFamily="Orbitron" fontSize={16} height={"16px"}>
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
      {!isMobile && (
        <Text size="l">
          {t("game.preselected-cards-section.discard-btn-lbl.left", {
            discards: discards,
          })}
        </Text>
      )}
    </ButtonContainer>
  );
};
