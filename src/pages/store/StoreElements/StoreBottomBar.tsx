import { Flex } from "@chakra-ui/react";
import { GameMenu } from "../../../components/GameMenu";
import SpecialsButton from "./SpecialsButton";
import NextLevelButton from "./NextLevelButton";
import { GameDeckMobile } from "../../../components/GameDeck.mobile";

interface StoreBottomProps {
  isSmallScreen: boolean;
}

export const StoreBottomBar = (props: StoreBottomProps) => {
  return (
    <Flex gap={4} p={2} justifyContent={"space-around"}>
      <Flex gap={2}>
        <GameMenu />
        <SpecialsButton isSmallScreen={props.isSmallScreen} />
      </Flex>
      <Flex gap={2}>
        <NextLevelButton isSmallScreen={props.isSmallScreen} />
        <GameDeckMobile />
      </Flex>
    </Flex>
  );
};
