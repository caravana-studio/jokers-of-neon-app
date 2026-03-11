import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Switch,
  Text,
  VStack,
  Flex,
  Badge,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { useUserCards } from "../../hooks/useUserCards";
import { useCreateListing } from "../../hooks/useCreateListing";
import { usePrices, toUsd, formatUsd } from "../../hooks/usePrices";
import { getSellerListings } from "../../api/marketplace";
import { CardImage } from "../../components/CardImage";
import { SkinBadge, SKIN_NAME_COLOR } from "../../components/SkinBadge";

const SKIN_SEASON_LABEL: Record<number, string> = {
  2: "Season 1",
  3: "Season 2",
};
import { groupCards, CardGridItem, CardSection } from "../../components/UserCardGrid";
import { RARITY_LABELS, RARITY_COLORS } from "../../types/marketplace";
import { cardImageUrl, parseTokenAmount, formatTokenAmount } from "../../utils/formatPrice";
import { PAYMENT_TOKENS } from "../../config/contracts";
import { TokenIcon } from "../../components/TokenIcon";
import type { UserCard } from "../../types/marketplace";

// ─── Section label with white glow underline (matches store preview) ──────────
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

// ─── Expiry toggle buttons ─────────────────────────────────────────────────────
const EXPIRY_OPTIONS = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

function ExpiryPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <HStack spacing={2}>
      {EXPIRY_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <Button
            key={opt.value}
            size="sm"
            px={3}
            bg={active ? "rgba(32,198,237,0.22)" : "transparent"}
            color={active ? "white" : "whiteAlpha.500"}
            fontWeight={active ? "bold" : "normal"}
            border="2px solid"
            borderColor={active ? "neonGreen" : "whiteAlpha.200"}
            boxShadow={active ? "0 0 14px rgba(32,198,237,0.5), inset 0 0 8px rgba(32,198,237,0.1)" : "none"}
            _hover={{ borderColor: "neonGreen", color: "white" }}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </HStack>
  );
}

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.7); }
  70%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0%   { box-shadow: 0 0 8px rgba(32,198,237,0.15); }
  50%  { box-shadow: 0 0 14px rgba(32,198,237,0.3); }
  100% { box-shadow: 0 0 8px rgba(32,198,237,0.15); }
