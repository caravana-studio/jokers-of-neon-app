import { Flex } from "@chakra-ui/react";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { PositionedGameMenu } from "../../components/GameMenu";

interface managePageContentProps {
  goBackBtn: JSX.Element;
}

export const ManagePageContent = ({ goBackBtn }: managePageContentProps) => {
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
        <SpecialCards />
        <Powerups />
      </Flex>

      <Flex
        flexDirection={"row"}
        justifyContent="space-between"
        gap={4}
        mx={4}
        mt={14}
      >
        {goBackBtn}
      </Flex>
    </>
  );
};
