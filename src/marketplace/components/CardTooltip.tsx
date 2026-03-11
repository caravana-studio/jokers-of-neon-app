import { Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { subscribeCardData, getCardEntry } from "../hooks/useCardData";
import { RARITY_COLORS } from "../types/marketplace";
import { colorizeText } from "../utils/colorizeText";

const CATEGORY_LABELS: Record<number, string> = {
  1: "C",
  2: "B",
  3: "A",
  4: "S",
  5: "SS",
};

// Strip trailing "Currently ..." clauses that contain unresolved {{template}} variables.
// These are only meaningful in-game (cumulative progress) and make no sense in the marketplace.
function stripCumulativeClause(desc: string): string {
  return desc.replace(/\s*Currently\s[^.]*\{\{[^}]*\}\}[^.]*\.?/g, "").trim();
}

interface CardTooltipProps extends PropsWithChildren {
  cardId: number;
  cardName: string;
  rarity: number;
}

export function CardTooltip({ cardId, cardName, rarity, children }: CardTooltipProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribeCardData(() => setTick((t) => t + 1));
  }, []);

  const entry = getCardEntry(cardId);
  const rarityColor = RARITY_COLORS[rarity] ?? "#999";
  const categoryLabel = CATEGORY_LABELS[rarity] ?? "";
  const description = stripCumulativeClause(entry?.description ?? "");

  return (
    <Tooltip
      hasArrow
      placement="bottom"
      label={
        <Flex flexDir="column" gap={1} p={1}>
          {/* Header: name + category letter */}
          <Flex justify="space-between" align="baseline" mb={1}>
            <Text fontSize="16px" lineHeight="18px" fontFamily="Orbitron" fontWeight="bold">
              {cardName}
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
              {categoryLabel}
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
