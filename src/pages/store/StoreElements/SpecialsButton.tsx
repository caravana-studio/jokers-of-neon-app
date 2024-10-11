import { Button } from "@chakra-ui/react";
import { Card } from "../../../types/Card";
import { useTranslation } from "react-i18next";

interface SpecialsButtonProps {
  specialCards: Card[];
  setSpecialCardsModalOpen: (value: boolean) => void;
  isSmallScreen: boolean;
}

const SpecialsButton: React.FC<SpecialsButtonProps> = ({
  specialCards,
  setSpecialCardsModalOpen,
  isSmallScreen,
}) => {
  const { t } = useTranslation(["store"]);

  return (
    specialCards.length > 0 && (
      <Button
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        w={
          isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]
        }
        onClick={() => {
          setSpecialCardsModalOpen(true);
        }}
      >
        {t("store.labels.see-my").toUpperCase()}
        {isSmallScreen && <br />}{" "}
        {t("store.labels.special-cards").toUpperCase()}
      </Button>
    )
  );
};

export default SpecialsButton;
