import { Box, Heading } from "@chakra-ui/react";
import { Card } from "../../types/Card";
import { getCardData } from "../../utils/getCardData";
import { Suits } from "../../enums/suits";
import DeckOverviewRowCards from "./DeckOverviewRowCards";

interface DeckOverviewProps {
  commonCards: Card[];
  effectCards: Card[];
}

export const DeckOverview = ({ commonCards, effectCards }: DeckOverviewProps) => {
  const clubsCards = commonCards.filter((card) => getCardData(card).suit === Suits.CLUBS);
  const heartsCards = commonCards.filter((card) => getCardData(card).suit === Suits.HEARTS);
  const diamondsCards = commonCards.filter((card) => getCardData(card).suit === Suits.DIAMONDS);
  const spadesCards = commonCards.filter((card) => getCardData(card).suit === Suits.SPADES);

  return (
    <Box backgroundColor="darkGrey" py={4} px={8}>
      <Heading size="lg" color="aqua" textAlign="center">
        CURRENT DECK
      </Heading>
      <DeckOverviewRowCards cards={spadesCards} suit="Spades" />
      <DeckOverviewRowCards cards={heartsCards} suit="Hearts" />
      <DeckOverviewRowCards cards={clubsCards} suit="Clubs" />
      <DeckOverviewRowCards cards={diamondsCards} suit="Diamonds" />
      <DeckOverviewRowCards cards={effectCards} suit="Effect Cards" />
    </Box>
  );
};

export default DeckOverview;
