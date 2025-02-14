import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackToGameBtn } from "../../components/BackToGameBtn";
import { CashSymbol } from "../../components/CashSymbol";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { PlaysAvailableTable } from "../Plays/PlaysAvailableTable";
import { Deck } from "./Deck";

interface DeckPageContentMobileProps {
  state: {
    inStore: boolean;
    burn: boolean;
  };
}

export const DeckPageContentMobile = ({
  state,
}: DeckPageContentMobileProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardToBurn, setCardToBurn] = useState<Card>();

  const handleCardSelect = (card: Card) => {
    if (!burnItem.purchased) {
      if (cardToBurn?.id === card.id) {
        setCardToBurn(undefined);
      } else {
        setCardToBurn(card);
      }
    }
  };

  const { cash, burnCard, burnItem } = useStore();

  const handleBurnCard = (card: Card) => {
    burnCard(card);
  };

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

  const bottomBar = (
    <MobileBottomBar
      firstButton={
        state.burn ? (
          <Button
            size="xs"
            fontSize={10}
            isDisabled={
              cardToBurn === undefined ||
              cash < effectiveCost ||
              burnItem.purchased
            }
            onClick={() => {
              if (cardToBurn) handleBurnCard(cardToBurn);
            }}
          >
            {t("btns.burn").toUpperCase()}
            {" " + effectiveCost}
            <CashSymbol />
          </Button>
        ) : (
          <></>
        )
      }
      secondButton={<BackToGameBtn />}
      hideDeckButton
    />
  );

  return (
    <TabPattern bottomBar={bottomBar}>
      <Tab title={t("tabs.full-deck")}>
        <Deck
          inStore={state.inStore}
          burn={state.burn}
          onCardSelect={handleCardSelect}
        />
      </Tab>
      <Tab title={t("tabs.plays")}>
        <Flex
          w="100%"
          alignItems="center"
          height={"100%"}
          px={3}
          sx={{
            zIndex: 1,
          }}
        >
          <PlaysAvailableTable maxHeight={{ base: "80%", lg: "60%" }} />
        </Flex>
      </Tab>
    </TabPattern>
  );
};
