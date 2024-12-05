import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Suits } from "../../enums/suits";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const DeckFilters = () => {
  const { t } = useTranslation(["game"]);
  const { filterButtonsState, updateFilters } = useDeckFilters();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex flexDirection={"column"} alignItems={"center"}>
      {!isSmallScreen && (
        <Text
          size={"sm"}
          mb={6}
          sx={{
            position: "relative",
            _before: {
              content: '""',
              position: "absolute",
              bottom: "0px",
              left: 0,
              width: "100%",
              height: "1px",
              background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 100%)`,
              boxShadow:
                "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          {t("game.deck.filter-title")}
        </Text>
      )}
      <Flex
        alignItems={"space-around"}
        justifyContent={"center"}
        wrap={"wrap"}
        gap={[1, 4]}
        mt={2}
        width={"95%"}
      >
        <Button
          size={"sm"}
          variant={
            filterButtonsState.suit === Suits.CLUBS
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              suit:
                filterButtonsState.suit !== Suits.CLUBS
                  ? Suits.CLUBS
                  : undefined,
              isNeon: undefined,
              isModifier: undefined,
            })
          }
        >
          {t("game.deck.suit.club").toUpperCase()}
        </Button>
        <Button
          size={"sm"}
          variant={
            filterButtonsState.suit === Suits.SPADES
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              suit:
                filterButtonsState.suit !== Suits.SPADES
                  ? Suits.SPADES
                  : undefined,
              isNeon: undefined,
              isModifier: undefined,
            })
          }
        >
          {t("game.deck.suit.spade").toUpperCase()}
        </Button>
        <Button
          size={"sm"}
          variant={
            filterButtonsState.suit === Suits.HEARTS
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              suit:
                filterButtonsState.suit !== Suits.HEARTS
                  ? Suits.HEARTS
                  : undefined,
              isNeon: undefined,
              isModifier: undefined,
            })
          }
        >
          {t("game.deck.suit.heart").toUpperCase()}
        </Button>
        <Button
          size={"sm"}
          variant={
            filterButtonsState.suit === Suits.DIAMONDS
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              suit:
                filterButtonsState.suit !== Suits.DIAMONDS
                  ? Suits.DIAMONDS
                  : undefined,
              isNeon: undefined,
              isModifier: undefined,
            })
          }
        >
          {t("game.deck.suit.diamond").toUpperCase()}
        </Button>
        <Button
          size={"sm"}
          variant={
            filterButtonsState.isNeon
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              isNeon: !filterButtonsState.isNeon ? true : undefined,
              suit: undefined,
              isModifier: undefined,
            })
          }
        >
          {t("game.deck.suit.neon").toUpperCase()}
        </Button>
        <Button
          size={"sm"}
          variant={
            filterButtonsState.isModifier
              ? "outlineSecondaryGlowActive"
              : "outlineSecondaryGlow"
          }
          px={[2, 3]}
          borderRadius={["12px", "25px"]}
          height={"25px"}
          onClick={() =>
            updateFilters({
              isModifier: !filterButtonsState.isModifier ? true : undefined,
              suit: undefined,
              isNeon: undefined,
            })
          }
        >
          {t("game.deck.suit.modifier").toUpperCase()}
        </Button>
      </Flex>
    </Flex>
  );
};
