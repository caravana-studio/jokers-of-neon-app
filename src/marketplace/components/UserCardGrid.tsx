import {
  Box,
  Badge,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CardImage } from "./CardImage";
import { CardTooltip } from "./CardTooltip";
import { AutoFitCardTitle } from "./AutoFitCardTitle";
import { MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS } from "./cardGridLayout";
import { SkinBadge, SKIN_NAME_COLOR } from "./SkinBadge";
import { useCardName } from "../hooks/useCardName";
import { RARITY_LABELS, RARITY_COLORS } from "../types/marketplace";
import { cardImageUrl } from "../utils/formatPrice";
import type { UserCard } from "../types/marketplace";

export type CardGroup = {
  card: UserCard;
  copies: number;
};

export function groupCards(cards: UserCard[]): CardGroup[] {
  const map = new Map<string, CardGroup>();
  for (const card of cards) {
    const key = `${card.cardId}-${card.skinId}`;
    if (map.has(key)) {
      map.get(key)!.copies += 1;
    } else {
      map.set(key, { card, copies: 1 });
    }
  }
  return Array.from(map.values());
}

// Same color logic as CardImage border
const SKIN_BORDER_COLOR: Record<number, string> = {
  2: "#FF3B3B",
  3: "#8A8A8A",
};

export function CardGridItem({
  group,
  isListed,
  isNonMarketable,
  onSelect,
}: {
  group: CardGroup;
  isListed: boolean;
  isNonMarketable: boolean;
  onSelect: (card: UserCard) => void;
}) {
  const { t } = useTranslation("marketplace");
  const { card, copies } = group;
  const cardName = useCardName(card.cardId, card.cardName ?? `Card #${card.cardId}`);
  const rarityLabel = RARITY_LABELS[card.rarity] || "Common";
  const rarityColor = RARITY_COLORS[card.rarity] || "#555";
  const nameColor = SKIN_NAME_COLOR[card.skinId] ?? "white";
  const nameGlow = SKIN_NAME_COLOR[card.skinId]
    ? `0 0 8px ${SKIN_NAME_COLOR[card.skinId]}, 0 0 20px ${SKIN_NAME_COLOR[card.skinId]}70`
    : "0 0 10px rgba(255,255,255,0.7)";
  // Color for hover glow: skin color > rarity color
  const hoverGlowColor = SKIN_BORDER_COLOR[card.skinId] ?? RARITY_COLORS[card.rarity] ?? "#555";

  const inner = (
    <Box
      position="relative"
      bg="rgba(0,0,0,0.6)"
      border="1px solid"
      borderColor={isListed ? "#22c55e" : "whiteAlpha.200"}
      borderRadius="15px"
      p={3}
      cursor={isNonMarketable ? "not-allowed" : "pointer"}
      transition="all 0.2s"
      opacity={isNonMarketable ? 0.4 : 1}
      _hover={
        isNonMarketable
          ? undefined
          : {
              borderColor: isListed ? "#22c55e" : hoverGlowColor,
              boxShadow: isListed ? "0 0 12px #22c55e55" : `0 0 12px ${hoverGlowColor}55`,
              transform: "translateY(-2px)",
              opacity: 1,
            }
      }
      onClick={() => !isNonMarketable && onSelect(card)}
    >
      <VStack spacing={2} align="center">
        {/* Card name — top */}
        <AutoFitCardTitle
          color={nameColor}
          mt="2%"
          mb="1%"
          maxFontSizeBase={13}
          maxFontSizeMd={15}
          minFontSizeBase={9}
          minFontSizeMd={10}
          textShadow={nameGlow}
        >
          {cardName}
        </AutoFitCardTitle>

        {/* Image with overlays */}
        <Box position="relative" w="90%">
          <CardTooltip cardId={card.cardId} cardName={cardName} rarity={card.rarity}>
            <CardImage
              imageUrl={cardImageUrl(card.cardId, card.skinId)}
              rarity={card.rarity}
              skinId={card.skinId}
              size="100%"
              w="100%"
              isSpecial={card.isSpecial}
            />
          </CardTooltip>

          {/* Copies badge — top right */}
          {copies > 1 && (
            <Box
              position="absolute"
              top={1.5}
              right={1.5}
              zIndex={1}
              bg="rgba(6,107,155,0.95)"
              border="1px solid"
              borderColor="neonGreen"
              borderRadius="5px"
              minW="20px"
              h="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={1}
            >
              <Text fontFamily="Orbitron" fontSize={9} color="white" fontWeight="bold" lineHeight={1}>
                ×{copies}
              </Text>
            </Box>
          )}

          {/* Listed badge — bottom center */}
          {isListed && (
            <Box
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              zIndex={1}
            >
              <Badge
                bg="#16a34a"
                color="white"
                fontSize={10}
                px={3}
                py="3px"
                borderRadius="full"
                boxShadow="0 0 8px #16a34a88"
              >
                LISTED
              </Badge>
            </Box>
          )}
        </Box>

        {/* Badges row — rarity + skin */}
        <Flex gap={1} wrap="wrap" justify="center" align="center">
          <Badge bg={rarityColor} color="white" fontSize={10} px={2} py="2px" borderRadius="full">
            {rarityLabel}
          </Badge>
          <SkinBadge skinId={card.skinId} fontSize={10} py="2px" />
        </Flex>
      </VStack>
    </Box>
  );

  if (isNonMarketable) {
    return (
      <Tooltip
        label={t("sell.notTransferableTooltip")}
        placement="top"
        bg="black"
        color="white"
        borderRadius="10px"
        boxShadow="0px 0px 10px 2px white"
        p={3}
        maxW="220px"
        hasArrow
      >
        {inner}
      </Tooltip>
    );
  }

  return inner;
}

export function CardSection({
  title,
  groups,
  variant,
  listedTokenIds,
  onSelect,
}: {
  title: string;
  groups: CardGroup[];
  variant?: string;
  listedTokenIds: Set<string>;
  onSelect: (card: UserCard) => void;
}) {
  if (groups.length === 0) return null;
  return (
    <Box>
      {title && (
        <Flex align="center" gap={3} mb={4}>
          <Heading size="m" variant={variant}>
            {title}
          </Heading>
          <Box flex={1} h="1px" bg="whiteAlpha.200" />
          <Text fontSize={13} color="whiteAlpha.700" fontFamily="Oxanium">
            {groups.length} type{groups.length !== 1 ? "s" : ""}
            {" · "}
            {groups.reduce((sum, g) => sum + g.copies, 0)} card
            {groups.reduce((sum, g) => sum + g.copies, 0) !== 1 ? "s" : ""}
          </Text>
        </Flex>
      )}
      <SimpleGrid templateColumns={MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS} spacing={4}>
        {groups.map((group) => (
          <CardGridItem
            key={`${group.card.cardId}-${group.card.skinId}`}
            group={group}
            isListed={listedTokenIds.has(group.card.tokenId)}
            isNonMarketable={!group.card.marketable}
            onSelect={onSelect}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
