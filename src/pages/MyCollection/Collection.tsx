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
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { CollectionCardHighlight } from "../../components/CollectionCardHighlight";
import { TiltCard } from "../../components/TiltCard";
import { TimesBadge } from "../../components/TimesBadge";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { getCardFromCardId } from "../../dojo/utils/getCardFromCardId";
import { useGameStore } from "../../state/useGameStore";
import { useSkinPreferencesStore } from "../../state/useSkinPreferencesStore";
import { BLUE } from "../../theme/colors";
import { Card } from "../../types/Card";
import { Collection } from "./types";

type Props = {
  collection: Collection;
  hideHighlight?: boolean;
  defaultOpen?: boolean;
};

const CollectionGrid: React.FC<Props> = ({
  collection,
  hideHighlight = false,
  defaultOpen = true,
}) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection.collections",
  });
  const [open, setOpen] = useState(defaultOpen);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedSkinId, setSelectedSkinId] = useState(0);
  const [selectedOwnedSkins, setSelectedOwnedSkins] = useState<number[]>([]);
  const [selectedOwnedSkinCounts, setSelectedOwnedSkinCounts] = useState<
    Record<number, number>
  >({});
  const skinsByCardId = useSkinPreferencesStore((store) => store.skinsByCardId);
  const ownedCount = collection.cards.filter(
    (card) => card.userNfts.length > 0,
  ).length;
  const customCardScale = useBreakpointValue(
    {
      base: 0.8,
      sm: 1,
      md: 1.2,
      lg: 1.5,
      xl: 2,
    },
    { ssr: false },
  );
  const { isClassic } = useGameStore();

  const cardHeight = CARD_HEIGHT * (customCardScale ?? 1);
  const cardWith = CARD_WIDTH * (customCardScale ?? 1);

  const length = collection.id < 0 ? 53 : collection.cards.length;

  return (
    <>
      {selectedCard && !hideHighlight && (
        <CollectionCardHighlight
          card={selectedCard}
          selectedSkinId={selectedSkinId}
          ownedSkinIds={selectedOwnedSkins}
          ownedSkinCounts={selectedOwnedSkinCounts}
          onSkinChange={setSelectedSkinId}
          onClose={() => {
            setSelectedCard(null);
            setSelectedSkinId(0);
            setSelectedOwnedSkins([]);
            setSelectedOwnedSkinCounts({});
          }}
        />
      )}
      <Box px={6} w="100%">
        <Flex
          w="100%"
          align="center"
          cursor="pointer"
          mb={2}
          onClick={() => setOpen((o) => !o)}
        >
          <Heading variant="italic" size="xs">
            {collection.id === -1
              ? t("traditionals")
              : collection.id === -2
                ? t("neons")
                : collection.id < 25
                  ? t("sx", { season: collection.id })
                  : t(`c${collection.id}`)}
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
                const maxSkinId = nftCard.userNfts.reduce(
                  (maxSkin, nft) => (nft.skin > maxSkin ? nft.skin : maxSkin),
                  0,
                );
                const cardImageSrc = `/Cards/${
                  (card.card_id ?? 0) < 300 && isMobile && isClassic
                    ? "mobile/"
                    : ""
                }${card.img}`;
                const ownedSkinIds = Array.from(
                  new Set(nftCard.userNfts.map((nft) => nft.skin)),
                );
                const ownedSkinCounts = nftCard.userNfts.reduce(
                  (counts, nft) => {
                    const skinId = nft.skin;
                    counts[skinId] = (counts[skinId] ?? 0) + 1;
                    return counts;
                  },
                  {} as Record<number, number>,
                );
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
                        setSelectedCard(card);
                        const cardIdKey =
                          card.card_id !== undefined
                            ? String(card.card_id)
                            : "";
                        const hasStoredSkin =
                          cardIdKey.length > 0 &&
                          Object.prototype.hasOwnProperty.call(
                            skinsByCardId,
                            cardIdKey,
                          );
                        const storedSkinId = hasStoredSkin
                          ? skinsByCardId[cardIdKey]
                          : undefined;
                        setSelectedSkinId(
                          Number.isFinite(storedSkinId)
                            ? (storedSkinId as number)
                            : maxSkinId,
                        );
                        setSelectedOwnedSkins(ownedSkinIds);
                        setSelectedOwnedSkinCounts(ownedSkinCounts);
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
                    <CachedImage
                      borderRadius={{ base: "5px", sm: "8px" }}
                      src={cardImageSrc}
                      alt={card.img}
                      width={`${cardWith}px`}
                      height={`${cardHeight}px`}
                      filter="grayscale(1)"
                      opacity={0.4}
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Collapse>
        <Divider mt={3} borderColor={BLUE} />
      </Box>
    </>
  );
};

export default CollectionGrid;
