import { Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { colorizeText } from "../../utils/getTooltip";
import { RARITY_COLORS } from "../types/marketplace";

const CATEGORY_LABELS: Record<number, string> = {
  1: "C",
  2: "B",
  3: "A",
  4: "S",
  5: "SS",
};

function sectionForId(cardId: number): string | null {
  if (cardId < 100) return "traditionalCards";
  if (cardId >= 200 && cardId < 300) return "neonCards";
  if (cardId >= 600 && cardId < 700) return "modifiers";
  if (cardId >= 10000 && cardId < 20000) return "specials";
  if (cardId >= 20000 && cardId < 30000) return "rageCards";
  return null;
}

// Strip trailing cumulative-progress clauses that only make sense in-game.
function stripCumulativeClause(desc: string): string {
  return desc
    .replace(
      /\s*(?:Currently(?:\s+at)?|Actualmente|Atualmente)\s[^.]*\{\{[^}]*\}\}[^.]*\.?/gi,
      "",
    )
    .trim();
}

interface CardTooltipProps extends PropsWithChildren {
  cardId: number;
  cardName: string;
  rarity: number;
}

export function CardTooltip({ cardId, cardName, rarity, children }: CardTooltipProps) {
  const { t } = useTranslation("cards");
  const section = sectionForId(cardId);
  const rarityColor = RARITY_COLORS[rarity] ?? "#999";
  const translatedName = section
    ? t(`${section}.${cardId}.name`, { defaultValue: cardName })
    : cardName;
  const description = section
    ? stripCumulativeClause(
        t(`${section}.${cardId}.description`, { defaultValue: "" }),
      )
    : "";
  const rarityLabel = CATEGORY_LABELS[rarity] ?? "";

  return (
    <Tooltip
      hasArrow
      placement="bottom"
      label={
        <Flex flexDir="column" gap={1} p={1}>
          {/* Header: name + category letter */}
          <Flex justify="space-between" align="baseline" mb={1}>
            <Text fontSize="16px" lineHeight="18px" fontFamily="Orbitron" fontWeight="bold">
              {translatedName}
            </Text>
            <Text
              fontSize="16px"
              lineHeight="18px"
              fontFamily="Orbitron"
              fontWeight="bold"
              color={rarityColor}
              ml={2}
              flexShrink={0}
            >
              {rarityLabel}
            </Text>
          </Flex>
          <Divider borderColor="whiteAlpha.400" />
          {/* Description */}
          <Flex my={1}>
            <Text fontSize="13px" fontFamily="Oxanium" whiteSpace="normal" wordBreak="break-word" textAlign="left">
              {colorizeText(description)}
            </Text>
          </Flex>
        </Flex>
      }
      bg="black"
      color="white"
      borderRadius="10px"
      boxShadow="0px 0px 10px 2px white"
      p={3}
      w="240px"
      sx={{ "& .chakra-tooltip__label": { whiteSpace: "normal" } }}
    >
      {children as React.ReactElement}
    </Tooltip>
  );
}
