import { Flex } from "@chakra-ui/react";
import CompactRoundData from "../../components/CompactRoundData/CompactRoundData.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const MobileTopSection = () => {
  return (
    <>
      <CompactRoundData />
      <Flex
        width={["95%", "80%"]}
        sx={{ margin: "0 auto" }}
        mx={2}
        justifyContent="center"
      >
        <SpecialCards />
      </Flex>
    </>
  );
};
