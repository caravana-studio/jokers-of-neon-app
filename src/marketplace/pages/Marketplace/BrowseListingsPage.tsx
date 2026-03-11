import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useListings } from "../../hooks/useListings";
import { ListingCard } from "../../components/ListingCard";
import { FilterLabel, FilterBarContainer, filterSelectStyles, filterInputStyles } from "../../components/FilterBar";
import { RARITY_LABELS } from "../../types/marketplace";

export function BrowseListingsPage() {
  const { listings, total, loading, loadingMore, error, filter, setFilter, loadMore, hasMore } =
    useListings();

  // Client-side name search across the loaded batch
  const [nameSearch, setNameSearch] = useState("");
  const displayed = nameSearch
    ? listings.filter((l) =>
        l.card_name?.toLowerCase().includes(nameSearch.toLowerCase())
      )
    : listings;

  return (
    <VStack spacing={5} align="stretch">
      <Heading size="l" variant="neonGreen">
        Marketplace
      </Heading>

      {/* Filter bar */}
      <FilterBarContainer>
        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          align={{ base: "stretch", sm: "flex-end" }}
          flexWrap="wrap"
        >
          {/* Name search */}
          <Box flex={{ base: "unset", sm: 1 }} minW="160px">
            <FilterLabel>Search</FilterLabel>
            <Input
              {...filterInputStyles}
              placeholder="Card name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </Box>

          {/* Rarity */}
          <Box minW="130px">
            <FilterLabel>Rarity</FilterLabel>
            <Select
              {...filterSelectStyles}
              value={filter.rarity ?? ""}
              onChange={(e) =>
                setFilter({ rarity: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="" style={{ background: "#0a0a0a" }}>All</option>
              {Object.entries(RARITY_LABELS).map(([val, label]) => (
                <option key={val} value={val} style={{ background: "#0a0a0a" }}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>

          {/* Sort */}
          <Box minW="140px">
            <FilterLabel>Sort by</FilterLabel>
            <Select
              {...filterSelectStyles}
              value={filter.sort ?? "newest"}
              onChange={(e) => setFilter({ sort: e.target.value as any })}
            >
              <option value="newest" style={{ background: "#0a0a0a" }}>Newest</option>
              <option value="oldest" style={{ background: "#0a0a0a" }}>Oldest</option>
              <option value="price_asc" style={{ background: "#0a0a0a" }}>Price ↑</option>
              <option value="price_desc" style={{ background: "#0a0a0a" }}>Price ↓</option>
            </Select>
          </Box>

          {/* Min price */}
          <Box minW="100px">
            <FilterLabel>Min Price (USD)</FilterLabel>
            <Input
              {...filterInputStyles}
              type="number"
              placeholder="0"
              value={filter.min_price ?? ""}
              onChange={(e) => setFilter({ min_price: e.target.value || undefined })}
            />
          </Box>

          {/* Max price */}
          <Box minW="100px">
            <FilterLabel>Max Price (USD)</FilterLabel>
            <Input
              {...filterInputStyles}
              type="number"
              placeholder="∞"
              value={filter.max_price ?? ""}
              onChange={(e) => setFilter({ max_price: e.target.value || undefined })}
            />
          </Box>
        </Flex>
      </FilterBarContainer>

      {/* Result count */}
      <Text fontSize={14} color="whiteAlpha.600" fontFamily="Oxanium">
        {nameSearch
          ? `${displayed.length} of ${listings.length} loaded · ${total} total`
          : `${listings.length} of ${total} listing${total !== 1 ? "s" : ""}`}
      </Text>

      {/* Grid */}
      {loading ? (
        <Flex justify="center" py={20}>
          <Spinner color="neonGreen" size="xl" />
        </Flex>
      ) : error ? (
        <VStack py={10} spacing={2}>
          <Text color="red.400" textAlign="center" fontFamily="Oxanium">
            {error.includes("Failed to fetch")
              ? "Could not connect to the API. Check VITE_GAME_API_URL."
              : error}
          </Text>
        </VStack>
      ) : displayed.length === 0 ? (
        <Text color="whiteAlpha.600" textAlign="center" py={10} fontFamily="Oxanium">
          {nameSearch ? `No listings match "${nameSearch}"` : "No listings found"}
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
          {displayed.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </SimpleGrid>
      )}

      {/* Load more */}
      {hasMore && !nameSearch && (
        <Flex justify="center" pt={2} pb={4}>
          <Button
            size="md"
            variant="outline"
            px={8}
            onClick={loadMore}
            isLoading={loadingMore}
            loadingText="Loading..."
          >
            Load More ({total - listings.length} remaining)
          </Button>
        </Flex>
      )}
    </VStack>
  );
}
