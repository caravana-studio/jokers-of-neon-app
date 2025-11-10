import {
  Box,
  Collapse,
  Divider,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { TiltCard } from "../../components/TiltCard";
import { TimesBadge } from "../../components/TimesBadge";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { getCardFromCardId } from "../../dojo/utils/getCardFromCardId";
import { useCardData } from "../../providers/CardDataProvider";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";
import { BLUE } from "../../theme/colors";
import { Card } from "../../types/Card";
import { Collection } from "./types";
import { useTranslation } from "react-i18next";

type Props = {
  collection: Collection;
  hideHighlight?: boolean;
};

const CollectionGrid: React.FC<Props> = ({ collection, hideHighlight = false }) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection.collections",
  });
  const [open, setOpen] = useState(true);
  const ownedCount = collection.cards.filter(
    (card) => card.userNfts.length > 0
  ).length;
  const customCardScale = useBreakpointValue(
    {
      base: 0.6,
      sm: 1,
      md: 1.2,
      lg: 1.5,
      xl: 2,
    },
    { ssr: false }
  );
  const { getCardData } = useCardData();
  const { highlightItem: highlightCard, highlightedItem: highlightedCard } =
    useCardHighlight();

  const cardHeight = CARD_HEIGHT * (customCardScale ?? 1);
  const cardWith = CARD_WIDTH * (customCardScale ?? 1);
  
  const length = collection.id < 0 ? 53 : collection.cards.length
  
  return (
    <Box px={6} w="100%">
      {highlightedCard && !hideHighlight && (
        <MobileCardHighlight
          card={highlightedCard as Card}
          showExtraInfo
          hidePrice
        />
      )}
      <Flex
        w="100%"
        align="center"
        cursor="pointer"
        mb={2}
        onClick={() => setOpen((o) => !o)}
      >
        <Heading variant="italic" size="xs">
          {collection.id < 25 ? t("sx", { season: collection.id }) : t(`c${collection.id}`) }
        </Heading>
        <Text ml={2} fontSize="8px" color="gray.400">
          ({ownedCount}/{length})
        </Text>
        <Box ml="auto" mr={2}>
          <FontAwesomeIcon
            style={{
              transition: "transform 300ms",
              transform: !open ? "rotate(180deg)" : "",
            }}
            color="white"
            fontSize={10}
            icon={faChevronUp}
          />
        </Box>
      </Flex>
      <Collapse in={open} animateOpacity style={{ width: "100%" }}>
        <Flex alignContent={"center"} w="100%">
          <Flex
            flexDirection="row"
            alignItems={"center"}
            justifyContent={"center"}
            wrap={"wrap"}
            gap={2}
            py={2}
            mb={4}
            w="100%"
          >
            {collection.cards.map((nftCard, index) => {
              const card = getCardFromCardId(nftCard.id, index);
              return nftCard.userNfts.length > 0 ? (
                <Flex
                  key={index}
                  justifyContent={"center"}
                  alignItems={"center"}
                  position="relative"
                >
                  {nftCard.userNfts.length > 1 && (
                    <TimesBadge count={nftCard.userNfts.length} />
                  )}
                  <TiltCard
                    card={{ ...card, price: undefined }}
                    scale={customCardScale}
                    onClick={() => {
                      highlightCard(card);
                    }}
                    cursor="pointer"
                  />
                </Flex>
              ) : (
                <Flex
                  key={index}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Flex
                    key={card.id}
                    border="1px dashed"
                    borderColor="rgba(255, 255, 255, 0.5)"
                    borderRadius="5px"
                    height={`${cardHeight}px`}
                    width={`${cardWith}px`}
                    align="center"
                    justify="center"
                    color="white"
                    fontSize={[9, 10, 12, 14]}
                    bg="blackAlpha.300"
                    fontFamily="Orbitron"
                  >
                    # {String(card.id).slice(-2)}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Collapse>
      <Divider mt={3} borderColor={BLUE} />
    </Box>
  );
};

export default CollectionGrid;
