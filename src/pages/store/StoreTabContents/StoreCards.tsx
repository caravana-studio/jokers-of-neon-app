import { Flex } from "@chakra-ui/react";
import { StoreCardsRow } from "../StoreCardsRow";
import { useStore } from "../../../providers/StoreProvider";
import { useTranslation } from "react-i18next";

export const StoreCards = () => {
  const { commonCards, modifierCards, specialCards } = useStore();
  const { t } = useTranslation(["store"]);
  return (
    <Flex
      width={"100%"}
      flexDirection={"column"}
      gap={3}
      p={2}
      justifyContent={"center"}
    >
      <Flex className="game-tutorial-step-3" width={"100%"}>
        {commonCards.length > 0 && (
          <StoreCardsRow
            cards={commonCards}
            title={"traditional"}
          />
        )}
      </Flex>
      <Flex className="game-tutorial-step-4" width={"100%"}>
        {modifierCards.length > 0 && (
          <StoreCardsRow
            cards={modifierCards}
            title={"modifiers"}
          />
        )}
      </Flex>
      <Flex className="game-tutorial-step-5" width={"100%"}>
        {specialCards.length > 0 && (
          <StoreCardsRow
            cards={specialCards}
            title={"special"}
          />
        )}
      </Flex>
    </Flex>
  );
};
