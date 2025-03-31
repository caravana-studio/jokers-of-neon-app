import { Flex } from "@chakra-ui/react";
import RerollButton from "../../../store/StoreElements/RerollButton";
import { PlayDiscardIndicators } from "../../../Game/PlayDiscardIndicator";
import { DefaultInfo } from "../../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../../store/Coins";
import { RerollIndicators } from "./RerollIndicators";

export const RerollSection = () => {
  const rerollCant = 5;
  const rerollActiveCant = 5;
  return (
    <Flex justifyContent="space-between" alignItems={"center"}>
      <Flex gap={4} py={1} alignItems={"center"}>
        <RerollButton />
        <Flex width={"100px"} ml={4}>
          <RerollIndicators
            rerolls={rerollCant}
            rerollsActive={rerollActiveCant}
          />
        </Flex>
        <DefaultInfo title="reroll" />
      </Flex>
      <Flex>
        <MobileCoins />
      </Flex>
    </Flex>
  );
};
