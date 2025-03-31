import { Flex } from "@chakra-ui/react";
import RerollButton from "../../../store/StoreElements/RerollButton";
import { PlayDiscardIndicators } from "../../../Game/PlayDiscardIndicator";
import { DefaultInfo } from "../../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../../store/Coins";

export const RerollSection = () => {
  return (
    <Flex justifyContent="space-between" alignItems={"center"}>
      <Flex gap={4} py={1}>
        <RerollButton />

        <PlayDiscardIndicators
          disabled={false}
          type={"play"}
          total={3}
          active={3}
        />
        <DefaultInfo title="reroll" />
      </Flex>
      <Flex>
        <MobileCoins />
      </Flex>
    </Flex>
  );
};
