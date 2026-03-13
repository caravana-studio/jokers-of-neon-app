import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CardImage } from "./CardImage";
import { CardTooltip } from "./CardTooltip";
import { SkinBadge, SKIN_NAME_COLOR } from "./SkinBadge";
import { formatTokenAmount } from "../utils/formatPrice";
import { useAddressUsername } from "../../hooks/useAddressUsername";
import { useCardName } from "../hooks/useCardName";
import { TokenIcon } from "./TokenIcon";
import { RARITY_LABELS, RARITY_COLORS } from "../types/marketplace";
import { PAYMENT_TOKENS } from "../config/contracts";
import { usePrices, toUsd, formatUsd } from "../hooks/usePrices";
import type { Listing } from "../types/marketplace";

interface ListingCardProps {
  listing: Listing;
}


function getTokenSymbol(address: string): string {
  const token = PAYMENT_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token?.symbol ?? "TOKEN";
}

const SKIN_BORDER_COLOR: Record<number, string> = {
  2: "#FF3B3B",
  3: "#8A8A8A",
};

export function ListingCard({ listing }: ListingCardProps) {
  const symbol = getTokenSymbol(listing.payment_token);
  const rarityLabel = RARITY_LABELS[listing.rarity] || "Common";
  const rarityColor = RARITY_COLORS[listing.rarity] || "#555";
  const prices = usePrices();
  const usdLabel = formatUsd(toUsd(formatTokenAmount(listing.price), symbol, prices));
  const sellerName = useAddressUsername(listing.seller_address);
  const cardName = useCardName(listing.card_id, listing.card_name);
  const nameColor = SKIN_NAME_COLOR[listing.skin_id] ?? "white";
  const hoverGlowColor = SKIN_BORDER_COLOR[listing.skin_id] ?? RARITY_COLORS[listing.rarity] ?? "#555";

  return (
    <Link to={`/listing/${listing.id}`}>
      <Box
        bg="rgba(0,0,0,0.6)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="15px"
        p={3}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: hoverGlowColor,
          boxShadow: `0 0 12px ${hoverGlowColor}55`,
          transform: "translateY(-2px)",
        }}
      >
        <VStack spacing={2} align="center">

          {/* Card name — top */}
          <Text
            fontFamily="Orbitron"
            fontSize={{ base: 15, md: 17 }}
            color="white"
            textTransform="uppercase"
            textAlign="center"
            marginTop="2%"
            marginBottom="2%"
            w="100%"
            textShadow="0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.4)"
          >
            {cardName}
          </Text>

          {/* Card image */}
          <CardTooltip cardId={listing.card_id} cardName={listing.card_name} rarity={listing.rarity}>
            <CardImage imageUrl={listing.image_url} rarity={listing.rarity} skinId={listing.skin_id} size="90%" />
          </CardTooltip>

          {/* Rarity badges */}
          <HStack spacing={1}>
            <Badge
              bg={rarityColor}
              color="white"
              fontSize={10}
              px={2}
              py="2px"
              borderRadius="full"
            >
              {rarityLabel}
            </Badge>
            <SkinBadge skinId={listing.skin_id} fontSize={10} py="2px" />
          </HStack>

          {/* Price */}
          <HStack spacing={2} align="center" mt={1}>
            <Text
              fontFamily="Orbitron"
              fontSize={{ base: 22, md: 26 }}
              color="neonGreen"
              fontWeight="bold"
              lineHeight={1}
            >
              {formatTokenAmount(listing.price)}
            </Text>
            <TokenIcon symbol={symbol} size="22px" />
          </HStack>

          {/* USD */}
          {usdLabel && (
            <Text
              fontSize={13}
              color="whiteAlpha.700"
              fontFamily="Oxanium"
              fontStyle="italic"
              mt={-1}
            >
              {usdLabel}
            </Text>
          )}

          {/* Seller — right-aligned */}
          <Box w="100%" textAlign="right">
            <Text
              fontSize={11}
              color="whiteAlpha.700"
              fontFamily="Orbitron"
              letterSpacing="0.04em"
            >
              {sellerName}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Link>
  );
}
