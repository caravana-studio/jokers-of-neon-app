import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "../../../state/useShopStore";
import { StoreCardsRow } from "../StoreCardsRow";

export const StoreCards = () => {
  const { commonCards, modifierCards, specialCards } = useShopStore();
  const { t } = useTranslation(["store"]);
  return (
    <Flex
      width={"100%"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      flexGrow={1}
      gap={3}
      p={2}
      sx={{
        zIndex: 1,
      }}
    >
      <Flex className="game-tutorial-step-3" width={"100%"}>
        {commonCards.length > 0 && (
          <StoreCardsRow cards={commonCards} title={"traditional"} />
        )}
      </Flex>
      <Flex className="game-tutorial-step-4" width={"100%"}>
        {modifierCards.length > 0 && (
          <StoreCardsRow cards={modifierCards} title={"modifiers"} />
        )}
      </Flex>
      <Flex className="game-tutorial-step-5" width={"100%"}>
        {specialCards.length > 0 && (
          <StoreCardsRow cards={specialCards} title={"special"} />
        )}
      </Flex>
    </Flex>
  );
};
