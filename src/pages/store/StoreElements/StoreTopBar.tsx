import { Flex } from "@chakra-ui/react";
import RerollButton from "./RerollButton";
import { PriceBox } from "../../../components/PriceBox";
import { FiAlertCircle } from "react-icons/fi";
import { Coins } from "../../Game/Coins";

interface StoreTopProps {
  isSmallScreen: boolean;
  rerollPrice: number;
  rerollPurchased: boolean;
}

export const StoreTopBar = (props: StoreTopProps) => {
  return (
    <Flex
      gap={4}
      p={2}
      backgroundColor={"black"}
      border={"1px 1px 2px 2px"}
      borderRadius={"25px"}
      borderColor={"white"}
      justifyContent={"space-around"}
    >
      <Flex gap={2}>
        <RerollButton isSmallScreen={props.isSmallScreen}></RerollButton>
        <PriceBox
          price={props.rerollPrice}
          purchased={props.rerollPurchased}
        ></PriceBox>
        <FiAlertCircle />
      </Flex>
      <Flex>
        <Coins />
      </Flex>
    </Flex>
  );
};
