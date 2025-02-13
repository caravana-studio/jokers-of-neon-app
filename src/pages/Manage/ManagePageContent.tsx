import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { PositionedGameMenu } from "../../components/GameMenu";
import { Card } from "../../types/Card";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";

export interface ManagePageContentProps {
  lastIndexTab?: number;
  discardedCards: Card[];
  preselectedCard?: Card;
  onCardClick: (card: Card) => void;
  sellButton: ReactNode;
  goBackButton: ReactNode;
}

export const ManagePageContent = ({
  discardedCards,
  preselectedCard,
  onCardClick,
  sellButton,
  goBackButton,
}: ManagePageContentProps) => {
  return (
    <>
      <PositionedGameMenu decoratedPage />
      <Flex
        height={"100%"}
        flexDirection={"column"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <SpecialCards
          discardedCards={discardedCards}
          preselectedCard={preselectedCard}
          onCardClick={onCardClick}
        />
        <Powerups />
        <Flex gap={12} mt={8}>
          {goBackButton}
          {sellButton}
        </Flex>
      </Flex>
    </>
  );
};
