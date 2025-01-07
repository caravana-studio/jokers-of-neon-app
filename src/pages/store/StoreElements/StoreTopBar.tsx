import { Flex } from "@chakra-ui/react";
import CoinIcon from "../../../assets/coins.svg?component";
import { CashSymbol } from "../../../components/CashSymbol";
import { InformationIcon } from "../../../components/InformationIcon";
import { PriceBox } from "../../../components/PriceBox";
import { useGame } from "../../../dojo/queries/useGame";
import { useStore } from "../../../providers/StoreProvider";
import RerollButton from "./RerollButton";
import { MobileCoins } from "../Coins";

interface StoreTopBarProps {
  hideReroll?: boolean;
}

export const StoreTopBar = ({ hideReroll = false }: StoreTopBarProps) => {
  const { rerollInformation } = useStore();
  const game = useGame();
  const cash = game?.cash ?? 0;

  return (
    <Flex
      gap={4}
      p={2}
      px={"16px"}
      width={"100%"}
      backgroundColor={"black"}
      borderRadius={"25px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Flex gap={4} alignItems={"center"}>
        {!hideReroll && (
          <>
            <RerollButton />
            <Flex alignItems={"center"} gap={2}>
              <PriceBox
                price={rerollInformation.rerollCost}
                purchased={rerollInformation.rerollExecuted}
                absolutePosition={false}
                fontSize={10}
              ></PriceBox>
              <InformationIcon title="reroll" />
            </Flex>
          </>
        )}
      </Flex>
      <Flex alignItems={"center"}>
        <MobileCoins />
      </Flex>
    </Flex>
  );
};
