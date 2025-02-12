import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CashSymbol } from "../../components/CashSymbol";
import { PositionedGameMenu } from "../../components/GameMenu";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { Deck } from "./Deck";
import { BackToGameBtn } from "../../components/BackToGameBtn";

interface DeckPageContentProps {
  state: {
    inStore: boolean;
    burn: boolean;
  };
}

export const DeckPageContent = ({ state }: DeckPageContentProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardToBurn, setCardToBurn] = useState<Card>();
  const { cash, burnCard, burnItem } = useStore();

  const handleCardSelect = (card: Card) => {
    if (!burnItem.purchased) {
      if (cardToBurn?.id === card.id) {
        setCardToBurn(undefined);
      } else {
        setCardToBurn(card);
      }
    }
  };

  const handleBurnCard = (card: Card) => {
    burnCard(card);
    setCardToBurn(undefined);
  };

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

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
      />
      <Flex gap={6}>
        <BackToGameBtn state={state} />
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
              burnItem.purchased
            }
          >
            {t("btns.burn").toUpperCase()}
            {" " + effectiveCost}
            <CashSymbol />
          </Button>
        )}
      </Flex>
      <PositionedGameMenu />
    </Flex>
  );
};
