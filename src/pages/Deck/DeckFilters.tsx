import { Box, Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDeck } from "../../dojo/queries/useDeck";
import { Cards } from "../../enums/cards";
import { Suits } from "../../enums/suits";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { Card } from "../../types/Card";

const filterBySuit = (suit: Suits) => (card: Card) => card.suit === suit;

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  filterFn: (card: Card) => boolean;
  inStore?: boolean;
}

const FilterButton = ({
  label,
  isActive,
  onClick,
  filterFn,
  inStore = false,
}: FilterButtonProps) => {
  const deck = useDeck();
  const deckLength = deck?.fullDeckCards.filter(filterFn)?.length ?? 0;
  const usedCardsLength = inStore
    ? 0
    : deck?.usedCards.filter(filterFn)?.length ?? 0;
  const unusedCardsLength = deckLength - usedCardsLength;

  return (
    <Button
      size={"sm"}
      variant={isActive ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
      px={[2, 3]}
      borderRadius={["12px", "25px"]}
      height={"25px"}
      onClick={onClick}
    >
      <Flex gap={3}>
        <Box fontFamily="Orbitron">{label}</Box>
        <Box fontFamily="Orbitron">
          {unusedCardsLength !== deckLength
            ? `(${unusedCardsLength} / ${deckLength})`
            : `(${deckLength})`}
        </Box>
      </Flex>
    </Button>
  );
};

interface DeckFiltersProps {
  inStore?: boolean;
}

export const DeckFilters = ({ inStore = false }: DeckFiltersProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const { filterButtonsState, updateFilters } = useDeckFilters();

  const deck = useDeck();

  const noNeonCards =
    deck?.fullDeckCards.filter((card) => !card.isNeon).length ?? 0 === 0;
  const noModifierCards =
    deck?.fullDeckCards.filter((card) => !card.isModifier).length ?? 0 === 0;

  const handleFilterChange = (filter: Partial<typeof filterButtonsState>) => {
    updateFilters({
      suit: undefined,
      isNeon: undefined,
      isModifier: undefined,
      isFigures: undefined,
      isAces: undefined,
      ...filter,
    });
  };

  return (
    <Flex flexDirection={"column"} alignItems={"center"} px={5}>
      <Flex
        alignItems={"space-around"}
        justifyContent={"center"}
        wrap={"wrap"}
        gap={[1, 4]}
        mt={2}
        width={"100%"}
      >
        <FilterButton
          label={t("suit.club").toUpperCase()}
          isActive={filterButtonsState.suit === Suits.CLUBS}
          onClick={() =>
            handleFilterChange({
              suit:
                filterButtonsState.suit !== Suits.CLUBS
                  ? Suits.CLUBS
                  : undefined,
            })
          }
          filterFn={filterBySuit(Suits.CLUBS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.spade").toUpperCase()}
          isActive={filterButtonsState.suit === Suits.SPADES}
          onClick={() =>
            handleFilterChange({
              suit:
                filterButtonsState.suit !== Suits.SPADES
                  ? Suits.SPADES
                  : undefined,
            })
          }
          filterFn={filterBySuit(Suits.SPADES)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.heart").toUpperCase()}
          isActive={filterButtonsState.suit === Suits.HEARTS}
          onClick={() =>
            handleFilterChange({
              suit:
                filterButtonsState.suit !== Suits.HEARTS
                  ? Suits.HEARTS
                  : undefined,
            })
          }
          filterFn={filterBySuit(Suits.HEARTS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.diamond").toUpperCase()}
          isActive={filterButtonsState.suit === Suits.DIAMONDS}
          onClick={() =>
            handleFilterChange({
              suit:
                filterButtonsState.suit !== Suits.DIAMONDS
                  ? Suits.DIAMONDS
                  : undefined,
            })
          }
          filterFn={filterBySuit(Suits.DIAMONDS)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.joker").toUpperCase()}
          isActive={filterButtonsState.suit === Suits.JOKER}
          onClick={() =>
            handleFilterChange({
              suit:
                filterButtonsState.suit !== Suits.JOKER
                  ? Suits.JOKER
                  : undefined,
            })
          }
          filterFn={filterBySuit(Suits.JOKER)}
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.figures").toUpperCase()}
          isActive={!!filterButtonsState.isFigures}
          onClick={() =>
            handleFilterChange({
              isFigures: !filterButtonsState.isFigures ? true : undefined,
            })
          }
          filterFn={(card) =>
            card.card === Cards.JACK ||
            card.card === Cards.QUEEN ||
            card.card === Cards.KING
          }
          inStore={inStore}
        />
        <FilterButton
          label={t("suit.aces").toUpperCase()}
          isActive={!!filterButtonsState.isAces}
          onClick={() =>
            handleFilterChange({
              isAces: !filterButtonsState.isAces ? true : undefined,
            })
          }
          filterFn={(card) => card.card === Cards.ACE}
          inStore={inStore}
        />
        {!noNeonCards && (
          <FilterButton
            label={t("suit.neon").toUpperCase()}
            isActive={!!filterButtonsState.isNeon}
            onClick={() =>
              handleFilterChange({
                isNeon: !filterButtonsState.isNeon ? true : undefined,
              })
            }
            filterFn={(card) => !!card.isNeon}
            inStore={inStore}
          />
        )}
        {!noModifierCards && (
          <FilterButton
            label={t("suit.modifier").toUpperCase()}
            isActive={!!filterButtonsState.isModifier}
            onClick={() =>
              handleFilterChange({
                isModifier: !filterButtonsState.isModifier ? true : undefined,
              })
            }
            filterFn={(card) => !!card.isModifier}
            inStore={inStore}
          />
        )}
      </Flex>
    </Flex>
  );
};
