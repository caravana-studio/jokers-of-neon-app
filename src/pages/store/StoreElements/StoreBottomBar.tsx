import { Flex } from "@chakra-ui/react";
import { GameMenu } from "../../../components/GameMenu";
import SpecialsButton from "./SpecialsButton";
import NextLevelButton from "./NextLevelButton";
import { GameDeckMobile } from "../../../components/GameDeck.mobile";
import { useStore } from "../../../providers/StoreProvider";

interface StoreBottomProps {
  isSmallScreen: boolean;
}

export const StoreBottomBar = (props: StoreBottomProps) => {
  const { setRun } = useStore();
  return (
    <Flex
      width={"100%"}
      p={4}
      justifyContent={"space-between"}
      alignItems={"center"}
      zIndex={2}
    >
      <Flex gap={4} alignItems={"center"}>
        <GameMenu
          showTutorial={() => {
            setRun(true);
          }}
        />
        <SpecialsButton isSmallScreen={props.isSmallScreen} />
      </Flex>
      <Flex gap={4} alignItems={"center"}>
        <NextLevelButton isSmallScreen={props.isSmallScreen} />
        <GameDeckMobile />
      </Flex>
    </Flex>
  );
};
