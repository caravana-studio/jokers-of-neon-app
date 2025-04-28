import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../../components/ConfirmationModal";

interface ChooseCardsButtonProps {
  disabled: boolean;
  opacity: number;
  onConfirm: () => void;
  cardsToKeep: number;
}

export const ChooseCardsButton: React.FC<ChooseCardsButtonProps> = ({
  disabled,
  opacity,
  onConfirm,
  cardsToKeep,
}) => {
  const { t } = useTranslation(["store"]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  return (
    <>
      <Button
        mx={{ base: 6, md: 0 }}
        fontSize={12}
        isDisabled={disabled}
        variant={disabled ? "defaultOutline" : "solid"}
        opacity={opacity}
        onClick={() => {
          if (cardsToKeep === 0) {
            setConfirmationModalOpen(true);
          } else {
            onConfirm();
          }
        }}
      >
        {t("store.packs.continue-btn")}
      </Button>

      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("store.packs.confirmation-modal.head")}
          description={t("store.packs.confirmation-modal.description")}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};
