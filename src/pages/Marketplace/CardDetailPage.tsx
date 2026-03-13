import {
  Box,
  Button,
  Heading,
  HStack,
  Flex,
  Badge,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListing } from "../../marketplace/api/marketplace";
import { CardImage } from "../../marketplace/components/CardImage";
import { SkinBadge } from "../../marketplace/components/SkinBadge";
import { BuyButton } from "../../marketplace/components/BuyButton";
import { formatTokenAmount } from "../../marketplace/utils/formatPrice";
import { useAddressUsername } from "../../hooks/useAddressUsername";
import { RARITY_LABELS, RARITY_COLORS } from "../../marketplace/types/marketplace";
import { PAYMENT_TOKENS } from "../../marketplace/config/contracts";
import { useMarketplace } from "../../marketplace/providers/MarketplaceProvider";
import { usePrices, toUsd, formatUsd } from "../../marketplace/hooks/usePrices";
import { useCardName } from "../../marketplace/hooks/useCardName";
import { TokenIcon } from "../../marketplace/components/TokenIcon";
import type { Listing } from "../../marketplace/types/marketplace";

function getTokenSymbol(address: string): string {
  const token = PAYMENT_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token?.symbol ?? "TOKEN";
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      color="white"
      fontFamily="Oxanium"
      fontSize={{ base: "sm", md: "md" }}
      mb={2}
      sx={{
        position: "relative",
        _before: {
          content: '""',
          position: "absolute",
          bottom: 0,
          width: "95%",
          height: "2px",
          backgroundColor: "white",
          boxShadow:
            "0px 0px 12px rgba(255,255,255,0.8), 0px 6px 20px rgba(255,255,255,0.5)",
        },
      }}
    >
      {children}
    </Text>
  );
}

