import { useTranslation } from "react-i18next";
import { Box, Flex, Text, VStack, HStack, Image, Heading } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import theme from "../../theme/theme";
import { InformationIcon } from "./InformationIcon";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { PACK_RATES, CARD_TYPE_METADATA } from "../../data/lootBoxRates";

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

interface ItemSectionProps {
  section: ItemSection;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

const ItemSectionComponent = ({ section, sectionRef }: ItemSectionProps) => {
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
    const tier = card.rarity.toUpperCase(); // Use uppercase for normal cards
    const tierLower = card.rarity.toLowerCase(); // Use lowercase for skin cards

    if (isSkin) {
      return `/rarity/${tierLower}_skin-tier.png`;
    } else {
      return `/rarity/${tier}-tier.png`;
    }
  };

  return (
    <Box
      bg="rgba(20, 20, 30, 0.95)"
      borderRadius="md"
      border="1px solid"
      borderColor={neonGreen}
      overflow="hidden"
      mb={1.5}
    >
      {/* Header */}
      <Flex
        ref={sectionRef}
        py={1.5}
        px={2}
        bg="rgba(30, 30, 40, 0.8)"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" fontWeight="600" color="white">
          Item {section.itemNumber}
        </Text>
      </Flex>

      {/* Cards List */}
      <VStack spacing={0} align="stretch" p={1}>
          {visibleCards.map((card, index) => (
            <HStack
              key={`${card.name}-${index}`}
              py={1}
              px={1.5}
              spacing={2}
              bg={index % 2 === 0 ? "rgba(25, 25, 35, 0.5)" : "transparent"}
              borderRadius="sm"
            >
              {/* Card Image */}
              <Box
                w="32px"
                h="45px"
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
                    <Text fontSize="2xs" color="gray.500">
                      {card.name}
                    </Text>
                  }
                />
              </Box>

              {/* Card Name */}
              <Text
                flex={1}
                fontSize="xs"
                color={card.isSpecial ? neonPink : "white"}
                fontWeight="500"
              >
                {card.name}
              </Text>

              {/* Percentage */}
              <Text
                fontSize="xs"
                fontWeight="700"
                color={neonGreen}
                minW="50px"
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

// Helper function to convert pack rates data to ItemSection format
const convertPackRatesToSections = (packId: number, t: any): ItemSection[] => {
  const packRates = PACK_RATES[packId];
  if (!packRates) return [];

  return packRates.map((section) => ({
    itemNumber: section.itemNumber,
    cards: section.rates.map((rate) => {
      const metadata = CARD_TYPE_METADATA[rate.itemType];
      return {
        name: t(metadata.nameKey),
        imageId: metadata.imageId,
        percentage: rate.percentage,
        isSpecial: metadata.isSpecial,
        rarity: metadata.rarity,
      };
    }),
  }));
};

export const LootBoxRateInfo: React.FC<LootBoxRateInfoProps> = ({
  name,
  details,
  packId,
}) => {
  const { t } = useTranslation(["store"]);
  const { neonGreen, neonPink } = theme.colors;
  const { information } = useInformationPopUp();

  // Get pack data by ID only - no fallback to name
  const packData = packId ? convertPackRatesToSections(packId, t) : [];

  // Refs for scrolling to sections
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const isManualScrolling = useRef(false);

  // Reset active section when component mounts
  useEffect(() => {
    setActiveSection(null);
  }, []);

  // Reset active section when popup closes (information becomes undefined)
  useEffect(() => {
    if (!information) {
      setActiveSection(null);
      isManualScrolling.current = false;
    }
  }, [information]);

  const scrollToSection = (sectionNumber: number) => {
    const element = sectionRefs.current[sectionNumber];
    const container = scrollContainerRef.current;

    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const offset = elementRect.top - containerRect.top + scrollTop - 75;

      // On mobile, mark as manual scroll and prevent auto-detect temporarily
      if (isMobile) {
        isManualScrolling.current = true;
        setActiveSection(sectionNumber);

        container.scrollTo({
          top: offset,
          behavior: 'smooth'
        });

        // After 800ms (after smooth scroll), allow auto-detect again
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 800);
      } else {
        container.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        setActiveSection(sectionNumber);
      }
    }
  };

  // Detect which section is currently visible
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // On mobile, if we're in a manual scroll, don't update activeSection
      if (isMobile && isManualScrolling.current) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop;

      // Find which section is most visible
      let currentSection = 1;
      let maxVisibility = 0;

      packData.forEach((section) => {
        const element = sectionRefs.current[section.itemNumber];
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);

          if (visibleHeight > maxVisibility) {
            maxVisibility = visibleHeight;
            currentSection = section.itemNumber;
          }
        }
      });

