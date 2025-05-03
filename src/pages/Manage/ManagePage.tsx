import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { SellButton } from "./SellButton";

export const ManagePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens");

  const { isSmallScreen } = useResponsiveValues();

  const { sellSpecialCard } = useGameContext();
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const { highlightCard, highlightedCard, onClose } = useCardHighlight();

  const handleCardClick = (card: Card) => {
    highlightCard(card);
  };

  const goBackButton = (
    <Button
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      lineHeight={1.6}
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      onClick={() => {
        navigate("/store");
      }}
    >
      {t("power-ups.go-back")}
    </Button>
  );

  const sellButton = (
    <SellButton
      preselectedCard={highlightedCard}
      onClick={() => setConfirmationModalOpen(true)}
    />
  );

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} customBtn={sellButton} />
      )}
      {isSmallScreen ? (
        <ManagePageContentMobile
          discardedCards={discardedCards}
          preselectedCard={highlightedCard}
          onCardClick={handleCardClick}
          goBackButton={goBackButton}
        />
      ) : (
        <ManagePageContent
          discardedCards={discardedCards}
          preselectedCard={highlightedCard}
          onCardClick={handleCardClick}
          goBackButton={goBackButton}
        />
      )}
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("special-cards.confirmation-modal.title")}
          description={t("special-cards.confirmation-modal.description", {
            price: highlightedCard?.selling_price ?? 0,
          })}
          onConfirm={() => {
            setConfirmationModalOpen(false);
            onClose();
            highlightedCard &&
              sellSpecialCard(highlightedCard.idx).then((response) => {
                if (response) {
                  setDiscardedCards((prev) => [...prev, highlightedCard]);
                }
              });
          }}
        />
      )}
    </>
  );
};
