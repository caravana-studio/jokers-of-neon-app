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
import { useAccount } from "@starknet-react/core";
import { CallData } from "starknet";
import { getSellerListings, cancelListing } from "../../marketplace/api/marketplace";
import { MARKETPLACE_CONTRACT_ADDRESS } from "../../marketplace/config/contracts";
import { parseStarknetError } from "../../marketplace/utils/parseStarknetError";
import { MyListingCard } from "../../marketplace/components/MyListingCard";
import type { Listing, ListingStatus } from "../../marketplace/types/marketplace";

type FilterTab = "all" | ListingStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "active",    label: "Active" },
  { key: "filled",    label: "Filled" },
  { key: "cancelled", label: "Cancelled" },
];

export function MyListingsPage() {
  const { account, address, status: walletStatus } = useAccount();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const fetchListings = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSellerListings(address);
      setListings(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleCancel = async (listing: Listing) => {
    if (!account) return;
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
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
    } catch (err) {
      setError(parseStarknetError(err));
    } finally {
      setCancellingId(null);
    }
  };

  if (walletStatus !== "connected") {
    return (
      <VStack py={20} spacing={4}>
        <Heading size="m">Connect Your Wallet</Heading>
        <Text color="whiteAlpha.600" fontFamily="Oxanium">
          Connect your wallet to view your listings
        </Text>
      </VStack>
    );
  }

  const displayed =
    activeTab === "all"
      ? listings
      : listings.filter((l) => l.status === activeTab);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="l" variant="neonGreen">
        My Listings
      </Heading>

      {/* Status filter tabs */}
      <HStack spacing={2} flexWrap="wrap">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? listings.length
              : listings.filter((l) => l.status === tab.key).length;
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
      ) : error ? (
        <Text color="red.400" textAlign="center" py={10} fontFamily="Oxanium">
          {error.includes("Failed to fetch")
            ? "Could not connect to the API. Check VITE_GAME_API_URL."
            : error}
        </Text>
      ) : displayed.length === 0 ? (
        <Text color="whiteAlpha.600" textAlign="center" py={10} fontFamily="Oxanium">
          {activeTab === "all"
            ? "You have no listings"
            : `No ${activeTab} listings`}
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
          {displayed.map((listing) => (
            <MyListingCard
              key={listing.id}
              listing={listing}
              onCancel={handleCancel}
              isCancelling={cancellingId === listing.id}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
