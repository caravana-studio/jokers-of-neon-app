import { Flex } from "@chakra-ui/react";
import { Powerups } from "./TabContents/Powerups";
import { SpecialCards } from "./TabContents/SpecialCards";

export const ManagePageContent = () => {
  return (
    <>
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
    </>
  );
};
