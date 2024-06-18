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
  const jokerCards = commonCards.filter((card) => getCardData(card).suit === Suits.JOKER);

  return (
    <Box backgroundColor="darkGrey" py={4} px={8}>
      <DeckOverviewRowCards cards={spadesCards} reverse={true} />
      <DeckOverviewRowCards cards={heartsCards} reverse={true} />
      <DeckOverviewRowCards cards={clubsCards} reverse={true} />
      <DeckOverviewRowCards cards={diamondsCards} reverse={true} />
      <DeckOverviewRowCards cards={jokerCards.concat(effectCards)} />
    </Box>
  );
};

export default DeckOverview;
