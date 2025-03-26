import { Divider, Flex } from "@chakra-ui/react";
import RerollButton from "../../store/StoreElements/RerollButton";
import { PlayDiscardIndicators } from "../../Game/PlayDiscardIndicator";
import { DefaultInfo } from "../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../store/Coins";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

export const TopBarStore = () => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      flexDirection="column"
      p={2}
      px={"16px"}
      width={"100%"}
      backgroundColor={"black"}
      justifyContent={"center"}
    >
      <Flex justifyContent="space-between" alignContent={"center"}>
        <Flex></Flex>
        <Flex></Flex>
      </Flex>
      <Divider orientation="horizontal" color="white" />
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
    </Flex>
  );
};
