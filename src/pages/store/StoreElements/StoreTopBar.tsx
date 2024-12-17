import { Flex } from "@chakra-ui/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PriceBox } from "../../../components/PriceBox";
import { useStore } from "../../../providers/StoreProvider";
import { Coins } from "../../Game/Coins";
import RerollButton from "./RerollButton";

interface StoreTopBarProps {
  hideReroll?: boolean;
}

export const StoreTopBar = ({ hideReroll = false }: StoreTopBarProps) => {
  const { rerollInformation } = useStore();

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
              <IoIosInformationCircleOutline color="white" size={"14px"} />
            </Flex>
          </>
        )}
      </Flex>
      <Flex alignItems={"center"}>
        <Coins />
      </Flex>
    </Flex>
  );
};
