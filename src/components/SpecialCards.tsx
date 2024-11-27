import { Flex, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider.tsx";
import { GREY_LINE } from "../theme/colors.tsx";
import { Card } from "../types/Card.ts";
import CachedImage from "./CachedImage.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CARD_WIDTH } from "../constants/visualProps.ts";

export const SpecialCards = () => {
  const game = useGame();
  const { t } = useTranslation(["game"]);

  const { discardSpecialCard, specialCards } = useGameContext();
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [preselectedCard, setPreselectedCard] = useState<Card | undefined>();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [specialsEnabled, setSpecialsEnabled] = useState(true);
  const { specialCardScale, isSmallScreen } = useResponsiveValues();
  const cardWidth = CARD_WIDTH * specialCardScale;
  console.log('cardWidth * 5 + (isSmallScreen ? 32 : 49) ', cardWidth * 5 + (isSmallScreen ? 32 : 49) )
  
  return (
    <Flex
      className="special-cards-step-3"
      border={`1px solid ${GREY_LINE}`}
      pl={2.5}
      pr={['25px', '35px']}
      py={[1, 2]}
      borderRadius={["12px", "20px"]}
      justifyContent="center"
      alignItems="center"
      position="relative"
      width={`${cardWidth * 5 + (isSmallScreen ? 32 : 49) }px`}
    >
      {specialsEnabled ? (
        <SpecialCardsRow cards={specialCards} />
      ) : (
        <RageCards />
      )}
      <Flex
        border={`1px solid ${GREY_LINE}`}
        borderRadius={["12px", "20px"]}
        height={["60px", "110px"]}
        flexDir="column"
        justifyContent="center"
        gap={2}
        alignItems="center"
        width={["28px", "50px"]}
        position="absolute"
        right={["-15px", "-25px"]}
        backgroundColor="backgroundBlue"
      >
        <Tooltip label={t("specials-box.specials-tooltip")}>
          <CachedImage
            cursor="pointer"
            src={`specials-box/special-icon-${specialsEnabled ? "on" : "off"}.png`}
            height={{ base: 5, sm: 8, md: 10 }}
            onClick={() => setSpecialsEnabled(!specialsEnabled)}
          />
        </Tooltip>
        <Tooltip label={t("specials-box.rage-tooltip")}>
          <CachedImage
            cursor="pointer"
            src={`specials-box/rage-icon-${specialsEnabled ? "off" : "on"}.png`}
            height={{ base: 5, sm: 8, md: 10 }}
            onClick={() => setSpecialsEnabled(!specialsEnabled)}
          />
        </Tooltip>
      </Flex>
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
