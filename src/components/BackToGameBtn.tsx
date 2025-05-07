import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { useGame } from "../dojo/queries/useGame";
import { GameStateEnum } from "../dojo/typescript/custom";

export const BackToGameBtn = () => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const game = useGame();

  return (
    <Button
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      onClick={() => {
        if (game) {
          game.state === GameStateEnum.Store
            ? navigate("/store", { state: { lastTabIndex: 2 } })
            : navigate("/demo", {
                state: { skipRageAnimation: true },
              });
        } else navigate(-1);
      }}
    >
      {t("game.deck.btns.back").toUpperCase()}
    </Button>
  );
};
