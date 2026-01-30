import { Button, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CashSymbol } from "../../components/CashSymbol";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useBackToGameButton } from "../../components/useBackToGameButton";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore";
import { useShopStore } from "../../state/useShopStore";
import { Card } from "../../types/Card";
import { calculateBurnCost } from "../../utils/burnUtils";
import { Deck } from "./Deck";

interface DeckPageContentProps {
  state: {
    inStore: boolean;
    burn: boolean;
    map: boolean;
  };
}

export const DeckPageContent = ({ state }: DeckPageContentProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardsToBurn, setCardsToBurn] = useState<Card[]>([]);
  const { burnCards } = useStore();
  const { burnItem, locked } = useShopStore();
  const navigate = useNavigate();
  const { cash } = useGameStore();

  const { backToGameButton } = useBackToGameButton();

  const handleCardSelect = (card: Card) => {
    if (!burnItem?.purchased) {
      setCardsToBurn((prev) => {
        const exists = prev.find((c) => c.id === card.id);
        if (exists) {
          return prev.filter((c) => c.id !== card.id);
        }
        return [...prev, card];
      });
    }
  };

  const handleBurnCards = async () => {
    if (cardsToBurn.length > 0) {
      await burnCards(cardsToBurn, totalCost);
      navigate("/store");
      setCardsToBurn([]);
    }
  };

  const regularCost: number = useMemo(() => {
    return Number(burnItem?.cost ?? 0);
  }, [burnItem]);

  const firstCardCost: number = useMemo(() => {
    return burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : regularCost;
  }, [burnItem, regularCost]);

  const totalCost: number = useMemo(() => {
    return calculateBurnCost(cardsToBurn.length, firstCardCost, regularCost);
  }, [cardsToBurn.length, firstCardCost, regularCost]);

  return (
    <Flex
      w="100%"
      py={"80px"}
      alignItems="center"
      h="100%"
      px={3}
      flexDir="column"
      gap={4}
    >
      <MobileDecoration />
      <Deck
        inStore={state.inStore}
        burn={state.burn}
        onCardSelect={handleCardSelect}
        selectedCards={cardsToBurn}
        inMap={state.map}
      />
      <Flex gap={6} alignItems="center">
        {backToGameButton}
        {state.burn && (
          <Button
            minWidth={"100px"}
            size={"md"}
            lineHeight={1.6}
            fontSize={[10, 10, 10, 14, 14]}
            onClick={handleBurnCards}
            isDisabled={
              cardsToBurn.length === 0 ||
              cash < totalCost ||
              burnItem?.purchased ||
              locked
            }
            isLoading={locked}
          >
            {t("btns.burn").toUpperCase()}
            {cardsToBurn.length > 0 && ` ${cardsToBurn.length} ${cardsToBurn.length === 1 ? "card" : "cards"}`}
            <Flex ml={3} mr={1}>
              <CashSymbol />
            </Flex>
            {totalCost}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
