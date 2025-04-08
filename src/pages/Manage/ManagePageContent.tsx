import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BackgroundDecoration } from "../../components/Background";
import { Card } from "../../types/Card";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { Coins } from "../store/Coins";
import { StoreTopBar } from "../DynamicStore/storeComponents/TopBar/StoreTopBar";

export interface ManagePageContentProps {
  lastIndexTab?: number;
  discardedCards: Card[];
  preselectedCard?: Card;
  onCardClick: (card: Card) => void;
  goBackButton: ReactNode;
  onTabChange?: (index: number) => void;
}

export const ManagePageContent = ({
  discardedCards,
  preselectedCard,
  onCardClick,
  goBackButton,
}: ManagePageContentProps) => {
  return (
    <BackgroundDecoration>
      <Flex
        height={"100%"}
        flexDirection={"column"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Box width={"100%"} mb={2}>
          <StoreTopBar hideReroll />
        </Box>
        <SpecialCards
          discardedCards={discardedCards}
          preselectedCard={preselectedCard}
          onCardClick={onCardClick}
        />
        <Powerups />
        <Flex gap={12} mt={8}>
          {goBackButton}
        </Flex>
      </Flex>
    </BackgroundDecoration>
  );
};