      setActiveSection(currentSection);
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check - only on desktop, on mobile we don't want to pre-select anything
    if (!isMobile) {
      handleScroll();
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [packData]);

  // New Pokemon TCG style content
  const newInfoContent = (
    <Flex position="relative" onClick={(e) => e.stopPropagation()}>
      {/* Side Navigation Tabs - Card Shape */}
      <Flex
        flexDirection="column"
        gap={1.5}
        position="absolute"
        right="-18px"
        top="0"
        bottom="0"
        height="75vh"
        zIndex={2}
        py={3}
      >
        {packData.map((section) => (
          <Box
            key={section.itemNumber}
            position="relative"
            w="22px"
            h="32px"
            bg={activeSection === section.itemNumber ? neonPink : "rgba(30, 30, 40, 0.95)"}
            border="1.5px solid"
            borderColor={activeSection === section.itemNumber ? neonPink : neonGreen}
            borderRadius="2px"
            cursor="pointer"
            onClick={() => scrollToSection(section.itemNumber)}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
            _hover={{
              bg: neonPink,
              borderColor: neonPink,
              transform: "translateX(-3px) scale(1.08)",
              boxShadow: "0 3px 8px rgba(0, 0, 0, 0.5)"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: "1.5px",
              left: "1.5px",
              right: "1.5px",
              bottom: "1.5px",
              border: "0.5px solid",
              borderColor: activeSection === section.itemNumber ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
              borderRadius: "1px",
              pointerEvents: "none"
            }}
          >
            <Text
              fontSize="10px"
              fontWeight="700"
              color="white"
              textShadow="0 1px 2px rgba(0, 0, 0, 0.8)"
            >
              {section.itemNumber}
            </Text>
          </Box>
        ))}
      </Flex>

      <Box
        ref={scrollContainerRef}
        width="calc(100% - 32px)"
        maxWidth="380px"
        maxHeight="75vh"
        overflowY="auto"
        borderRadius="lg"
        m={3}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }}
      >
        {/* Header */}
        <Box
          bg="rgba(20, 20, 30, 1)"
          border="2px solid"
          borderColor={neonGreen}
          borderRadius="lg lg 0 0"
          py={2}
          px={3}
          position="sticky"
          top={0}
          zIndex={1}
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.6)"
        >
          <Heading
            size="md"
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
          px={2}
          py={2}
        >
          <VStack spacing={0} align="stretch">
            {packData.map((section) => (
              <ItemSectionComponent
                key={section.itemNumber}
                section={section}
                sectionRef={(el) => (sectionRefs.current[section.itemNumber] = el)}
              />
            ))}
          </VStack>

          {/* Close instruction */}
          <Text
            textAlign="center"
            color="gray.500"
            fontSize="xs"
            mt={3}
            mb={1}
          >
            Tap anywhere to close
          </Text>
        </Box>
      </Box>
    </Flex>
  );

  return (
    <Flex gap={2} alignItems={"center"}>
      <Text>{t("store.packs.offering-rates")}</Text>
      <InformationIcon
        title="Offering rates"
        informationContent={newInfoContent}
      />
    </Flex>
  );
};
