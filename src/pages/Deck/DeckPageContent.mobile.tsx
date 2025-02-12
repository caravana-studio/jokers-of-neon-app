import { Button, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { CashSymbol } from "../../components/CashSymbol";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { PlaysAvailableTable } from "../Plays/PlaysAvailableTable";
import { Deck } from "./Deck";
import { BackToGameBtn } from "../../components/BackToGameBtn";

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
  const [tabIndex, setTabIndex] = useState(0);

  const handleCardSelect = (card: Card) => {
    if (!burnItem.purchased) {
      if (cardToBurn?.id === card.id) {
        setCardToBurn(undefined);
      } else {
        setCardToBurn(card);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (tabIndex < 1) setTabIndex(tabIndex + 1);
    },
    onSwipedRight: () => {
      if (tabIndex === 0) {
        navigate("/demo");
      } else if (tabIndex > 0) {
        setTabIndex(tabIndex - 1);
      }
    },
    trackTouch: true,
  });

  const { cash, burnCard, burnItem } = useStore();

  const handleBurnCard = (card: Card) => {
    burnCard(card);
  };

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

  return (
    <>
      <Flex
        px={{ base: 0, md: 20 }}
        mt={4}
        pb={3}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        flexDirection={"column"}
        {...handlers}
      >
        <MobileDecoration />
        <Flex
          alignItems={"center"}
          width={"100%"}
          flexDirection={"column"}
          mt={2}
          px={4}
        >
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
            mt={2}
          >
            <TabList>
              <Tab fontSize={12}>{t("tabs.full-deck")}</Tab>
              <Tab fontSize={12}>{t("tabs.plays")}</Tab>
            </TabList>
          </Tabs>
        </Flex>

        {tabIndex === 0 && (
          <Deck
            inStore={state.inStore}
            burn={state.burn}
            onCardSelect={handleCardSelect}
          />
        )}

        {tabIndex === 1 && (
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
        )}
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
          secondButton={<BackToGameBtn state={state} />}
          hideDeckButton
        />
      </Flex>
    </>
  );
};
