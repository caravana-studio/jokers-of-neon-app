import { Box, Flex, Heading, Text, VStack, HStack, Image, Collapse, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import theme from "../../theme/theme";

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

interface MobileLootBoxRatesProps {
  onClose: () => void;
  packId: number;
}

// Data structure for Advanced Pack (pack ID 3)
const advancedPackData: ItemSection[] = [
  {
    itemNumber: 1,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "96.0%" },
      { name: "Joker", imageId: 50, percentage: "2.0%" },
      { name: "Neon", imageId: 100, percentage: "2.0%" },
      { name: "Neon Joker", imageId: 150, percentage: "0.0%" },
    ],
  },
  {
    itemNumber: 2,
    cards: [
      { name: "Tradicional", imageId: 1, percentage: "0.0%" },
      { name: "Joker", imageId: 50, percentage: "5.0%" },
      { name: "Neon", imageId: 100, percentage: "83.0%" },
      { name: "Neon Joker", imageId: 150, percentage: "2.0%" },
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
      { name: "Joker", imageId: 50, percentage: "0.0%" },
      { name: "Neon", imageId: 100, percentage: "48.0%" },
      { name: "Neon Joker", imageId: 150, percentage: "2.0%" },
      { name: "Special C", imageId: 200, percentage: "40.0%", isSpecial: true, rarity: "C" },
      { name: "Special B", imageId: 201, percentage: "7.0%", isSpecial: true, rarity: "B" },
      { name: "Special A", imageId: 202, percentage: "2.9%", isSpecial: true, rarity: "A" },
      { name: "Special S", imageId: 203, percentage: "0.1%", isSpecial: true, rarity: "S" },
    ],
  },
];

const ItemSectionComponent = ({ section }: { section: ItemSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { neonGreen, neonPink } = theme.colors;

  const renderStars = (count: number) => {
    return (
      <Flex gap={1}>
        {Array.from({ length: count }).map((_, i) => (
          <Text key={i} fontSize="lg" color={neonGreen}>
            ⭐
          </Text>
        ))}
      </Flex>
    );
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
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: "rgba(40, 40, 50, 0.8)" }}
      >
        <HStack spacing={3}>
          {renderStars(section.itemNumber)}
          <Text fontSize="md" fontWeight="600" color="white">
            Item {section.itemNumber}
          </Text>
        </HStack>
        <Icon
          as={isOpen ? ChevronUpIcon : ChevronDownIcon}
          w={6}
          h={6}
          color={neonGreen}
        />
      </Flex>

      {/* Cards List */}
      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={0} align="stretch" p={2}>
          {section.cards.map((card, index) => (
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
                  src={`/Cards/${card.imageId}.png`}
                  alt={card.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
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
      </Collapse>
    </Box>
  );
};

export const MobileLootBoxRates = ({ onClose, packId }: MobileLootBoxRatesProps) => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;

  // For now, only showing Advanced Pack data
  // You can extend this to support other pack IDs in the future
  const packData = packId === 3 ? advancedPackData : [];

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.95)"
      zIndex={2000}
      flexDirection="column"
      onClick={onClose}
    >
      {/* Header */}
      <Box
        bg="rgba(20, 20, 30, 0.98)"
        borderBottom="2px solid"
        borderColor={neonGreen}
        py={4}
        px={4}
        onClick={(e) => e.stopPropagation()}
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
        flex={1}
        overflowY="auto"
        px={4}
        py={4}
        onClick={(e) => e.stopPropagation()}
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
          mb={4}
        >
          {t("common.tap-to-close", "Tap anywhere to close")}
        </Text>
      </Box>
    </Flex>
  );
};