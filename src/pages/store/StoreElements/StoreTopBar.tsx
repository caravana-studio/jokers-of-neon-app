import { Flex } from "@chakra-ui/react";
import CoinIcon from "../../../assets/coins.svg?component";
import { CashSymbol } from "../../../components/CashSymbol";
import { InformationIcon } from "../../../components/InformationIcon";
import { PriceBox } from "../../../components/PriceBox";
import { useGame } from "../../../dojo/queries/useGame";
import { useStore } from "../../../providers/StoreProvider";
import RerollButton from "./RerollButton";

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
        <Flex flexDirection="row" alignItems="center" gap={1}>
          <CoinIcon height={25} />
          <Flex
            gap={1.5}
            alignItems="center"
            justifyContent="center"
            borderRadius="8px"
            color="white"
            minWidth={{ base: "50px", sm: "70px" }}
            p={{ base: "5px 5px", sm: "15px 6px" }}
            fontSize="13px"
          >
            {cash}
            <CashSymbol />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
