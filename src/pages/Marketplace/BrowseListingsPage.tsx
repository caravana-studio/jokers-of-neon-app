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
import { useTranslation } from "react-i18next";
import { useListings } from "../../marketplace/hooks/useListings";
import { ListingCard } from "../../marketplace/components/ListingCard";
import { MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS } from "../../marketplace/components/cardGridLayout";
import { FilterLabel, FilterBarContainer, filterSelectStyles, filterInputStyles } from "../../marketplace/components/FilterBar";
import { getEffectiveStatus, RARITY_LABELS } from "../../marketplace/types/marketplace";

export function BrowseListingsPage() {
  const { t } = useTranslation("marketplace");
  const specialListingsState = useListings("special");
  const traditionalListingsState = useListings("traditional");
  const { filter, setFilter } = specialListingsState;

  // Client-side name search across the loaded batch
  const [nameSearch, setNameSearch] = useState("");
  const activeSpecialListings = specialListingsState.listings.filter(
    (listing) => getEffectiveStatus(listing) === "active"
  );
  const activeTraditionalListings = traditionalListingsState.listings.filter(
    (listing) => getEffectiveStatus(listing) === "active"
  );
  const specialDisplayed = nameSearch
    ? activeSpecialListings.filter((l) =>
        l.card_name?.toLowerCase().includes(nameSearch.toLowerCase())
      )
    : activeSpecialListings;
  const traditionalDisplayed = nameSearch
    ? activeTraditionalListings.filter((l) =>
        l.card_name?.toLowerCase().includes(nameSearch.toLowerCase())
      )
    : activeTraditionalListings;

  const shownCount = specialDisplayed.length + traditionalDisplayed.length;
  const loadedCount =
    specialListingsState.listings.length + traditionalListingsState.listings.length;
  const total = specialListingsState.total + traditionalListingsState.total;
  const hasAnyLoaded =
    specialListingsState.loadedCount + traditionalListingsState.loadedCount > 0;

  const showSpecialSection =
    specialDisplayed.length > 0 ||
    specialListingsState.loading ||
    Boolean(specialListingsState.error) ||
    (!nameSearch && specialListingsState.hasMore);
  const showTraditionalSection =
    traditionalDisplayed.length > 0 ||
    traditionalListingsState.loading ||
    Boolean(traditionalListingsState.error) ||
    (!nameSearch && traditionalListingsState.hasMore);
  const isInitialLoading =
    !hasAnyLoaded &&
    specialListingsState.loading &&
    traditionalListingsState.loading;
  const hasOnlyApiErrors =
    !hasAnyLoaded &&
    !specialListingsState.loading &&
    !traditionalListingsState.loading &&
    Boolean(specialListingsState.error || traditionalListingsState.error);

  return (
    <VStack spacing={5} align="stretch">
      <Heading size="l" variant="neonGreen">
        {t("browse.title")}
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
            <FilterLabel>{t("browse.filter.search")}</FilterLabel>
            <Input
              {...filterInputStyles}
              placeholder={t("browse.filter.searchPlaceholder")}
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </Box>

          {/* Rarity */}
          <Box minW="130px">
            <FilterLabel>{t("browse.filter.rarity")}</FilterLabel>
            <Select
              {...filterSelectStyles}
              value={filter.rarity ?? ""}
              onChange={(e) =>
                setFilter({ rarity: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="" style={{ background: "#0a0a0a" }}>{t("browse.filter.all")}</option>
              {Object.entries(RARITY_LABELS).map(([val, label]) => (
                <option key={val} value={val} style={{ background: "#0a0a0a" }}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>

          {/* Sort */}
          <Box minW="140px">
            <FilterLabel>{t("browse.filter.sortBy")}</FilterLabel>
            <Select
              {...filterSelectStyles}
              value={filter.sort ?? "newest"}
              onChange={(e) => setFilter({ sort: e.target.value as any })}
            >
              <option value="newest" style={{ background: "#0a0a0a" }}>{t("browse.filter.newest")}</option>
              <option value="oldest" style={{ background: "#0a0a0a" }}>{t("browse.filter.oldest")}</option>
              <option value="price_asc" style={{ background: "#0a0a0a" }}>{t("browse.filter.priceAsc")}</option>
              <option value="price_desc" style={{ background: "#0a0a0a" }}>{t("browse.filter.priceDesc")}</option>
            </Select>
          </Box>

          {/* Min price */}
          <Box minW="100px">
            <FilterLabel>{t("browse.filter.minPrice")}</FilterLabel>
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
            <FilterLabel>{t("browse.filter.maxPrice")}</FilterLabel>
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
          ? t("browse.countFiltered", { shown: shownCount, loaded: loadedCount, total })
          : t(total !== 1 ? "browse.count_plural" : "browse.count", { shown: shownCount, total })}
      </Text>

      {/* Grid */}
      {isInitialLoading ? (
        <Flex justify="center" py={20}>
          <Spinner color="neonGreen" size="xl" />
        </Flex>
      ) : hasOnlyApiErrors ? (
        <VStack py={10} spacing={2}>
          <Text color="red.400" textAlign="center" fontFamily="Oxanium">
            {specialListingsState.error?.includes("Failed to fetch") ||
            traditionalListingsState.error?.includes("Failed to fetch")
              ? t("browse.errorApi")
              : specialListingsState.error ?? traditionalListingsState.error}
          </Text>
        </VStack>
      ) : shownCount === 0 ? (
        <Text color="whiteAlpha.600" textAlign="center" py={10} fontFamily="Oxanium">
          {nameSearch ? t("browse.noMatch", { query: nameSearch }) : t("browse.noListings")}
        </Text>
      ) : (
        <VStack spacing={8} align="stretch">
          {showSpecialSection && (
            <Box>
              <Flex align="center" gap={3} mb={4}>
                <Heading size="m" variant="neonPink">
                  {t("sell.specialCards")}
                </Heading>
                <Box flex={1} h="1px" bg="whiteAlpha.200" />
              </Flex>
              {specialListingsState.loading && specialListingsState.loadedCount === 0 ? (
                <Flex justify="center" py={10}>
                  <Spinner color="neonGreen" />
                </Flex>
              ) : specialListingsState.error ? (
                <Text color="red.400" textAlign="center" py={6} fontFamily="Oxanium">
                  {specialListingsState.error.includes("Failed to fetch")
                    ? t("browse.errorApi")
                    : specialListingsState.error}
                </Text>
              ) : (
                <>
                  <SimpleGrid templateColumns={MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS} spacing={4}>
                    {specialDisplayed.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </SimpleGrid>

                  {specialListingsState.hasMore && !nameSearch && (
                    <Flex justify="center" pt={2} pb={1}>
                      <Button
                        size="md"
                        variant="outline"
                        px={8}
                        onClick={specialListingsState.loadMore}
                        isLoading={specialListingsState.loadingMore}
                        loadingText={t("browse.loading")}
                      >
                        {t("browse.loadMore", {
                          remaining: Math.max(
                            specialListingsState.total - specialListingsState.loadedCount,
                            0
                          ),
                        })}
                      </Button>
                    </Flex>
                  )}
                </>
              )}
            </Box>
          )}

          {showTraditionalSection && (
            <Box>
              <Flex align="center" gap={3} mb={4}>
                <Heading size="m">{t("sell.traditionalCards")}</Heading>
                <Box flex={1} h="1px" bg="whiteAlpha.200" />
              </Flex>
              {traditionalListingsState.loading &&
              traditionalListingsState.loadedCount === 0 ? (
                <Flex justify="center" py={10}>
                  <Spinner color="neonGreen" />
                </Flex>
              ) : traditionalListingsState.error ? (
                <Text color="red.400" textAlign="center" py={6} fontFamily="Oxanium">
                  {traditionalListingsState.error.includes("Failed to fetch")
                    ? t("browse.errorApi")
                    : traditionalListingsState.error}
                </Text>
              ) : (
                <>
                  <SimpleGrid templateColumns={MARKETPLACE_CARD_GRID_TEMPLATE_COLUMNS} spacing={4}>
                    {traditionalDisplayed.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </SimpleGrid>

                  {traditionalListingsState.hasMore && !nameSearch && (
                    <Flex justify="center" pt={2} pb={1}>
                      <Button
                        size="md"
                        variant="outline"
                        px={8}
                        onClick={traditionalListingsState.loadMore}
                        isLoading={traditionalListingsState.loadingMore}
                        loadingText={t("browse.loading")}
                      >
                        {t("browse.loadMore", {
                          remaining: Math.max(
                            traditionalListingsState.total -
                              traditionalListingsState.loadedCount,
                            0
                          ),
                        })}
                      </Button>
                    </Flex>
                  )}
                </>
              )}
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
}
