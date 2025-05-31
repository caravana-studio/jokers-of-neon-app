import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { BarButton } from "../../components/MobileBottomBar";

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
      <BarButton
        mx={{ base: 6, md: 0 }}
        width={"auto"}
        fontSize={12}
        isDisabled={disabled}
        variant={disabled ? "defaultOutline" : "solid"}
        opacity={opacity}
        transition="opacity 0.3s ease"
        label={t("store.packs.continue-btn")}
        onClick={() => {
          if (cardsToKeep === 0) {
            setConfirmationModalOpen(true);
          } else {
            onConfirm();
          }
        }}
      />

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
