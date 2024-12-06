import { Flex } from "@chakra-ui/react";
import RerollButton from "./RerollButton";
import { PriceBox } from "../../../components/PriceBox";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Coins } from "../../Game/Coins";
import { useStore } from "../../../providers/StoreProvider";

interface StoreTopProps {
  isSmallScreen: boolean;
}

export const StoreTopBar = (props: StoreTopProps) => {
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
      <Flex gap={2} alignItems={"center"}>
        <RerollButton isSmallScreen={props.isSmallScreen}></RerollButton>
        <PriceBox
          price={rerollInformation.rerollCost}
          purchased={rerollInformation.rerollExecuted}
          absolutePosition={false}
          fontSize={8}
        ></PriceBox>
        <IoIosInformationCircleOutline color="white" size={"24px"} />
      </Flex>
      <Flex alignItems={"center"}>
        <Coins />
      </Flex>
    </Flex>
  );
};
