import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface SeeFullDeckButtonProps {
  isSmallScreen: boolean;
}

const SeeFullDeckButton: React.FC<SeeFullDeckButtonProps> = ({
  isSmallScreen,
}) => {
  const { t } = useTranslation(["store"]);
  const navigate = useNavigate();

  return (
    <Button
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      w={isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]}
      onClick={() => {
        navigate("/deck", { state: { inStore: true } });
      }}
    >
      {t("store.labels.see-my").toUpperCase()}
      {isSmallScreen && <br />} {t("store.labels.full-deck").toUpperCase()}
    </Button>
  );
};

export default SeeFullDeckButton;