export function CardDetailPage() {
  const { t } = useTranslation("marketplace");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { feeBps } = useMarketplace();
  const prices = usePrices();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sellerName = useAddressUsername(listing?.seller_address);
  const cardName = useCardName(listing?.card_id, listing?.card_name ?? "");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListing(id)
      .then(setListing)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner color="neonGreen" size="xl" />
      </Flex>
    );
  }

  if (error || !listing) {
    return (
      <VStack py={10} spacing={4}>
        <Text color="red.400" fontFamily="Oxanium">
          {error || "Listing not found"}
        </Text>
        <Button size="sm" variant="outline" onClick={() => navigate("/")}>
          {t("detail.back")}
        </Button>
      </VStack>
    );
  }

  const symbol = getTokenSymbol(listing.payment_token);
  const rarityLabel = RARITY_LABELS[listing.rarity] || "Common";
  const rarityColor = RARITY_COLORS[listing.rarity] || "#999";
  const expiresDate = listing.expiration
    ? new Date(listing.expiration * 1000).toLocaleDateString()
    : "—";
  const feePercent = (feeBps / 100).toFixed(1);
  const usdLabel = formatUsd(toUsd(formatTokenAmount(listing.price), symbol, prices));

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="calc(100vh - 140px)"
      gap={6}
    >
      {/* Top bar — logo + card name */}
      <Flex
        w="95%"
        bg="black"
        borderRadius="25px"
        boxShadow="0 0 10px 3px rgba(255,255,255,0.2)"
        px={6}
        py={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          as="img"
          src="/logos/logo-variant.svg"
          alt="Jokers of Neon"
          h="20px"
        />
        <Text
          fontFamily="Orbitron"
          fontSize={{ base: 16, sm: 24 }}
          fontWeight="bold"
          color="white"
          textTransform="uppercase"
          letterSpacing="0.15em"
          textShadow="0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.4)"
          noOfLines={1}
          maxW={{ base: "60%", sm: "70%" }}
        >
          {t("detail.title")}
        </Text>
      </Flex>

      {/* Main card */}
      <Box
        bg="rgba(0,0,0,0.6)"
        borderRadius="25px"
        boxShadow="0px 0px 18px 2px rgba(255,255,255,1)"
        border="1px solid rgba(255,255,255,0.15)"
        p={{ base: 5, md: 8 }}
        w="95%"
      >
        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          alignItems={{ base: "center", sm: "flex-start" }}
          gap={{ base: 6, sm: 8 }}
        >
          {/* Left — card image */}
          <Flex flexShrink={0} justifyContent="center" alignItems="flex-start">
            <CardImage
              imageUrl={listing.image_url}
              rarity={listing.rarity}
              skinId={listing.skin_id}
              size="260px"
            />
          </Flex>

          {/* Right — details */}
          <Flex flexDirection="column" flex={1} gap={5} w="100%">
            {/* Title */}
            <Heading size={{ base: "sm", sm: "l" }} variant="italic" color="white">
              {cardName || `Token #${listing.token_id}`}
            </Heading>

            {/* Rarity */}
            <Box>
              <SectionLabel>{t("detail.rarity")}</SectionLabel>
              <HStack mt={3} spacing={2}>
                <Badge
                  bg={rarityColor}
                  color="white"
                  fontSize={10}
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {rarityLabel}
                </Badge>
                <SkinBadge skinId={listing.skin_id} fontSize={10} px={3} py={1} />
              </HStack>
            </Box>

            {/* Price */}
            <Box>
              <SectionLabel>{t("detail.price")}</SectionLabel>
              <HStack mt={3} spacing={3} align="baseline">
                <Text
                  fontFamily="Orbitron"
                  fontSize={{ base: 24, sm: 32 }}
                  color="neonGreen"
                  fontWeight="bold"
                  lineHeight={1}
                >
                  {formatTokenAmount(listing.price)}
                </Text>
                <TokenIcon symbol={symbol} size="28px" />
              </HStack>
              {usdLabel && (
                <Text fontFamily="Oxanium" fontSize={{ base: 16, sm: 18 }} color="whiteAlpha.600" mt={1}>
                  {usdLabel}
                </Text>
              )}
            </Box>

            {/* Details */}
            <Box>
              <SectionLabel>{t("detail.details")}</SectionLabel>
              <VStack mt={3} spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text color="whiteAlpha.500" fontFamily="Oxanium" fontSize={{ base: "sm", md: "md" }}>
                    {t("detail.seller")}
                  </Text>
                  <Text color="white" fontFamily="Orbitron" fontSize={{ base: "sm", md: "md" }}>
                    {sellerName}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="whiteAlpha.500" fontFamily="Oxanium" fontSize={{ base: "sm", md: "md" }}>
                    {t("detail.tokenId")}
                  </Text>
                  <Text color="white" fontFamily="Orbitron" fontSize={{ base: "sm", md: "md" }}>
                    #{listing.token_id}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="whiteAlpha.500" fontFamily="Oxanium" fontSize={{ base: "sm", md: "md" }}>
                    {t("detail.expires")}
                  </Text>
                  <Text color="white" fontFamily="Orbitron" fontSize={{ base: "sm", md: "md" }}>
                    {expiresDate}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="whiteAlpha.500" fontFamily="Oxanium" fontSize={{ base: "sm", md: "md" }}>
                    {t("detail.fee")}
                  </Text>
                  <Text color="white" fontFamily="Orbitron" fontSize={{ base: "sm", md: "md" }}>
                    {feePercent}%
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Inactive status */}
            {listing.status !== "active" && (
              <Box
                textAlign="center"
                py={3}
                borderRadius="10px"
                border="1px solid"
                borderColor={listing.status === "filled" ? "green.600" : "red.600"}
              >
                <Text
                  fontFamily="Orbitron"
                  fontSize={13}
                  color={listing.status === "filled" ? "green.400" : "red.400"}
                  letterSpacing="0.1em"
                >
                  {listing.status.toUpperCase()}
                </Text>
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Action buttons */}
      <HStack spacing={4} justifyContent="flex-end" w="95%">
        {listing.status === "active" && (
          <BuyButton listing={listing} onSuccess={() => navigate("/")} />
        )}
        <Button
          size="md"
          variant="outlineSecondaryGlow"
          px={6}
          onClick={() => navigate("/")}
        >
          {t("detail.back")}
        </Button>
      </HStack>
    </Flex>
  );
}
