import { Box, Text, VStack, Flex, Badge, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutoFitCardTitle } from "./AutoFitCardTitle";
import { CardImage } from "./CardImage";
import { CardTooltip } from "./CardTooltip";
import { SkinBadge, SKIN_NAME_COLOR } from "./SkinBadge";
import { formatTokenAmount } from "../utils/formatPrice";
import { useCardName } from "../hooks/useCardName";
import { RARITY_LABELS, RARITY_COLORS, getEffectiveStatus } from "../types/marketplace";
import { getPaymentToken } from "../config/contracts";
import { usePrices, toUsd, formatUsd } from "../hooks/usePrices";
import { TokenIcon } from "./TokenIcon";
import type { Listing } from "../types/marketplace";

interface MyListingCardProps {
  listing: Listing;
  onCancel: (listing: Listing) => void;
  onRelist: (listing: Listing) => void;
  isCancelling: boolean;
  isRelisting: boolean;
}

const SKIN_BORDER_COLOR: Record<number, string> = {
  2: "#FF3B3B",
  3: "#8A8A8A",
};

const STATUS_BADGE_BG: Record<string, string> = {
  active:    "#16a34a",
  filled:    "#3182CE",
  cancelled: "#555555",
  expired:   "#555555",
};

function useCountdown(expirationTimestamp: number): string {
  const { t } = useTranslation("marketplace");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = expirationTimestamp - Math.floor(Date.now() / 1000);
      if (diff <= 0) { setLabel(t("myListings.expired")); return; }
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      if (d > 0) setLabel(`${d}d ${h}h ${m}m`);
      else if (h > 0) setLabel(`${h}h ${m}m ${s}s`);
      else setLabel(`${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expirationTimestamp, t]);

  return label;
}

function StatusLine({ listing, effectiveStatus }: { listing: Listing; effectiveStatus: ReturnType<typeof getEffectiveStatus> }) {
  const { t } = useTranslation("marketplace");
  const countdown = useCountdown(listing.expiration);

  if (effectiveStatus === "filled")    return <Text fontSize={13} color="#3182CE" fontFamily="Oxanium">{t("myListings.statusLineFilled")}</Text>;
  if (effectiveStatus === "cancelled") return <Text fontSize={13} color="whiteAlpha.400" fontFamily="Oxanium">{t("myListings.statusLineCancelled")}</Text>;
  if (effectiveStatus === "expired")   return <Text fontSize={13} color="whiteAlpha.400" fontFamily="Oxanium">{t("myListings.statusLineExpired")}</Text>;

  return (
    <Text fontSize={14} color="whiteAlpha.700" fontFamily="Oxanium">
      {countdown}
    </Text>
  );
}

export function MyListingCard({ listing, onCancel, onRelist, isCancelling, isRelisting }: MyListingCardProps) {
  const { t } = useTranslation("marketplace");
  const token = getPaymentToken(listing.payment_token);
  const symbol = token?.symbol ?? "TOKEN";
  const tokenAmount = formatTokenAmount(listing.price, token?.decimals ?? 18);
  const cardName = useCardName(listing.card_id, listing.card_name);
  const rarityLabel = RARITY_LABELS[listing.rarity] || "Common";
  const rarityColor = RARITY_COLORS[listing.rarity] || "#555";
  const prices = usePrices();
  const usdLabel = formatUsd(toUsd(tokenAmount, symbol, prices));
  const effectiveStatus = getEffectiveStatus(listing);
  const isTerminal = effectiveStatus !== "active";
  const STATUS_BADGE_LABEL: Record<string, string> = {
    active:    t("myListings.statusActive"),
    filled:    t("myListings.statusFilled"),
    cancelled: t("myListings.statusCancelled"),
    expired:   t("myListings.statusExpired"),
  };
  const statusBadgeBg = STATUS_BADGE_BG[effectiveStatus] ?? STATUS_BADGE_BG.expired;
  const statusBadgeLabel = STATUS_BADGE_LABEL[effectiveStatus] ?? STATUS_BADGE_LABEL.expired;

  const nameColor = isTerminal ? "whiteAlpha.500" : (SKIN_NAME_COLOR[listing.skin_id] ?? "white");
  const nameGlow = !isTerminal && SKIN_NAME_COLOR[listing.skin_id]
    ? `0 0 8px ${SKIN_NAME_COLOR[listing.skin_id]}, 0 0 20px ${SKIN_NAME_COLOR[listing.skin_id]}70`
    : !isTerminal ? "0 0 10px rgba(255,255,255,0.7)" : "none";

  const hoverGlowColor = SKIN_BORDER_COLOR[listing.skin_id] ?? RARITY_COLORS[listing.rarity] ?? "#555";

  const cardInner = (
    <Box
      bg="rgba(0,0,0,0.6)"
      border="1px solid"
      borderColor={effectiveStatus === "active" ? "#22c55e" : "whiteAlpha.100"}
      borderRadius="15px"
      p={3}
      cursor={isTerminal ? "default" : "pointer"}
      transition="all 0.2s"
      opacity={isTerminal ? 0.65 : 1}
      _hover={
        !isTerminal
          ? {
              borderColor: hoverGlowColor,
              boxShadow: `0 0 12px ${hoverGlowColor}55`,
              transform: "translateY(-2px)",
            }
          : undefined
      }
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

        {/* Image with status overlay */}
        <Box position="relative" w="90%">
          <Box opacity={isTerminal ? 0.6 : 1}>
            <CardTooltip cardId={listing.card_id} cardName={listing.card_name} rarity={listing.rarity}>
              <CardImage
                imageUrl={listing.image_url}
                rarity={listing.rarity}
                skinId={listing.skin_id}
                size="100%"
                w="100%"
              />
            </CardTooltip>
          </Box>

          {/* Status badge — bottom center overlay */}
          <Box
            position="absolute"
            bottom={2}
            left="50%"
            transform="translateX(-50%)"
            zIndex={1}
          >
            <Badge
              bg={statusBadgeBg}
              color="white"
              fontSize={10}
              px={3}
              py="3px"
              borderRadius="full"
              boxShadow={effectiveStatus === "active" ? "0 0 8px #16a34a88" : undefined}
            >
              {statusBadgeLabel}
            </Badge>
          </Box>
        </Box>

        {/* Rarity + skin badges */}
        <Flex gap={1} wrap="wrap" justify="center">
          <Badge bg={rarityColor} color="white" fontSize={10} px={2} py="2px" borderRadius="full">
            {rarityLabel}
          </Badge>
          <SkinBadge skinId={listing.skin_id} fontSize={10} py="2px" />
        </Flex>

        {/* Price */}
        <Flex align="center" gap={2} pt={1}>
          <Text
            fontFamily="Orbitron"
            fontSize={{ base: 22, md: 26 }}
            color={isTerminal ? "whiteAlpha.400" : "neonGreen"}
            fontWeight="bold"
            lineHeight={1}
          >
            {tokenAmount}
          </Text>
          <TokenIcon symbol={symbol} size="22px" />
        </Flex>

        {usdLabel && !isTerminal && (
          <Text fontSize={13} color="whiteAlpha.700" fontFamily="Oxanium" fontStyle="italic" mt={-1}>
            {usdLabel}
          </Text>
        )}

        {/* Countdown / status line */}
        <StatusLine listing={listing} effectiveStatus={effectiveStatus} />

        {/* Action buttons */}
        {effectiveStatus === "active" && (
          <Button
            size="sm"
            variant="defaultOutline"
            mt={1}
            w="100%"
            isLoading={isCancelling}
            isDisabled={isRelisting}
            onClick={(e) => {
              e.preventDefault();
              onCancel(listing);
            }}
          >
            {t("myListings.cancel")}
          </Button>
        )}
        {effectiveStatus === "expired" && (
          <VStack spacing={1} w="100%" mt={1}>
            <Button
              size="sm"
              colorScheme="cyan"
              w="100%"
              isLoading={isRelisting}
              isDisabled={isCancelling}
              onClick={(e) => {
                e.preventDefault();
                onRelist(listing);
              }}
            >
              {t("myListings.relist")}
            </Button>
            <Button
              size="sm"
              variant="defaultOutline"
              w="100%"
              isLoading={isCancelling}
              isDisabled={isRelisting}
              onClick={(e) => {
                e.preventDefault();
                onCancel(listing);
              }}
            >
              {t("myListings.cancel")}
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );

  if (!isTerminal) {
    return <Link to={`/listing/${listing.id}`}>{cardInner}</Link>;
  }

  return cardInner;
}
