import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  Flex,
  HStack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "@starknet-react/core";
import { useNavigate } from "react-router-dom";
import { CallData } from "starknet";
import { getSellerListings, cancelListing } from "../../marketplace/api/marketplace";
import { MARKETPLACE_CONTRACT_ADDRESS } from "../../marketplace/config/contracts";
import { MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS } from "../../marketplace/components/cardGridLayout";
import { parseStarknetError } from "../../marketplace/utils/parseStarknetError";
import { MyListingCard } from "../../marketplace/components/MyListingCard";
import type { Listing, ListingStatus, UserCard } from "../../marketplace/types/marketplace";
import { getEffectiveStatus } from "../../marketplace/types/marketplace";
import { useCustomToast } from "../../hooks/useCustomToast";

type FilterTab = "all" | ListingStatus;

function isListingNotFoundError(err: unknown): boolean {
  return err instanceof Error && /\bAPI 404\b/.test(err.message);
}

export function MyListingsPage() {
  const { t } = useTranslation("marketplace");

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",       label: t("myListings.tabAll") },
    { key: "active",    label: t("myListings.tabActive") },
    { key: "expired",   label: t("myListings.tabExpired") },
    { key: "filled",    label: t("myListings.tabFilled") },
    { key: "cancelled", label: t("myListings.tabCancelled") },
  ];

  const { account, address, status: walletStatus } = useAccount();
  const navigate = useNavigate();
  const { showErrorToast } = useCustomToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [relistingId, setRelistingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("active");

  const fetchListings = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setLoadError(null);
    try {
      const result = await getSellerListings(address);
      setListings(result.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleCancel = async (listing: Listing) => {
    if (!account) return;
    if (!MARKETPLACE_CONTRACT_ADDRESS) {
      showErrorToast(t("myListings.marketplaceNotConfigured"));
      return;
    }

    setCancellingId(listing.id);
    try {
      // Cancel on-chain
      const tx = await account.execute([
        {
          contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
          entrypoint: "cancel_order",
          calldata: CallData.compile({ nonce: listing.nonce }),
        },
      ]);
      await account.waitForTransaction(tx.transaction_hash);

      // Cancel in backend
      await cancelListing(listing.id);
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: "cancelled" } : l))
      );
    } catch (err) {
      showErrorToast(parseStarknetError(err));
    } finally {
      setCancellingId(null);
    }
  };

  const handleRelist = async (listing: Listing) => {
    if (getEffectiveStatus(listing) !== "expired") return;

    setRelistingId(listing.id);
    try {
      try {
        await cancelListing(listing.id);
      } catch (err) {
        if (!isListingNotFoundError(err)) {
          throw err;
        }
      }
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: "cancelled" } : l))
      );

      const preselectedCard: UserCard = {
        tokenId: listing.token_id,
        cardId: listing.card_id,
        cardName: listing.card_name,
        rarity: listing.rarity,
        season: listing.season,
        skinId: listing.skin_id,
        quality: listing.quality,
        marketable: true,
        isSpecial: listing.card_id >= 10000,
        count: 1,
        owner: listing.seller_address,
        skinRarity: 0,
      };
      navigate("/sell", { state: { preselectedCard } });
    } catch (err) {
      showErrorToast(parseStarknetError(err));
    } finally {
      setRelistingId(null);
    }
  };

  if (walletStatus !== "connected") {
    return (
      <VStack py={20} spacing={4}>
        <Heading size="m">{t("auth.connectWallet")}</Heading>
        <Text color="whiteAlpha.600" fontFamily="Oxanium">
          {t("auth.connectToView")}
        </Text>
      </VStack>
    );
  }

  const displayed =
    activeTab === "all"
      ? listings
      : listings.filter((l) => getEffectiveStatus(l) === activeTab);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="l" variant="neonGreen">
        {t("myListings.title")}
      </Heading>

      {/* Status filter tabs */}
      <HStack spacing={2} flexWrap="wrap">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? listings.length
              : listings.filter((l) => getEffectiveStatus(l) === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <Box
              key={tab.key}
              as="button"
              onClick={() => setActiveTab(tab.key)}
              cursor="pointer"
            >
              <Badge
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize={13}
                fontFamily="Orbitron"
                bg={isActive ? "rgba(32,198,237,0.18)" : "whiteAlpha.100"}
                color={isActive ? "white" : "whiteAlpha.600"}
                fontWeight={isActive ? "bold" : "normal"}
                border="2px solid"
                borderColor={isActive ? "neonGreen" : "whiteAlpha.200"}
                boxShadow={isActive ? "0 0 12px rgba(32,198,237,0.45)" : "none"}
                transition="all 0.15s"
                _hover={{ borderColor: "neonGreen", color: "white" }}
              >
                {tab.label} ({count})
              </Badge>
            </Box>
          );
        })}
      </HStack>

      {loading ? (
        <Flex justify="center" py={20}>
          <Spinner color="neonGreen" size="xl" />
        </Flex>
      ) : loadError ? (
        <Text color="red.400" textAlign="center" py={10} fontFamily="Oxanium">
          {loadError.includes("Failed to fetch")
            ? t("myListings.errorApi")
            : loadError}
        </Text>
      ) : displayed.length === 0 ? (
        <Text color="whiteAlpha.600" textAlign="center" py={10} fontFamily="Oxanium">
          {activeTab === "all"
            ? t("myListings.noListings")
            : t("myListings.noStatusListings", { status: activeTab })}
        </Text>
      ) : (
        <>
          {activeTab === "expired" && displayed.length > 0 && (
            <Text color="whiteAlpha.600" fontSize={13} fontFamily="Oxanium">
              {t("myListings.expiredInfo")}
            </Text>
          )}
          <SimpleGrid templateColumns={MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS} spacing={4}>
            {displayed.map((listing) => (
              <MyListingCard
                key={listing.id}
                listing={listing}
                onCancel={handleCancel}
                onRelist={handleRelist}
                isCancelling={cancellingId === listing.id}
                isRelisting={relistingId === listing.id}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
}
