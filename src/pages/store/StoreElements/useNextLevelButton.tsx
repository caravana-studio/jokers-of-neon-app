import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useCurrentHandStore } from "../../../state/useCurrentHandStore";
import { PowerUp } from "../../../types/Powerup/PowerUp";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { GameStateEnum } from "../../../dojo/typescript/custom";

export const useNextLevelButton = () => {
  const navigate = useCustomNavigate();
  const { t } = useTranslation(["store"]);

  const {
    setDestroyedSpecialCardId,
    onShopSkip,
    gameId,
    setPowerUps,
    maxPowerUpSlots,
  } = useGameContext();

  const { replaceCards } = useCurrentHandStore();
  const { skipShop } = useShopActions();

  const { locked, setLoading } = useStore();

  const handleNextLevelClick = () => {
    setLoading(true);
    onShopSkip();
    skipShop(gameId).then((response): void => {
      if (response.success) {
        replaceCards(response.cards);

        const powerUps: (PowerUp | null)[] = response.powerUps;
        while (powerUps.length < maxPowerUpSlots) {
          powerUps.push(null);
        }
        setPowerUps(powerUps);

        response.destroyedSpecialCard &&
          setDestroyedSpecialCardId(response.destroyedSpecialCard);
        navigate(GameStateEnum.Map);
      } else {
        setLoading(false);
      }
    });
  };

  return {
    nextLevelButton: (
      <Button
        className="game-tutorial-step-7"
        my={{ base: 0, md: 6 }}
        minWidth={"100px"}
        size={"md"}
        onClick={handleNextLevelClick}
        isDisabled={locked}
        lineHeight={1.6}
        variant="secondarySolid"
        fontSize={[10, 10, 10, 14, 14]}
      >
        {t("store.labels.next-level").toUpperCase()}
      </Button>
    ),
    nextLevelButtonProps: {
      onClick: handleNextLevelClick,
      disabled: locked,
      label: t("store.labels.next-level").toUpperCase(),
    },
  };
};
