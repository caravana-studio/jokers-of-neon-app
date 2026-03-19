import { Flex } from "@chakra-ui/react";
import CompactRoundData from "../../components/CompactRoundData/CompactRoundData.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const MobileTopSection = () => {
  return (
    <>
      <CompactRoundData />
      <Flex
        width="100%"
        px={2.5}
        justifyContent="center"
      >
        <SpecialCards />
      </Flex>
    </>
  );
};
