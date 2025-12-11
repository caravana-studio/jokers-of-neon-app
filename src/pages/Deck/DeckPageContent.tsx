import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
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

export const DeckPageContent = ({ state }: DeckPageContentProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardToBurn, setCardToBurn] = useState<Card>();
  const { burnCard } = useStore();
  const { burnItem } = useShopStore();
  const navigate = useNavigate();
  const { cash } = useGameStore();

  const { backToGameButton } = useBackToGameButton();

  const handleCardSelect = (card: Card) => {
    if (!burnItem?.purchased) {
      if (cardToBurn?.id === card.id) {
        setCardToBurn(undefined);
      } else {
        setCardToBurn(card);
      }
    }
  };

  const handleBurnCard = (card: Card) => {
    burnCard(card);
    navigate("/store");
    setCardToBurn(undefined);
  };

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem?.cost);

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
        inMap={state.map}
      />
      <Flex gap={6}>
        {backToGameButton}
        {state.burn && (
          <Button
            minWidth={"100px"}
            size={"md"}
            lineHeight={1.6}
            fontSize={[10, 10, 10, 14, 14]}
            onClick={() => {
              if (cardToBurn) handleBurnCard(cardToBurn);
            }}
            isDisabled={
              cardToBurn === undefined ||
              cash < effectiveCost ||
              burnItem?.purchased
            }
          >
            {t("btns.burn").toUpperCase()}
            <Flex ml={3} mr={1}>
              <CashSymbol />
            </Flex>
            {" " + effectiveCost}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
