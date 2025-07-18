import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const useBackToGameButton = () => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { state } = useGameStore();

  const onClick = () => {
    if (state !== GameStateEnum.NotStarted) {
      state === GameStateEnum.Store
        ? navigate("/store", { state: { lastTabIndex: 2 } })
        : navigate("/demo", {
            state: { skipRageAnimation: true },
          });
    } else navigate(-1);
  };

  return {
    backToGameButton: (
      <Button
        minWidth={"100px"}
        size={isSmallScreen ? "xs" : "md"}
        lineHeight={1.6}
        variant="secondarySolid"
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        onClick={onClick}
      >
        {t("game.deck.btns.back").toUpperCase()}
      </Button>
    ),
    backToGameButtonProps: {
      onClick,
      label: t("game.deck.btns.back").toUpperCase(),
    },
  };
};
