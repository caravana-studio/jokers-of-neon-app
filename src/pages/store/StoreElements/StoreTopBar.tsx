import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PriceBox } from "../../../components/PriceBox";
import { useInformationPopUp } from "../../../providers/InformationPopUpProvider";
import { useStore } from "../../../providers/StoreProvider";
import RerollButton from "./RerollButton";
import { InformationIcon } from "../../../components/InformationIcon";
import { Coins } from "../Coins";

interface StoreTopBarProps {
  hideReroll?: boolean;
}

export const StoreTopBar = ({ hideReroll = false }: StoreTopBarProps) => {
  const { rerollInformation } = useStore();
  const { t } = useTranslation("store", { keyPrefix: "information" });

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
        <Coins />
      </Flex>
    </Flex>
  );
};
