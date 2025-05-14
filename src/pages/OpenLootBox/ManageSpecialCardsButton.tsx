import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ManageSpecialCardsButtonProps {
  opacity: number;
}

export const ManageSpecialCardsButton: React.FC<
  ManageSpecialCardsButtonProps
> = ({ opacity }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["store"]);

  return (
    <Button
      variant="outline"
      fontSize={12}
      mx={{ base: 6, md: 0 }}
      opacity={opacity}
      transition="opacity 0.3s ease"
      onClick={() => {
        navigate("/manage");
      }}
    >
      {t("store.packs.special-cards-btn")}
    </Button>
  );
};
