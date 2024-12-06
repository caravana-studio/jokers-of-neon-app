import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

interface StoreTabProps {
  onClickCards?: () => void;
  onClickLootBoxes?: () => void;
  onClickUtilities?: () => void;
}

export const StoreTab = (props: StoreTabProps) => {
  const [cardsActive, setCardsActive] = useState(true);
  const [lootBoxesActive, setLootBoxesActive] = useState(false);
  const [utilitiesActive, setUtilitiesActive] = useState(false);

  const deactivateTabs = () => {
    setCardsActive(false);
    setLootBoxesActive(false);
    setUtilitiesActive(false);
  };

  return (
    <Flex
      gap={4}
      py={"22px"}
      px={2}
      backgroundColor={"black"}
      border={"1px"}
      borderRadius={"20px"}
      borderColor={"white"}
      width={"100%"}
      height={"38px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Button
        fontSize={10}
        variant={cardsActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setCardsActive(true);
          props.onClickCards?.();
        }}
        size={"sm"}
        width={"100%"}
      >
        Cards
      </Button>
      <Button
        fontSize={10}
        variant={lootBoxesActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setLootBoxesActive(true);
          props.onClickLootBoxes?.();
        }}
        size={"sm"}
        width={"100%"}
      >
        Loot Boxes
      </Button>
      <Button
        fontSize={10}
        variant={utilitiesActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setUtilitiesActive(true);
          props.onClickUtilities?.();
        }}
        size={"sm"}
        width={"100%"}
      >
        Utilities
      </Button>
    </Flex>
  );
};
