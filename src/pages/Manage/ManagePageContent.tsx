import { Flex } from "@chakra-ui/react";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";
import { PositionedDiscordLink } from "../../components/DiscordLink";

export const ManagePageContent = () => {
  return (
    <Flex flexDirection={"column"} gap={2} alignItems={"center"}>
      <PositionedDiscordLink />
      <SpecialCards />
      <Powerups />
    </Flex>
  );
};
