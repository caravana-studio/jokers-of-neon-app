import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { GoBackButton } from "../../components/GoBackButton";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { MobilePowerupHighlight } from "../../components/MobilePowerupHighlight";
import { getPowerUpData } from "../../data/powerups";
import { useDojo } from "../../dojo/useDojo";
import { useGameContext } from "../../providers/GameProvider";
import { usePowerupHighlight } from "../../providers/HighlightProvider/PowerupHighlightProvider";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { PowerUp } from "../../types/Powerup/PowerUp";
import { ManagePageContent } from "./ManagePageContent";
import { ManagePageContentMobile } from "./ManagePageContent.mobile";
import { SellButton } from "./SellButton";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

export const ManagePage = () => {
  const { t } = useTranslation("intermediate-screens");

  const {
    setup: { client },
  } = useDojo();

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

  const { refetchGameStore, id: gameId } = useGameStore();

  const handlePowerupClick = (powerup: PowerUp) => {
    highlightPowerup(powerup);
  };

  useEffect(() => {
    if (client && gameId) {
      refetchGameStore(client, gameId);
    }
  }, [client, gameId]);

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
          discardedPowerups={discardedPowerups}
          preselectedCard={highlightedSpecialCard as Card}
          preselectedPowerup={highlightedPowerup as PowerUp | undefined}
          onCardClick={handleCardClick}
          onPowerupClick={handlePowerupClick}
          goBackButton={<GoBackButton />}
        />
      ) : (
        <ManagePageContent
          discardedCards={discardedCards}
          discardedPowerups={discardedPowerups}
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
              sellSpecialCard(highlightedSpecialCard).then((response) => {
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
                  refetchGameStore(client, gameId);
                }
              });
          }}
        />
      )}
    </>
  );
};
