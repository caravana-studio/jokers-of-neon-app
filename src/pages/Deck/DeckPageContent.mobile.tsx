import { Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CashSymbol } from "../../components/CashSymbol";
import { DeckPreviewTable } from "../../components/DeckPreview/DeckPreviewTable";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore";
import { useShopStore } from "../../state/useShopStore";
import { Card } from "../../types/Card";
import { Deck } from "./Deck";

interface DeckPageContentMobileProps {
  state: {
    inStore: boolean;
    burn: boolean;
    map: boolean;
  };
}

export const DeckPageContentMobile = ({
  state,
}: DeckPageContentMobileProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardToBurn, setCardToBurn] = useState<Card>();
  const navigate = useNavigate();
  const { burnCard } = useStore();
  const { burnItem } = useShopStore();
  const { cash } = useGameStore();

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
  };

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem?.cost);

  return (
    <Flex
      flexDir="column"
      pt={"25px"}
      pb={state.inStore ? "0px" : "50px"}
      height={"100%"}
      width={"100%"}
      flexGrow={1}
      flexShrink={1}
      minH={0}
    >
      <Heading mb={1} size="sm" textAlign={"center"} variant="italic">
        {t("title")}
      </Heading>
      <MobileDecoration />
      {!state.inStore ? (
        <Flex flexDirection={"column"} gap={2} height={"100%"}>
          <Flex
            flexDirection={"column"}
            flexGrow={1}
            minHeight={0}
            px={2}
            overflow="hidden"
          >
            <Deck
              inStore={state.inStore}
              burn={state.burn}
              onCardSelect={handleCardSelect}
              inMap={state.map}
            />
          </Flex>
          <Flex
            py={2}
            px={2}
            height={"auto"}
            width={["100%", "80%"]}
            margin={"0 auto"}
          >
            <DeckPreviewTable />
          </Flex>
        </Flex>
      ) : (
        <Deck
          inStore={state.inStore}
          burn={state.burn}
          onCardSelect={handleCardSelect}
          inMap={state.map}
        />
      )}
      <MobileBottomBar
        firstButton={
          state.burn
            ? {
                onClick: () => {
                  if (cardToBurn) handleBurnCard(cardToBurn);
                },
                label: (
                  <>
                    {t("btns.burn").toUpperCase()}
                    {" " + effectiveCost}
                    <CashSymbol />
                  </>
                ),
                disabled:
                  cardToBurn === undefined ||
                  cash < effectiveCost ||
                  burnItem?.purchased,
              }
            : undefined
        }
      />
    </Flex>
  );
};
