import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { SellButton } from "./SellButton";
import { GoBackButton } from "../../components/GoBackButton";
import { PowerUp } from "../../types/Powerup/PowerUp";
import { MobilePowerupHighlight } from "../../components/MobilePowerupHighlight";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";
import { usePowerupHighlight } from "../../providers/HighlightProvider/PowerupHighlightProvider";
import { getPowerUpData } from "../../data/powerups";

export const ManagePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens");

  const { isSmallScreen } = useResponsiveValues();

  const { sellSpecialCard, sellPowerup } = useGameContext();

  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [discardedPowerups, setDiscardedPowerups] = useState<PowerUp[]>([]);

  const [specialConfirmationModalOpen, setSpecialConfirmationModalOpen] =
    useState(false);
  const [powerupConfirmationModalOpen, setPowerupConfirmationModalOpen] =
    useState(false);

  const {
    highlightItem: highlightSpecialCard,
    highlightedItem: highlightedSpecialCard,
    onClose: onCloseSpecial,
  } = useCardHighlight();

  const {
    highlightItem: highlightPowerup,
    highlightedItem: highlightedPowerup,
    onClose: onClosePowerup,
  } = usePowerupHighlight();

  const handleCardClick = (card: Card) => {
    highlightSpecialCard(card);
  };

  const handlePowerupClick = (powerup: PowerUp) => {
    highlightPowerup(powerup);
  };

  const sellSpecialButton = (
    <SellButton
      preselectedCard={highlightedSpecialCard as Card}
      onClick={() => setSpecialConfirmationModalOpen(true)}
      price={highlightedSpecialCard?.selling_price ?? 0}
    />
  );

  const sellPowerupButton = (
    <SellButton
      preselectedCard={highlightedPowerup as PowerUp}
      onClick={() => setPowerupConfirmationModalOpen(true)}
      price={
        getPowerUpData(highlightedPowerup?.power_up_id ?? 0)?.selling_price ?? 0
      }
    />
  );

  return (
    <>
      {highlightedSpecialCard && (
        <MobileCardHighlight
          card={highlightedSpecialCard as Card}
          customBtn={sellSpecialButton}
        />
      )}
      {highlightedPowerup && (
        <MobilePowerupHighlight
          powerup={highlightedPowerup as PowerUp}
          customBtn={sellPowerupButton}
        />
      )}
      {isSmallScreen ? (
        <ManagePageContentMobile
          discardedCards={discardedCards}
          preselectedCard={highlightedSpecialCard as Card}
          preselectedPowerup={highlightedPowerup as PowerUp | undefined}
          onCardClick={handleCardClick}
          onPowerupClick={handlePowerupClick}
          goBackButton={<GoBackButton />}
        />
      ) : (
        <ManagePageContent
          discardedCards={discardedCards}
          preselectedCard={highlightedSpecialCard as Card}
          preselectedPowerup={highlightedPowerup as PowerUp | undefined}
          onCardClick={handleCardClick}
          onPowerupClick={handlePowerupClick}
          goBackButton={<GoBackButton />}
        />
      )}
      {specialConfirmationModalOpen && (
        <ConfirmationModal
          close={() => setSpecialConfirmationModalOpen(false)}
          title={t("special-cards.confirmation-modal.title")}
          description={t("special-cards.confirmation-modal.description", {
            price: highlightedSpecialCard?.selling_price ?? 0,
          })}
          onConfirm={() => {
            setSpecialConfirmationModalOpen(false);
            onCloseSpecial();
            highlightedSpecialCard &&
              sellSpecialCard(highlightedSpecialCard.idx).then((response) => {
                if (response) {
                  setDiscardedCards((prev) => [
                    ...prev,
                    highlightedSpecialCard,
                  ]);
                }
              });
          }}
        />
      )}
      {powerupConfirmationModalOpen && (
        <ConfirmationModal
          close={() => setPowerupConfirmationModalOpen(false)}
          title={t("power-ups.confirmation-modal.title")}
          description={t("power-ups.confirmation-modal.description", {
            price:
              getPowerUpData(highlightedPowerup?.power_up_id ?? 0)
                ?.selling_price ?? 0,
          })}
          onConfirm={() => {
            setPowerupConfirmationModalOpen(false);
            onClosePowerup();
            highlightedPowerup &&
              sellPowerup(highlightedPowerup.idx).then((response) => {
                if (response) {
                  setDiscardedPowerups((prev) => [...prev, highlightedPowerup]);
                }
              });
          }}
        />
      )}
    </>
  );
};
