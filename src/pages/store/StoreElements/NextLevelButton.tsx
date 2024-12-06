import { Button } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useShopActions } from "../../../dojo/useShopActions";
import { useGameContext } from "../../../providers/GameProvider";
import { useStore } from "../../../providers/StoreProvider";

interface NextLevelButtonProps {
  isSmallScreen: boolean;
}

const NextLevelButton: React.FC<NextLevelButtonProps> = ({ isSmallScreen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["store"]);

  const { setDestroyedSpecialCardId, onShopSkip, setHand, gameId } =
    useGameContext();
  const { skipShop } = useShopActions();

  const { locked, setLoading } = useStore();

  const handleNextLevelClick = () => {
    setLoading(true);
    onShopSkip();
    skipShop(gameId).then((response): void => {
      if (response.success) {
        setHand(response.cards);
        response.destroyedSpecialCard &&
          setDestroyedSpecialCardId(response.destroyedSpecialCard);
        navigate("/redirect/demo");
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <Button
      className="game-tutorial-step-7"
      my={isSmallScreen ? 0 : { base: 0, md: 6 }}
      w={"100%"}
      size={isSmallScreen ? "xs" : "md"}
      onClick={handleNextLevelClick}
      isDisabled={locked}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
    >
      {t("store.labels.next-level").toUpperCase()}
    </Button>
  );
};

export default NextLevelButton;
