import { Flex } from "@chakra-ui/react";
import RerollButton from "../../../store/StoreElements/RerollButton";
import { DefaultInfo } from "../../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../../store/Coins";
import { RerollIndicators } from "./RerollIndicators";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { useStore } from "../../../../providers/StoreProvider";

export const RerollSection = () => {
  const rerollCant = 5;
  const rerollActiveCant = 4;
  const { isSmallScreen } = useResponsiveValues();
  const { rerollInformation } = useStore();
  return (
    <Flex justifyContent="space-between" alignItems={"center"}>
      <Flex gap={isSmallScreen ? 1 : 4} py={1} alignItems={"center"}>
        <RerollButton />
        <Flex ml={4} columnGap={2}>
          <RerollIndicators
            rerolls={rerollCant}
            rerollsActive={rerollActiveCant}
          />
          <DefaultInfo title="reroll" />
        </Flex>
      </Flex>
      <Flex>
        <MobileCoins
          fontSize={isSmallScreen ? "12px" : undefined}
          iconSize={isSmallScreen ? 20 : undefined}
        />
      </Flex>
    </Flex>
  );
};
