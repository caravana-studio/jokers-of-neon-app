import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

export const BackToGameBtn = () => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Button
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      onClick={() =>
        navigate(state?.inStore ? "/store" : "/demo", {
          state: { skipRageAnimation: true },
        })
      }
    >
      {t("game.deck.btns.back").toUpperCase()}
    </Button>
  );
};
