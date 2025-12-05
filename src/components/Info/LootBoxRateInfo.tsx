import { useTranslation } from "react-i18next";
import { Box, Flex, Text, VStack, HStack, Image, Heading } from "@chakra-ui/react";
import theme from "../../theme/theme";
import { InformationIcon } from "./InformationIcon";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface LootBoxRateInfoProps {
  name: string;
  details?: string;
  packId?: number;
}

interface CardRate {
  name: string;
  imageId: number;
  percentage: string;
  isSpecial?: boolean;
  rarity?: string;
}

interface ItemSection {
  itemNumber: number;
  cards: CardRate[];
}

// Data structure for Advanced Pack (pack ID 2)
const advancedPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "96.0%" },
      { name: "Joker", imageId: 52, percentage: "2.0%" },
      { name: "Neon", imageId: 200, percentage: "2.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "0.0%" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 52, percentage: "5.0%" },
      { name: "Neon", imageId: 200, percentage: "83.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "2.0%" },
      { name: "Special C", imageId: 200, percentage: "8.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "1.9%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "0.1%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 3,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 52, percentage: "0.0%" },
      { name: "Neon", imageId: 200, percentage: "48.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "2.0%" },
      { name: "Special C", imageId: 200, percentage: "40.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "7.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "2.9%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
];

// Data structure for Epic Pack (pack ID 3 - $2.99)
const epicPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "96.0%" },
      { name: "Joker", imageId: 52, percentage: "2.0%" },
      { name: "Neon", imageId: 200, percentage: "2.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "0.0%" },
      { name: "Special C", imageId: 200, percentage: "0.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "0.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "0.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "60.0%" },
      { name: "Joker", imageId: 52, percentage: "2.0%" },
      { name: "Neon", imageId: 200, percentage: "37.9%" },
      { name: "Neon Joker", imageId: 252, percentage: "0.1%" },
      { name: "Special C", imageId: 200, percentage: "0.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "0.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "0.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 3,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 52, percentage: "0.0%" },
      { name: "Neon", imageId: 200, percentage: "76.9%" },
      { name: "Neon Joker", imageId: 252, percentage: "2.0%" },
      { name: "Special C", imageId: 200, percentage: "15.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "5.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "1.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 4,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 52, percentage: "0.0%" },
      { name: "Neon", imageId: 200, percentage: "21.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "4.0%" },
      { name: "Special C", imageId: 200, percentage: "47.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "15.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "3.0%", isSpecial: true, rarity: "S" },
    ],
  },
];

// Data structure for Legendary Pack (pack ID 4 - $4.99)
const legendaryPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "96.0%" },
      { name: "Joker", imageId: 52, percentage: "2.0%" },
      { name: "Neon", imageId: 200, percentage: "2.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "0.0%" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "55.0%" },
      { name: "Joker", imageId: 52, percentage: "2.0%" },
      { name: "Neon", imageId: 200, percentage: "42.9%" },
      { name: "Neon Joker", imageId: 252, percentage: "0.1%" },
    ],
  },
  {
    itemNumber: 3,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 52, percentage: "0.0%" },
      { name: "Neon", imageId: 200, percentage: "48.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "2.0%" },
      { name: "Special C", imageId: 200, percentage: "40.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "7.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "2.9%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 4,
    cards: [
      { name: "Special C", imageId: 200, percentage: "60.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "30.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
];

// Data structure for Collector Pack (pack ID 5 - $9.99)
const collectorPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "50.0%" },
      { name: "Joker", imageId: 52, percentage: "20.0%" },
      { name: "Neon", imageId: 200, percentage: "10.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "10.0%" },
      { name: "Special C", imageId: 200, percentage: "5.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "5.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "0.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Joker", imageId: 52, percentage: "30.0%" },
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "20.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "10.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "5.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "5.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 3,
    cards: [
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "30.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "20.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 4,
    cards: [
      { name: "Special A", imageId: 202, percentage: "30.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
      { name: "Skin Special C", imageId: 200, percentage: "39.9%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "17.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "3.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 5,
    cards: [
      { name: "Skin Special C", imageId: 200, percentage: "30.0%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "30.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "30.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
];

// Data structure for Collector XL Pack (pack ID 6)
const collectorXLPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "50.0%" },
      { name: "Joker", imageId: 52, percentage: "20.0%" },
      { name: "Neon", imageId: 200, percentage: "10.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "10.0%" },
      { name: "Special C", imageId: 200, percentage: "5.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "5.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "0.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Joker", imageId: 52, percentage: "30.0%" },
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "20.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "10.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "5.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "5.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 3,
    cards: [
      { name: "Joker", imageId: 52, percentage: "30.0%" },
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "20.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "10.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "5.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "5.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 4,
    cards: [
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "30.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "20.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 5,
    cards: [
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "30.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "20.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 6,
    cards: [
      { name: "Neon", imageId: 200, percentage: "20.0%" },
      { name: "Neon Joker", imageId: 252, percentage: "30.0%" },
      { name: "Special C", imageId: 200, percentage: "10.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "20.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "10.0%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 7,
    cards: [
      { name: "Skin Special C", imageId: 200, percentage: "39.9%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "17.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "3.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 8,
    cards: [
      { name: "Skin Special C", imageId: 200, percentage: "39.9%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "17.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "3.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 9,
    cards: [
      { name: "Skin Special C", imageId: 200, percentage: "30.0%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "30.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "30.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
  {
    itemNumber: 10,
    cards: [
      { name: "Skin Special C", imageId: 200, percentage: "30.0%", isSpecial: true, rarity: "C" },
      { name: "Skin Special B", imageId: 201, percentage: "30.0%", isSpecial: true, rarity: "B" },
      { name: "Skin Special A", imageId: 202, percentage: "30.0%", isSpecial: true, rarity: "A" },
      { name: "Skin Special S", imageId: 203, percentage: "10.0%", isSpecial: true, rarity: "S" },
    ],
  },
];

const ItemSectionComponent = ({ section }: { section: ItemSection }) => {
  const { neonGreen, neonPink } = theme.colors;

  // Filter out cards with 0.0% probability
  const visibleCards = section.cards.filter(
    (card) => card.percentage !== "0.0%"
  );

  // Helper function to get the correct image path for special cards
  const getSpecialCardImage = (card: CardRate): string => {
    if (!card.isSpecial || !card.rarity) {
      return `/Cards/${card.imageId}.png`;
    }

    const isSkin = card.name.toLowerCase().includes("skin");
    const tier = card.rarity.toLowerCase();

    if (isSkin) {
      return `/rarity/skin-tier-${tier}.png`;
    } else {
      return `/rarity/tier-${tier}.png`;
    }
  };

  return (
    <Box
      bg="rgba(20, 20, 30, 0.95)"
      borderRadius="md"
      border="1px solid"
      borderColor={neonGreen}
      overflow="hidden"
      mb={3}
    >
      {/* Header */}
      <Flex
        p={3}
        bg="rgba(30, 30, 40, 0.8)"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="md" fontWeight="600" color="white">
          Cartas {section.itemNumber}
        </Text>
      </Flex>

      {/* Cards List */}
      <VStack spacing={0} align="stretch" p={2}>
          {visibleCards.map((card, index) => (
            <HStack
              key={`${card.name}-${index}`}
              p={2}
              spacing={3}
              bg={index % 2 === 0 ? "rgba(25, 25, 35, 0.5)" : "transparent"}
              borderRadius="sm"
            >
              {/* Card Image */}
              <Box
                w="50px"
                h="70px"
                flexShrink={0}
                bg="rgba(40, 40, 50, 0.8)"
                borderRadius="sm"
                border="1px solid"
                borderColor={card.isSpecial ? neonPink : neonGreen}
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={getSpecialCardImage(card)}
                  alt={card.name}
                  w="100%"
                  h="100%"
                  objectFit={card.isSpecial ? "contain" : "cover"}
                  fallback={
                    <Text fontSize="xs" color="gray.500">
                      {card.name}
                    </Text>
                  }
                />
              </Box>

              {/* Card Name */}
              <Text
                flex={1}
                fontSize="sm"
                color={card.isSpecial ? neonPink : "white"}
                fontWeight="500"
              >
                {card.name}
              </Text>

              {/* Percentage */}
              <Text
                fontSize="sm"
                fontWeight="700"
                color={neonGreen}
                minW="60px"
                textAlign="right"
              >
                {card.percentage}
              </Text>
            </HStack>
          ))}
        </VStack>
    </Box>
  );
};

export const LootBoxRateInfo: React.FC<LootBoxRateInfoProps> = ({
  name,
  details,
  packId,
}) => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;
  const { isSmallScreen } = useResponsiveValues();

  // Detect which pack this is by ID (most reliable) or name (fallback)
  const nameLower = name.toLowerCase();

  // Select pack data based on pack ID
  let packData = advancedPackData;
  let packType = 'advanced (default)';

  // Check by pack ID first (most reliable)
  if (packId === 2) {
    packData = advancedPackData;
    packType = 'advanced';
  } else if (packId === 3) {
    packData = epicPackData;
    packType = 'epic';
  } else if (packId === 4) {
    packData = legendaryPackData;
    packType = 'legendary';
  } else if (packId === 5) {
    packData = collectorPackData;
    packType = 'collector';
  } else if (packId === 6) {
    packData = collectorXLPackData;
    packType = 'collector-xl';
  } else {
    // Fallback to name-based detection for test/dev environments
    if (nameLower.includes("advanced") || nameLower.includes("avanzado")) {
      packData = advancedPackData;
      packType = 'advanced (by name)';
    } else if (nameLower.includes("legendary") || nameLower.includes("legendario")) {
      packData = legendaryPackData;
      packType = 'legendary (by name)';
    } else if (nameLower.includes("epic") || nameLower.includes("épico")) {
      packData = epicPackData;
      packType = 'epic (by name)';
    } else if (nameLower.includes("collector xl")) {
      packData = collectorXLPackData;
      packType = 'collector-xl (by name)';
    } else if (nameLower.includes("collector") || nameLower.includes("coleccionista")) {
      packData = collectorPackData;
      packType = 'collector (by name)';
    }
  }

  console.log('Pack Detection:', {
    packId,
    name,
    packType,
    itemsCount: packData.length
  });

  // Show new Pokemon TCG-style content for all packs on mobile
  // (In the future, only show for Advanced and Specials when all packs have data)
  const shouldShowNewContent = isSmallScreen;

  // New Pokemon TCG style content for mobile
  const newInfoContent = (
    <Box
      width="calc(100% - 32px)"
      maxWidth="600px"
      maxHeight="calc(85vh - 32px)"
      overflowY="auto"
      borderRadius="lg"
      m={4}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <Box
        bg="rgba(20, 20, 30, 0.98)"
        border="2px solid"
        borderColor={neonGreen}
        borderRadius="lg lg 0 0"
        py={4}
        px={4}
        position="sticky"
        top={0}
        zIndex={1}
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.6)"
      >
        <Heading
          size="lg"
          textAlign="center"
          color="white"
          fontWeight="600"
          letterSpacing="wider"
        >
          {t("store.packs.offering-rates")}
        </Heading>
      </Box>

      {/* Content */}
      <Box
        bg="rgba(10, 10, 20, 0.98)"
        borderRadius="0 0 lg lg"
        px={4}
        py={4}
      >
        <VStack spacing={0} align="stretch">
          {packData.map((section) => (
            <ItemSectionComponent key={section.itemNumber} section={section} />
          ))}
        </VStack>

        {/* Close instruction */}
        <Text
          textAlign="center"
          color="gray.500"
          fontSize="sm"
          mt={6}
          mb={2}
        >
          Tap anywhere to close
        </Text>
      </Box>
    </Box>
  );

  // Old simple content for desktop (fallback)
  const oldInfoContent = (
    <Box>
      <Heading mb={4} fontWeight={"400"} fontSize={"sm"}>
        {name}
      </Heading>
      <Text color={neonGreen} fontSize={"sm"}>
        {t("store.packs.offering-rates")}: <br />
        {details?.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Text>
    </Box>
  );

  const infoContent = shouldShowNewContent ? newInfoContent : oldInfoContent;

  return (
    <Flex gap={2} alignItems={"center"}>
      <Text>{t("store.packs.offering-rates")}</Text>
      <InformationIcon
        title="Offering rates"
        informationContent={infoContent}
      />
    </Flex>
  );
};
