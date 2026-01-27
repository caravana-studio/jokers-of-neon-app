import { Badge, Button, Flex } from "@chakra-ui/react";
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
import { Deck } from "./Deck";

interface DeckPageContentProps {
  state: {
    inStore: boolean;
    burn: boolean;
    map: boolean;
  };
}

// Calculate progressive burn cost
// First card uses discounted price (if available), remaining cards use regular price
// Formula: firstCardCost + (N-1) * regularCost + 100 * ((N-1) * (N-2) / 2)
const calculateBurnCost = (
  numCards: number,
  firstCardCost: number,
  regularCost: number
): number => {
  if (numCards === 0) return 0;
  if (numCards === 1) return firstCardCost;
  const remainingCards = numCards - 1;
  const remainingCost =
    remainingCards * regularCost +
    100 * ((remainingCards * (remainingCards - 1)) / 2);
  return firstCardCost + remainingCost;
};

export const DeckPageContent = ({ state }: DeckPageContentProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardsToBurn, setCardsToBurn] = useState<Card[]>([]);
  const { burnCards } = useStore();
  const { burnItem } = useShopStore();
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
          <Flex alignItems="center" gap={2}>
            {cardsToBurn.length > 0 && (
              <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                {cardsToBurn.length} {cardsToBurn.length === 1 ? "card" : "cards"}
              </Badge>
            )}
            <Button
              minWidth={"100px"}
              size={"md"}
              lineHeight={1.6}
              fontSize={[10, 10, 10, 14, 14]}
              onClick={handleBurnCards}
              isDisabled={
                cardsToBurn.length === 0 ||
                cash < totalCost ||
                burnItem?.purchased
              }
            >
              {t("btns.burn").toUpperCase()}
              <Flex ml={3} mr={1}>
                <CashSymbol />
              </Flex>
              {" " + totalCost}
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
