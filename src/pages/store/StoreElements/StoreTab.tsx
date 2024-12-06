import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface StoreTabProps {
  onClickCards?: () => void;
  onClickLootBoxes?: () => void;
  onClickUtilities?: () => void;
}

export const StoreTab = (props: StoreTabProps) => {
  const [cardsActive, setCardsActive] = useState(true);
  const [lootBoxesActive, setLootBoxesActive] = useState(false);
  const [utilitiesActive, setUtilitiesActive] = useState(false);
  const { t } = useTranslation(["store"]);

  const deactivateTabs = () => {
    setCardsActive(false);
    setLootBoxesActive(false);
    setUtilitiesActive(false);
  };

  return (
    <Flex
      gap={4}
      py={"20px"}
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
        fontSize={9}
        variant={cardsActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setCardsActive(true);
          props.onClickCards?.();
        }}
        size={"xs"}
        width={"100%"}
      >
        {t("store.labels.cards")}
      </Button>
      <Button
        fontSize={9}
        variant={lootBoxesActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setLootBoxesActive(true);
          props.onClickLootBoxes?.();
        }}
        size={"xs"}
        width={"100%"}
      >
        {t("store.labels.loot-boxes")}
      </Button>
      <Button
        fontSize={9}
        variant={utilitiesActive ? "solid" : "transparent"}
        onClick={() => {
          deactivateTabs();
          setUtilitiesActive(true);
          props.onClickUtilities?.();
        }}
        size={"xs"}
        width={"100%"}
      >
        {t("store.labels.utilities")}
      </Button>
    </Flex>
  );
};
