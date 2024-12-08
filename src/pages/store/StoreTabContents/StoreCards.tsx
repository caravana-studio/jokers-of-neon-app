import { Flex, Heading } from "@chakra-ui/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { StoreCardsRow } from "../StoreCardsRow";
import { useStore } from "../../../providers/StoreProvider";
import { useTranslation } from "react-i18next";

export const StoreCards = () => {
  const { commonCards, modifierCards, specialCards, setRun } = useStore();
  const { t } = useTranslation(["store"]);
  return (
    <Flex
      width={"100%"}
      flexDirection={"column"}
      gap={4}
      p={2}
      justifyContent={"center"}
    >
      <Flex className="game-tutorial-step-3" width={"100%"}>
        {commonCards.length > 0 && (
          <StoreCardsRow
            cards={commonCards}
            title={t("store.titles.traditional")}
          />
        )}
      </Flex>
      <Flex className="game-tutorial-step-4" width={"100%"}>
        {modifierCards.length > 0 && (
          <StoreCardsRow
            cards={modifierCards}
            title={t("store.titles.modifiers")}
          />
        )}
      </Flex>
      <Flex className="game-tutorial-step-5" width={"100%"}>
        {specialCards.length > 0 && (
          <StoreCardsRow
            cards={specialCards}
            title={t("store.titles.special")}
          />
        )}
      </Flex>
    </Flex>
  );
};
