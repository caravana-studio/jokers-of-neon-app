import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BackgroundDecoration } from "../../components/Background";
import { Card } from "../../types/Card";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { Coins } from "../store/Coins";
import { StoreTopBar } from "../DynamicStore/storeComponents/TopBar/StoreTopBar";
import { PowerUp } from "../../types/Powerup/PowerUp";

export interface ManagePageContentProps {
  lastIndexTab?: number;
  discardedCards: Card[];
  preselectedCard?: Card;
  preselectedPowerup?: PowerUp;
  onCardClick: (card: Card) => void;
  onPowerupClick: (powerup: PowerUp) => void;
  onTabChange?: (index: number) => void;
}

interface ManageContentDesktopProps extends ManagePageContentProps {
  goBackButton: ReactNode;
}

export const ManagePageContent = ({
  discardedCards,
  preselectedCard,
  preselectedPowerup,
  onCardClick,
  onPowerupClick,
  goBackButton,
}: ManageContentDesktopProps) => {
  return (
    <BackgroundDecoration hidelogo>
      <Flex
        height={"100%"}
        flexDirection={"column"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-around"}
        mt={40}
      >
        <Box width={"100%"} mb={2}>
          <StoreTopBar hideReroll />
        </Box>
        <Flex direction={"column"} mb={12} mt={16} gap={16} maxHeight={"90%"}>
          <SpecialCards
            discardedCards={discardedCards}
            preselectedCard={preselectedCard}
            onCardClick={onCardClick}
          />
          <Powerups
            preselectedPowerUp={preselectedPowerup}
            onPowerupClick={onPowerupClick}
          />
        </Flex>
        <Flex mt={[0, 0, 0, 4]}>{goBackButton}</Flex>
      </Flex>
    </BackgroundDecoration>
  );
};
