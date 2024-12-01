import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const BackToGameBtn = () => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();

  return (
    <Button variant={"outlinePrimaryGlow"} onClick={() => navigate(-1)}>
      {t("game.deck.btns.back").toUpperCase()}
    </Button>
  );
};
