import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Cards } from "../../../enums/cards";
import { Suits } from "../../../enums/suits";
import { useDeckFilters } from "../../../providers/DeckFilterProvider";
import { useDeckStore } from "../../../state/useDeckStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { Card } from "../../../types/Card";
import { FilterButton } from "./FilterButton";

const filterBySuit = (suit: Suits) => (card: Card) => card.suit === suit;

interface DeckFiltersProps {
  inStore?: boolean;
}

export const DeckFilters = ({ inStore = false }: DeckFiltersProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const { filterButtonsState, updateFilters } = useDeckFilters();
  const deck = useDeckStore();
  const { isSmallScreen } = useResponsiveValues();

  const noNeonCards = !deck?.fullDeckCards.some((card) => card.isNeon);
  const noModifierCards = !deck?.fullDeckCards.some((card) => card.isModifier);

  return (
    <Flex flexDirection={"column"} px={5}>
      <Flex
        alignItems={"space-around"}
        justifyContent={isSmallScreen ? "center" : "flex-end"}
        wrap={"wrap"}
        gap={[1, 2]}
        mt={2}
        width={"100%"}
      >
        <FilterButton
          label={t("suit.club").toUpperCase()}
          icon="CLUB"
          isActive={filterButtonsState.suit === Suits.CLUBS}
          onClick={() => updateFilters({ suit: Suits.CLUBS })}
          filterFn={filterBySuit(Suits.CLUBS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.spade").toUpperCase()}
          icon="SPADE"
          isActive={filterButtonsState.suit === Suits.SPADES}
          onClick={() => updateFilters({ suit: Suits.SPADES })}
          filterFn={filterBySuit(Suits.SPADES)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.heart").toUpperCase()}
          icon="HEART"
          isActive={filterButtonsState.suit === Suits.HEARTS}
          onClick={() => updateFilters({ suit: Suits.HEARTS })}
          filterFn={filterBySuit(Suits.HEARTS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.diamond").toUpperCase()}
          icon="DIAMOND"
          isActive={filterButtonsState.suit === Suits.DIAMONDS}
          onClick={() => updateFilters({ suit: Suits.DIAMONDS })}
          filterFn={filterBySuit(Suits.DIAMONDS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.joker").toUpperCase()}
          icon="JOKER"
          isActive={filterButtonsState.suit === Suits.JOKER}
          onClick={() => updateFilters({ suit: Suits.JOKER })}
          filterFn={filterBySuit(Suits.JOKER)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.figures").toUpperCase()}
          icon="FIGURE"
          isActive={!!filterButtonsState.isFigures}
          onClick={() => updateFilters({ suit: undefined, isFigures: true })}
          filterFn={(card) =>
            card.card === Cards.JACK ||
            card.card === Cards.QUEEN ||
            card.card === Cards.KING
          }
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.aces").toUpperCase()}
          icon="AS"
          isActive={!!filterButtonsState.isAces}
          onClick={() => updateFilters({ suit: undefined, isAces: true })}
          filterFn={(card) => card.card === Cards.ACE}
          inStore={inStore}
        />
        {!noNeonCards && (
          <FilterButton
            label={t("suit.neon").toUpperCase()}
            icon="NEON"
            isActive={!!filterButtonsState.isNeon}
            onClick={() => updateFilters({ suit: undefined, isNeon: true })}
            filterFn={(card) => !!card.isNeon}
            inStore={inStore}
          />
        )}
        {!noModifierCards && (
          <FilterButton
            label={t("suit.modifier").toUpperCase()}
            icon="MODIFIER"
            isActive={!!filterButtonsState.isModifier}
            onClick={() => updateFilters({ suit: undefined, isModifier: true })}
            filterFn={(card) => !!card.isModifier}
            inStore={inStore}
          />
        )}
      </Flex>
    </Flex>
  );
};