`;

const STEP_LABEL: Record<string, string> = {
  approving: "APPROVING NFT...",
  signing:   "SIGN ORDER...",
  submitting: "SUBMITTING...",
};

// ─── Selected card detail + listing form (store-preview style) ────────────────
function CardListingPreview({
  card,
  onBack,
  onSuccess,
}: {
  card: UserCard;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [price, setPrice] = useState("");
  const [paymentToken, setPaymentToken] = useState<string>(PAYMENT_TOKENS[0].address);
  const [expiryDays, setExpiryDays] = useState(7);
  const { create, status, error, reset } = useCreateListing();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpen: openSuccess, onClose: closeSuccess } = useDisclosure();

  const selectedToken = PAYMENT_TOKENS.find((t) => t.address === paymentToken)!;
  const isProcessing = ["approving", "signing", "submitting"].includes(status);
  const skinColor = SKIN_NAME_COLOR[card.skinId];
  const titleColor = skinColor ?? "white";
  const titleGlow = skinColor
    ? `0 0 12px ${skinColor}, 0 0 24px ${skinColor}60`
    : "0 0 12px rgba(255,255,255,0.5)";
  const rarityLabel = RARITY_LABELS[card.rarity] ?? "Common";
  const rarityColor = RARITY_COLORS[card.rarity] ?? "#999";
  const prices = usePrices();
  const usdLabel = formatUsd(toUsd(price, selectedToken.symbol, prices));

  // Show success modal, then redirect after 4s
  useEffect(() => {
    if (status === "done") openSuccess();
  }, [status]);

  const handleConfirm = async () => {
    closeConfirm();
    if (status === "error") reset();
    const priceWei = parseTokenAmount(price, selectedToken.decimals);
    await create(card, paymentToken, priceWei, expiryDays);
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="calc(100vh - 140px)"
      gap={6}
    >
      {/* Top bar — logo + title */}
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
        >
          Create Listing
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
          <Flex
            flexShrink={0}
            justifyContent="center"
            alignItems="flex-start"
          >
            <CardImage
              imageUrl={cardImageUrl(card.cardId, card.skinId)}
              rarity={card.rarity}
              skinId={card.skinId}
              size="260px"
              isSpecial={card.isSpecial}
            />
          </Flex>

          {/* Right — details + form */}
          <Flex flexDirection="column" flex={1} gap={5} w="100%">
            {/* Title */}
            <Heading
              size={{ base: "sm", sm: "l" }}
              variant="italic"
              color={titleColor}
              style={{ textShadow: titleGlow }}
            >
              {card.cardName ?? `Card #${card.cardId}`}
              {SKIN_SEASON_LABEL[card.skinId] && ` - ${SKIN_SEASON_LABEL[card.skinId]}`}
            </Heading>

            {/* Type */}
            <Box>
              <SectionLabel>Type</SectionLabel>
              <Text
                color="neonGreen"
                fontFamily="Oxanium"
                fontSize={{ base: "md", md: "lg" }}
                mt={3}
              >
                {card.isSpecial ? "Special" : "Traditional"}
              </Text>
            </Box>

            {/* Rarity & skin */}
            <Box>
              <SectionLabel>Rarity</SectionLabel>
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
                <SkinBadge skinId={card.skinId} fontSize={10} px={3} py={1} />
              </HStack>
            </Box>

            {/* Price */}
            <Box>
              <SectionLabel>Listing Price</SectionLabel>
              <HStack mt={3} spacing={3}>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.001"
                  min="0"
                  fontFamily="Orbitron"
                  fontSize={16}
                  color="white"
                  bg="transparent"
                  border="none"
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.400"
                  borderRadius={0}
                  _focus={{
                    borderColor: "neonGreen",
                    boxShadow: "none",
                  }}
                  flex={1}
                />
                {/* Segmented token selector */}
                <HStack
                  spacing={0}
                  bg="rgba(0,0,0,0.5)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  borderRadius="10px"
                  p="3px"
                  flexShrink={0}
                >
                  {PAYMENT_TOKENS.map((t) => {
                    const active = paymentToken === t.address;
                    return (
                      <Box
                        key={t.address}
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        px={3}
                        py="6px"
                        borderRadius="8px"
                        cursor="pointer"
                        fontFamily="Orbitron"
                        fontSize={12}
                        fontWeight="bold"
                        userSelect="none"
                        transition="all 0.18s"
                        bg={active ? "#20c6ed" : "transparent"}
                        color={active ? "#000" : "whiteAlpha.500"}
                        boxShadow={active ? "0 0 10px rgba(32,198,237,0.6)" : "none"}
                        onClick={() => setPaymentToken(t.address)}
                        _hover={{ color: active ? "#000" : "white" }}
                      >
                        <TokenIcon symbol={t.symbol} size="16px" />
                        {t.symbol}
                      </Box>
                    );
                  })}
                </HStack>
              </HStack>
              {usdLabel && (
                <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500" mt={1}>
                  {usdLabel}
                </Text>
              )}
            </Box>

            {/* Expiry */}
            <Box>
              <SectionLabel>Expires In</SectionLabel>
              <Box mt={3}>
                <ExpiryPicker value={expiryDays} onChange={setExpiryDays} />
              </Box>
            </Box>

            {error && (
              <Text color="red.400" fontSize={11} fontFamily="Oxanium">
                {error}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Action buttons below card */}
      <HStack spacing={4} justifyContent="flex-end" w="95%">
        <Button
          size="md"
          variant="solid"
          px={8}
          onClick={openConfirm}
          isLoading={isProcessing}
          loadingText={STEP_LABEL[status] ?? "PROCESSING..."}
          isDisabled={!price || parseFloat(price) <= 0 || status === "done"}
        >
          {status === "error" ? "RETRY" : "LIST FOR SALE"}
        </Button>
        <Button
          size="md"
          variant="outlineSecondaryGlow"
          px={6}
          onClick={onBack}
          isDisabled={isProcessing}
        >
          Cancel
        </Button>
      </HStack>

      {/* ── Confirmation modal ── */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,0.7)" />
        <ModalContent
          bg="rgba(6,22,48,0.97)"
          border="1px solid rgba(32,198,237,0.3)"
          borderRadius="20px"
          boxShadow="0 0 40px rgba(32,198,237,0.15)"
          mx={4}
        >
          <ModalBody pt={6} pb={2}>
            <VStack spacing={5} align="stretch">
              <Text
                fontFamily="Orbitron"
                fontSize={13}
                color="whiteAlpha.500"
                textTransform="uppercase"
                letterSpacing="0.12em"
                textAlign="center"
              >
                Confirm Listing
              </Text>

              <Text
                fontFamily="Orbitron"
                fontSize={18}
                color={titleColor}
                textTransform="uppercase"
                textAlign="center"
                noOfLines={2}
                style={{ textShadow: titleGlow }}
              >
                {card.cardName}
                {SKIN_SEASON_LABEL[card.skinId] && ` - ${SKIN_SEASON_LABEL[card.skinId]}`}
              </Text>

              {/* Price */}
              <Flex
                direction="column"
                align="center"
                bg="rgba(0,0,0,0.4)"
                borderRadius="14px"
                border="1px solid rgba(255,255,255,0.08)"
                py={4}
                gap={1}
              >
                <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500" textTransform="uppercase" letterSpacing="0.1em">
                  Listing price
                </Text>
                <HStack spacing={2} align="center">
                  <Text fontFamily="Orbitron" fontSize={32} color="neonGreen" fontWeight="bold" lineHeight={1}>
                    {price}
                  </Text>
                  <TokenIcon symbol={selectedToken.symbol} size="26px" />
                </HStack>
                {usdLabel && (
                  <Text fontFamily="Oxanium" fontSize={14} color="whiteAlpha.600" fontStyle="italic">
                    {usdLabel}
                  </Text>
                )}
              </Flex>

              {/* Details */}
              <VStack spacing={1} align="stretch" px={1}>
                <HStack justify="space-between">
                  <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500">Rarity</Text>
                  <Badge bg={rarityColor} color="white" fontSize={10} px={2} borderRadius="full">{rarityLabel}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500">Expires in</Text>
                  <Text fontFamily="Orbitron" fontSize={12} color="white">{expiryDays} day{expiryDays !== 1 ? "s" : ""}</Text>
                </HStack>
              </VStack>

              <Text fontFamily="Oxanium" fontSize={11} color="whiteAlpha.400" textAlign="center">
                This will trigger two transactions: approve NFT + sign order
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter pt={3} pb={5} gap={3} justifyContent="center">
            <Button variant="solid" size="md" px={8} onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="outlineSecondaryGlow" size="md" px={6} onClick={closeConfirm}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Success modal ── */}
      <Modal isOpen={isSuccessOpen} onClose={() => { closeSuccess(); onSuccess(); }} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.75)" />
        <ModalContent
          bg="rgba(6,38,64,0.8)"
          border="1px solid rgba(32,198,237,0.4)"
          borderRadius="24px"
          mx={4}
          animation={`${shimmer} 2.5s ease-in-out infinite`}
        >
          <ModalBody pt={7} pb={2}>
            <VStack spacing={5} align="center">
              <Text
                fontFamily="Orbitron"
                fontSize={20}
                color="neonGreen"
                textTransform="uppercase"
                letterSpacing="0.1em"
                textAlign="center"
                textShadow="0 0 10px rgba(32,198,237,0.45)"
              >
                Listed!
              </Text>

              <Box
                animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`}
                display="flex"
                justifyContent="center"
              >
                <CardImage
                  imageUrl={cardImageUrl(card.cardId, card.skinId)}
                  rarity={card.rarity}
                  skinId={card.skinId}
                  size="160px"
                  isSpecial={card.isSpecial}
                />
              </Box>

              <Text
                fontFamily="Orbitron"
                fontSize={16}
                color={titleColor}
                textTransform="uppercase"
                textAlign="center"
                style={{ textShadow: titleGlow }}
              >
                {card.cardName}
                {SKIN_SEASON_LABEL[card.skinId] && ` - ${SKIN_SEASON_LABEL[card.skinId]}`}
              </Text>

              <VStack spacing={0} align="center">
                <HStack spacing={2} align="center">
                  <Text fontFamily="Orbitron" fontSize={28} color="neonGreen" fontWeight="bold" lineHeight={1}>
                    {price}
                  </Text>
                  <TokenIcon symbol={selectedToken.symbol} size="24px" />
                </HStack>
                {usdLabel && (
                  <Text fontFamily="Oxanium" fontSize={13} color="whiteAlpha.500" fontStyle="italic">
                    {usdLabel}
                  </Text>
                )}
              </VStack>

            </VStack>
          </ModalBody>
          <ModalFooter pb={8} justifyContent="center">
            <Button variant="solid" size="md" px={8} onClick={() => { closeSuccess(); onSuccess(); }}>
              My Listings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

// ─── Card grid ────────────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CreateListingPage() {
  const { status: walletStatus, address } = useAccount();
  const { cards, loading, error } = useUserCards();
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);
  const [listedTokenIds, setListedTokenIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Fetch seller's active listings to show LISTED badges
  useEffect(() => {
    if (!address) return;
    getSellerListings(address).then(({ data }) => {
      const ids = new Set(
        data.filter((l) => l.status === "active").map((l) => l.token_id)
      );
      setListedTokenIds(ids);
    }).catch(() => {/* non-critical, ignore */});
  }, [address]);

  const handleSelect = (card: UserCard) => {
    if (!card.marketable) return;
    if (listedTokenIds.has(card.tokenId)) {
      navigate("/my-listings");
    } else {
      setSelectedCard(card);
    }
  };

  if (walletStatus !== "connected") {
    return (
      <VStack py={20} spacing={4}>
        <Heading size="m">Connect Your Wallet</Heading>
        <Text color="whiteAlpha.600" fontFamily="Oxanium">
          Connect your wallet to list cards for sale
        </Text>
      </VStack>
    );
  }

  if (selectedCard) {
    return (
      <CardListingPreview
        card={selectedCard}
        onBack={() => setSelectedCard(null)}
        onSuccess={() => navigate("/my-listings")}
      />
    );
  }

  const hasNonMarketable = cards.some((c) => !c.marketable);
  const displayCards = showAll ? cards : cards.filter((c) => c.marketable);

  const allSpecials = displayCards.filter((c) => c.isSpecial);
  const availableRarities = [...new Set(allSpecials.map((c) => c.rarity))].sort((a, b) => a - b);

  // Derive category from card ID ranges
  const SPECIAL_CATEGORIES: { key: string; label: string; color: string }[] = [
    { key: "Season 1", label: "Season 1", color: "#066b9b" },
    { key: "Season 2", label: "Season 2", color: "#20c6ed" },
    { key: "GG",       label: "GG",       color: "#f0c040" },
  ];

  function getSpecialCategory(cardId: number): string {
    if (cardId >= 10101 && cardId <= 10199) return "Season 1";
    if (cardId >= 10201 && cardId <= 10299) return "Season 2";
    if (cardId >= 19901 && cardId <= 19999) return "GG";
    return "Other";
  }

  const availableCategories = SPECIAL_CATEGORIES.filter((cat) =>
    allSpecials.some((c) => getSpecialCategory(c.cardId) === cat.key)
  );

  const filteredSpecials = allSpecials.filter((c) => {
    if (filterCategory !== null && getSpecialCategory(c.cardId) !== filterCategory) return false;
    if (filterRarity !== null && c.rarity !== filterRarity) return false;
    return true;
  });

  const specialGroups = groupCards(filteredSpecials).sort((a, b) => b.card.rarity - a.card.rarity);
  const traditionalGroups = groupCards(displayCards.filter((c) => !c.isSpecial)).sort((a, b) => b.card.rarity - a.card.rarity);

  return (
    <VStack spacing={6} align="stretch">
      <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
        <Heading size="l" variant="neonGreen">
          Select a Card to Sell
        </Heading>
        {hasNonMarketable && (
          <FormControl display="flex" alignItems="center" gap={2} w="auto">
            <Switch
              id="show-all-cards"
              isChecked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              colorScheme="cyan"
              size="sm"
            />
            <FormLabel
              htmlFor="show-all-cards"
              mb={0}
              fontSize={14}
              color={showAll ? "whiteAlpha.900" : "whiteAlpha.600"}
              fontFamily="Oxanium"
              cursor="pointer"
              userSelect="none"
            >
              Non Marketable
            </FormLabel>
          </FormControl>
        )}
      </Flex>

      {loading ? (
        <Flex justify="center" py={20}>
          <Spinner color="neonGreen" size="xl" />
        </Flex>
      ) : error ? (
        <VStack py={10} spacing={3}>
          {error.includes("GAME_API_KEY") ? (
            <>
              <Text color="yellow.400" textAlign="center" fontFamily="Oxanium">
                Game API key not configured.
              </Text>
              <Text color="whiteAlpha.500" textAlign="center" fontSize={11} fontFamily="Oxanium">
                Add <code>VITE_GAME_API_KEY</code> to <code>web/.env</code>
              </Text>
            </>
          ) : (
            <Text color="red.400" textAlign="center" fontFamily="Oxanium">
              {error.includes("Failed to fetch")
                ? "Could not connect to the game API. Check VITE_GAME_API_URL"
                : error}
            </Text>
          )}
        </VStack>
      ) : displayCards.length === 0 && !showAll ? (
        <VStack py={10} spacing={2}>
          <Text color="whiteAlpha.600" textAlign="center" fontFamily="Oxanium">
            No marketable cards in your wallet.
          </Text>
          {hasNonMarketable && (
            <Text color="whiteAlpha.400" textAlign="center" fontSize={11} fontFamily="Oxanium">
              You have cards that can't be listed.{" "}
              <Box
                as="span"
                color="neonGreen"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => setShowAll(true)}
              >
                Non marketable
              </Box>
            </Text>
          )}
        </VStack>
      ) : cards.length === 0 ? (
        <Text color="whiteAlpha.600" textAlign="center" py={10} fontFamily="Oxanium">
          No cards in your wallet
        </Text>
      ) : (
        <VStack spacing={10} align="stretch">
          {/* Special cards with filters */}
          {allSpecials.length > 0 && (
            <Box>
              <Flex align="center" gap={3} mb={3} wrap="wrap">
                <Heading size="m" variant="neonPink">Special Cards</Heading>
                <Box flex={1} h="1px" bg="whiteAlpha.200" />
                <Text fontSize={13} color="whiteAlpha.700" fontFamily="Oxanium">
                  {allSpecials.length} type{allSpecials.length !== 1 ? "s" : ""}
                </Text>
              </Flex>

              {/* Filters row */}
              {(availableCategories.length > 1 || availableRarities.length > 1) && (
                <Flex gap={4} mb={4} align="center" wrap="wrap">
                  {/* Category filter */}
                  {availableCategories.length > 1 && (
                    <HStack spacing={2} align="center">
                      <Text fontSize={11} color="whiteAlpha.600" fontFamily="Orbitron" textTransform="uppercase" mr={1}>
                        Category
                      </Text>
                      <Badge
                        bg={filterCategory === null ? "#A144B2" : "whiteAlpha.100"}
                        color={filterCategory === null ? "white" : "whiteAlpha.600"}
                        fontSize={11} px={3} py={1} borderRadius="full"
                        cursor="pointer"
                        onClick={() => setFilterCategory(null)}
                      >
                        All
                      </Badge>
                      {availableCategories.map(({ key, label, color }) => (
                        <Badge
                          key={key}
                          bg={filterCategory === key ? color : "whiteAlpha.100"}
                          color={filterCategory === key ? (key === "GG" ? "black" : "white") : "whiteAlpha.600"}
                          fontSize={11} px={3} py={1} borderRadius="full"
                          cursor="pointer"
                          onClick={() => setFilterCategory(filterCategory === key ? null : key)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </HStack>
                  )}

                  {/* Rarity filter */}
                  {availableRarities.length > 1 && (
                    <HStack spacing={2} align="center">
                      <Text fontSize={11} color="whiteAlpha.600" fontFamily="Orbitron" textTransform="uppercase" mr={1}>
                        Rarity
                      </Text>
                      <Badge
                        bg={filterRarity === null ? "#A144B2" : "whiteAlpha.100"}
                        color={filterRarity === null ? "white" : "whiteAlpha.600"}
                        fontSize={11} px={3} py={1} borderRadius="full"
                        cursor="pointer"
                        onClick={() => setFilterRarity(null)}
                      >
                        All
                      </Badge>
                      {availableRarities.map((r) => (
                        <Badge
                          key={r}
                          bg={filterRarity === r ? RARITY_COLORS[r] : "whiteAlpha.100"}
                          color={filterRarity === r ? "white" : "whiteAlpha.600"}
                          fontSize={11} px={3} py={1} borderRadius="full"
                          cursor="pointer"
                          onClick={() => setFilterRarity(filterRarity === r ? null : r)}
                        >
                          {RARITY_LABELS[r]}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </Flex>
              )}

              <CardSection
                title=""
                groups={specialGroups}
                listedTokenIds={listedTokenIds}
                onSelect={handleSelect}
              />
            </Box>
          )}

          <CardSection
            title="Traditional Cards"
            groups={traditionalGroups}
            listedTokenIds={listedTokenIds}
            onSelect={handleSelect}
          />
        </VStack>
      )}
    </VStack>
  );
}
