import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CashSymbol } from "../../components/CashSymbol";
import { DeckPreviewTable } from "../../components/DeckPreview/DeckPreviewTable";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore";
import { useShopStore } from "../../state/useShopStore";
import { useDeckStore } from "../../state/useDeckStore";
import { Card } from "../../types/Card";
import { Deck } from "./Deck";

interface DeckPageContentMobileProps {
  state: {
    inStore: boolean;
    burn: boolean;
    map: boolean;
  };
}

// Calculate progressive burn cost
// Formula: total = N * baseCost + 100 * (N * (N-1) / 2)
const calculateBurnCost = (numCards: number, baseCost: number): number => {
  if (numCards === 0) return 0;
  return numCards * baseCost + 100 * ((numCards * (numCards - 1)) / 2);
};

export const DeckPageContentMobile = ({
  state,
}: DeckPageContentMobileProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const [cardsToBurn, setCardsToBurn] = useState<Card[]>([]);
  const navigate = useNavigate();
  const { burnCards } = useStore();
  const { burnItem } = useShopStore();
  const { cash } = useGameStore();
  const { currentLength, size } = useDeckStore();

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

  const baseCost: number = useMemo(() => {
    return burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem?.cost ?? 0);
  }, [burnItem]);

  const totalCost: number = useMemo(() => {
    return calculateBurnCost(cardsToBurn.length, baseCost);
  }, [cardsToBurn.length, baseCost]);

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
      <Flex gap={2} alignItems="center" justifyContent="center" mb={1}>
        <Heading size="sm">{t("title")}</Heading>
        <Text
          size="lg"
          color="blueLight"
          fontWeight={500}
          whiteSpace="nowrap"
        >
          ({currentLength}/{size})
        </Text>
      </Flex>
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
              selectedCards={cardsToBurn}
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
          selectedCards={cardsToBurn}
          inMap={state.map}
        />
      )}
      <MobileBottomBar
        firstButton={
          state.burn
            ? {
                onClick: handleBurnCards,
                label: (
                  <Flex gap={1} alignItems="center">
                    {cardsToBurn.length > 0 && (
                      <Badge colorScheme="blue" fontSize="xs" mr={1}>
                        {cardsToBurn.length}
                      </Badge>
                    )}
                    {`${t("btns.burn").toUpperCase()} `}
                    <CashSymbol />
                    {` ${totalCost}`}
                  </Flex>
                ),
                disabled:
                  cardsToBurn.length === 0 ||
                  cash < totalCost ||
                  burnItem?.purchased,
              }
            : undefined
        }
      />
    </Flex>
  );
};
