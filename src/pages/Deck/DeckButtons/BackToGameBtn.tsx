import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const BackToGameBtn = () => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <Button
      variant={"outlinePrimaryGlow"}
      onClick={() =>
        navigate(state.inStore ? "/store" : "/demo", {
          state: { skipRageAnimation: true },
        })
      }
    >
      {t("game.deck.btns.back").toUpperCase()}
    </Button>
  );
};
