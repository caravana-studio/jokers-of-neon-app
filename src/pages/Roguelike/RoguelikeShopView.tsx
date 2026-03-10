import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAvailableShopTabs,
  SHOP_TAB_LABELS,
} from "../../domain/roguelike/selectors";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { ShopOffer, ShopTabId } from "../../domain/roguelike/types";
import { useProgressStore } from "../../state/roguelike/useProgressStore";
import { useGameStore } from "../../state/useGameStore";
import { useRoguelikeRuntimeStore } from "../../state/roguelike/useRoguelikeRuntimeStore";
import { useRunStore } from "../../state/roguelike/useRunStore";

const DeckOfferCard = ({
  offer,
  gold,
  onBuy,
}: {
  offer: ShopOffer;
  gold: number;
  onBuy: () => void;
}) => {
  const canBuy = !offer.purchased && gold >= offer.price;

  return (
    <Box
      border="1px solid rgba(255,255,255,0.22)"
      borderRadius="12px"
      p={3}
      bg={offer.purchased ? "rgba(34,197,94,0.2)" : "rgba(0,0,0,0.35)"}
    >
      <Flex justifyContent="space-between" alignItems="center" gap={2}>
        <Box>
          <Text fontWeight="bold">{offer.title}</Text>
          <Text fontSize="sm" opacity={0.8}>
            {offer.description}
          </Text>
          <Text fontSize="sm">Rarity: {offer.rarity}</Text>
        </Box>
        <Flex alignItems="center" gap={2}>
          <Text minW="80px" textAlign="right">
            {offer.price} gold
          </Text>
          <Button size="sm" onClick={onBuy} isDisabled={!canBuy}>
            {offer.purchased ? "Purchased" : "Buy"}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export const RoguelikeShopView = () => {
  const navigate = useNavigate();

  const activeRun = useRunStore((state) => state.activeRun);
  const shop = useRunStore((state) => state.shop);
  const runError = useRunStore((state) => state.error);
  const buyCard = useRunStore((state) => state.buyCard);
  const currentShopId = useRoguelikeRuntimeStore((state) => state.currentShopId);
  const leaveShopToMap = useRoguelikeRuntimeStore((state) => state.leaveShopToMap);

  const profile = useProgressStore((state) => state.profile);
  const enabledTabs = useMemo(
    () => getAvailableShopTabs(profile?.unlockedSystems ?? []),
    [profile?.unlockedSystems]
  );

  useEffect(() => {
    if (!activeRun?.runId) {
      return;
    }

    void useRunStore.getState().loadShop();
  }, [activeRun?.runId]);

  if (!activeRun) {
    return (
      <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
        <VStack
          spacing={4}
          p={6}
          maxW="560px"
          bg="rgba(0,0,0,0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          color="white"
        >
          <Heading size="md">No hay run activa</Heading>
          <Button onClick={() => navigate("/roguelike")}>Go to Entry</Button>
        </VStack>
      </Flex>
    );
  }

  const tabs: ShopTabId[] = shop?.availableTabs ?? enabledTabs;
  const deckOffers = useMemo(() => {
    const offers = shop?.offersByTab.DECK ?? [];
    if (offers.length === 0) {
      return offers;
    }

    const offset = Math.max(0, (currentShopId ?? 1) - 1) % offers.length;
    return [...offers.slice(offset), ...offers.slice(0, offset)];
  }, [shop?.offersByTab.DECK, currentShopId]);

  const handleBackToMap = () => {
    leaveShopToMap();
    useGameStore.setState({ state: GameStateEnum.Map });
    navigate("/map");
  };

  return (
    <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
      <VStack
        spacing={4}
        maxW="960px"
        w="100%"
        p={{ base: 4, md: 6 }}
        bg="rgba(0,0,0,0.55)"
        border="1px solid rgba(255,255,255,0.2)"
        borderRadius="16px"
        color="white"
        alignItems="stretch"
      >
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Heading size="lg">Roguelike Shop</Heading>
          <Flex gap={3}>
            <Text>Shop: {currentShopId ?? 1}</Text>
            <Text>Gold: {activeRun.gold}</Text>
          </Flex>
        </Flex>

        <Tabs variant="enclosed">
          <TabList>
            {tabs.map((tabId) => (
              <Tab key={tabId}>{SHOP_TAB_LABELS[tabId]}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tabId) => (
              <TabPanel key={tabId} px={0} py={4}>
                {tabId === "DECK" ? (
                  <VStack alignItems="stretch" spacing={2}>
                    {deckOffers.map((offer) => (
                      <DeckOfferCard
                        key={offer.id}
                        offer={offer}
                        gold={activeRun.gold}
                        onBuy={() => void buyCard(offer.id, "DECK")}
                      />
                    ))}
                    {deckOffers.length === 0 && (
                      <Text opacity={0.8}>No hay ofertas de Deck para esta run.</Text>
                    )}
                  </VStack>
                ) : (
                  <Box
                    border="1px dashed rgba(255,255,255,0.22)"
                    borderRadius="12px"
                    p={4}
                    bg="rgba(0,0,0,0.25)"
                  >
                    <Text fontWeight="bold">{SHOP_TAB_LABELS[tabId]}</Text>
                    <Text opacity={0.8}>
                      Placeholder PoC: esta tab ya se habilita dinámicamente por
                      progreso, pero su contenido real se implementa después.
                    </Text>
                  </Box>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {runError && <Text color="red.300">{runError}</Text>}

        <Flex gap={3} flexWrap="wrap">
          <Button onClick={handleBackToMap}>Back to Map</Button>
          <Button variant="secondarySolid" onClick={() => navigate("/roguelike")}>
            Exit Shop
          </Button>
        </Flex>
      </VStack>
    </Flex>
  );
};
