import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useGameContext } from "../../../providers/GameProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useAnimationStore } from "../../../state/useAnimationStore";
import { useCurrentHandStore } from "../../../state/useCurrentHandStore";
import { useGameStore } from "../../../state/useGameStore";
import { useShopStore } from "../../../state/useShopStore";

export const useNextLevelButton = () => {
  const navigate = useCustomNavigate();
  const { t } = useTranslation(["store"]);

  const { onShopSkip } = useGameContext();
  const { id: gameId, setPowerUps } = useGameStore();

  const { replaceCards } = useCurrentHandStore();
  const { skipShop } = useShopActions();
  const { setDestroyedSpecialCardId } = useAnimationStore();

  const { setLoading } = useStore();
  const { locked } = useShopStore();

  const handleNextLevelClick = () => {
    setLoading(true);
    onShopSkip();
    skipShop(gameId).then((response): void => {
      if (response.success) {
        replaceCards(response.cards);
        setPowerUps(response.powerUps);

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
