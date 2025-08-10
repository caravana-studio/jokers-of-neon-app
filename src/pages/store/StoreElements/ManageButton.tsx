import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../../../state/useShopStore";

interface ManageButtonProps {
  isSmallScreen: boolean;
}

const ManageButton: React.FC<ManageButtonProps> = ({ isSmallScreen }) => {
  const { t } = useTranslation(["store"]);
  const navigate = useNavigate();

  const { specialCards } = useShopStore();

  return (
    specialCards.length > 0 && (
      <Button
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        w={
          isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]
        }
        size={isSmallScreen ? "xs" : "md"}
        onClick={() => {
          navigate("/manage");
        }}
      >
        {t("store.labels.manage").toUpperCase()}
      </Button>
    )
  );
};

export default ManageButton;
