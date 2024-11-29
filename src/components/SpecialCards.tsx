import { Flex, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider.tsx";
import { GREY_LINE } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { Card } from "../types/Card.ts";
import CachedImage from "./CachedImage.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { t } = useTranslation(["game"]);

  const { discardSpecialCard } = useGameContext();
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [preselectedCard, setPreselectedCard] = useState<Card | undefined>();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { specialCardScale, isSmallScreen } = useResponsiveValues();
  const cardWidth = CARD_WIDTH * specialCardScale;
  const cardHeight = CARD_HEIGHT * specialCardScale;
  const { specialSwitcherOn } = useGameContext();

  return (
    <Flex
      className="special-cards-step-3"
      border={`1px solid ${GREY_LINE}`}
      pl={[2.5, 4]}
      pr={["15px", "35px"]}
      py={[1, 2]}
      borderRadius={["12px", "20px"]}
      justifyContent="center"
      alignItems="center"
      position="relative"
      width={`${cardWidth * 5 + (isSmallScreen ? 32 : 49)}px`}
      height={`${cardHeight + (isSmallScreen ? 10 : 16)}px`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("game.special-cards.confirmation-modal.title")}
          description={t("game.special-cards.confirmation-modal.description")}
          onConfirm={() => {
            setConfirmationModalOpen(false);
            preselectedCard &&
              discardSpecialCard(preselectedCard.idx).then((response) => {
                if (response) {
                  setDiscardedCards((prev) => [...prev, preselectedCard]);
                  setPreselectedCard(undefined);
                }
              });
          }}
        />
      )}
    </Flex>
  );
};
