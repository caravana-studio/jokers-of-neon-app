import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { updateUserSkinPreference } from "../api/userPreferences";
import { RARITY, RarityLabels } from "../constants/rarity";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { SKINS_RARITY } from "../data/specialCards";
import { useDojo } from "../dojo/useDojo";
import { CardTypes } from "../enums/cardTypes";
import { useCardData } from "../providers/CardDataProvider";
import { useSkinPreferencesStore } from "../state/useSkinPreferencesStore";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import CachedImage from "./CachedImage";
import { CardImage3D } from "./CardImage3D";
import { TimesBadge } from "./TimesBadge";

interface CollectionCardHighlightProps {
  card: Card;
  selectedSkinId: number;
  ownedSkinIds: number[];
  ownedSkinCounts: Record<number, number>;
  onSkinChange: (skinId: number) => void;
  onClose: () => void;
}

const SKIN_CANDIDATES = [1, 2, 3, 4, 101, 102, 103, 104];

const splitBaseImageName = (img: string) => {
  const dotIndex = img.lastIndexOf(".");
  const extension = dotIndex === -1 ? ".png" : img.slice(dotIndex);
  const baseName = dotIndex === -1 ? img : img.slice(0, dotIndex);
  const baseWithoutSkin = baseName.replace(/[-_]?sk\d+$/i, "");
  return { baseWithoutSkin, extension };
};

const checkImageExists = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

export const CollectionCardHighlight = ({
  card,
  selectedSkinId,
  ownedSkinIds,
  ownedSkinCounts,
  onSkinChange,
  onClose,
}: CollectionCardHighlightProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection.highlight",
  });
  const { t: tDocs } = useTranslation("docs");
  const {
    account: { account },
  } = useDojo();
  const updateSkin = useSkinPreferencesStore((store) => store.updateSkin);
  const { getCardData } = useCardData();
  const cardId = card.card_id ?? 0;
  const baseImageName = card.img || `${cardId}.png`;
  const { baseWithoutSkin, extension } = splitBaseImageName(baseImageName);
  const baseDir = cardId < 300 && isMobile ? "mobile/" : "";
  const [availableSkinIds, setAvailableSkinIds] = useState<number[]>([0]);
  const [hasCheckedSkins, setHasCheckedSkins] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { name, description, type, rarity } = getCardData(cardId);
  const variantsEnabled = type !== CardTypes.COMMON && type !== CardTypes.NEON;

  const getImageSrc = (skinId: number) =>
    `/Cards/${baseDir}${
      skinId > 0
        ? `${baseWithoutSkin}_sk${skinId}${extension}`
        : `${baseWithoutSkin}${extension}`
    }`;

  useEffect(() => {
    let isActive = true;
    if (!variantsEnabled) {
      setAvailableSkinIds([0]);
      setHasCheckedSkins(true);
      return () => {
        isActive = false;
      };
    }
    const checkSkins = async () => {
      const checks = await Promise.all(
        SKIN_CANDIDATES.map((skinId) =>
          checkImageExists(
            `/Cards/${baseDir}${baseWithoutSkin}_sk${skinId}${extension}`,
          ),
        ),
      );

      if (!isActive) return;

      const available = SKIN_CANDIDATES.filter((_, index) => checks[index]);
      setAvailableSkinIds([0, ...available]);
      setHasCheckedSkins(true);
    };

    setHasCheckedSkins(false);
    setAvailableSkinIds([0]);
    checkSkins();

    return () => {
      isActive = false;
    };
  }, [baseDir, baseWithoutSkin, extension, variantsEnabled]);

  const selectedIsOwned = ownedSkinIds.includes(selectedSkinId);
  const selectedIsAvailable = availableSkinIds.includes(selectedSkinId);
  const fallbackSkinId =
    availableSkinIds.find((skinId) => ownedSkinIds.includes(skinId)) ?? 0;
  const resolvedSkinId = variantsEnabled
    ? selectedIsOwned && (selectedIsAvailable || !hasCheckedSkins)
      ? selectedSkinId
      : fallbackSkinId
    : 0;
  const cardRarityLabel = rarity
    ? tDocs(`rarity.${RarityLabels[rarity as RARITY]}`)
    : null;
  const skinRarity = SKINS_RARITY[resolvedSkinId];
  const skinRarityLabel = skinRarity
    ? tDocs(`rarity.${RarityLabels[skinRarity as RARITY]}`)
    : null;

  useEffect(() => {
    if (!variantsEnabled) return;
    if (!hasCheckedSkins) return;
    const nextSkinId = fallbackSkinId;
    if (
      (!availableSkinIds.includes(selectedSkinId) ||
        !ownedSkinIds.includes(selectedSkinId)) &&
      nextSkinId !== selectedSkinId
    ) {
      onSkinChange(nextSkinId);
    }
  }, [
    availableSkinIds,
    fallbackSkinId,
    hasCheckedSkins,
    onSkinChange,
    ownedSkinIds,
    selectedSkinId,
    variantsEnabled,
  ]);

  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.96);
  const detailsToggleLabel = isDescriptionOpen
    ? t("hide-details")
    : t("show-details");

  useEffect(() => {
    setOpacity(1);
    setScale(1);
  }, []);

  const bigScale = useBreakpointValue(
    { base: 2.0, sm: 2.4, md: 2.8, lg: 3.1 },
    { ssr: false },
  );
  const thumbScale = useBreakpointValue(
    { base: 0.55, sm: 0.7, md: 0.8, lg: 0.9 },
    { ssr: false },
  );

  const bigWidth = `${CARD_WIDTH * (bigScale ?? 2.4)}px`;
  const bigHeight = `${CARD_HEIGHT * (bigScale ?? 2.4)}px`;
  const thumbWidth = `${CARD_WIDTH * (thumbScale ?? 0.7)}px`;
  const thumbHeight = `${CARD_HEIGHT * (thumbScale ?? 0.7)}px`;
  const userAddress = account?.address;

  const getSkinLabel = (skinId: number) => {
    if (skinId === 0) return t("base-label");
    if (skinId === 101) return "GALAXY SKIN";
    if (skinId > 1 && skinId < 100) {
      return `SEASON ${skinId - 1} SKIN`;
    }
    return t("skin-label", { id: skinId });
  };

  const handleSkinSelect = async (
    skinId: number,
    isOwned: boolean,
    isSelected: boolean,
  ) => {
    if (!isOwned || isSelected) return;
    const previousSkinId = selectedSkinId;
    onSkinChange(skinId);
    if (cardId) {
      updateSkin(cardId, skinId);
    }

    if (!userAddress) {
      console.warn("updateUserSkinPreference: missing user address");
      return;
    }
    if (!cardId) {
      console.warn("updateUserSkinPreference: missing card id");
      return;
    }

    try {
      await updateUserSkinPreference(userAddress, cardId, skinId);
    } catch (error) {
      console.error("Failed to update skin preference", error);
      onSkinChange(previousSkinId);
      if (cardId) {
        updateSkin(cardId, previousSkinId);
      }
    }
  };

  return (
    <Flex
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={1100}
      opacity={opacity}
      flexDirection="column"
      transition="opacity 0.5s ease"
      justifyContent={{ base: "center", sm: "center" }}
      alignItems="center"
      py={{ base: 0, sm: 6, md: 8 }}
      backdropFilter="blur(10px)"
      backgroundColor=" rgba(0, 0, 0, 0.7)"
      onClick={onClose}
    >
      <Flex
        maxW="100%"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        justifyContent={{ base: "center", sm: "flex-start" }}
        gap={{ base: 3, sm: 2 }}
        px={{ base: 0, sm: 6 }}
        pt={{ base: 0, sm: 2 }}
        transform={`scale(${scale})`}
        transition="transform 0.3s ease"
        onClick={(e) => e.stopPropagation()}
        // backgroundColor="red"
      >
        <Flex flexDirection="column" alignItems="center"  mb={{base: 0, sm: 4}} textAlign="center">
          <Heading
            fontWeight={500}
            fontSize={{ base: "18px", sm: "22px" }}
            letterSpacing={1.2}
            textTransform="unset"
            color="white"
          >
            {name}
          </Heading>
        </Flex>
        {variantsEnabled && (
          <>
            <Heading
              fontSize={{ base: "12px", sm: "17px" }}
              color="whiteAlpha.800"
              variant="italic"
            >
              {t("variants-title")}
            </Heading>
            <Flex gap={{base: 3, sm: 5}} mb={{base: 0, sm: 8}} justifyContent="center" flexWrap="wrap">
              {availableSkinIds.map((skinId) => {
                const isSelected = skinId === resolvedSkinId;
                const isOwned = ownedSkinIds.includes(skinId);
                const ownedCount = ownedSkinCounts[skinId] ?? 0;
                return (
                  <Box
                    key={`skin-option-${skinId}`}
                    borderRadius="8px"
                    border="1px solid"
                    position="relative"
                    borderColor={
                      isOwned
                        ? isSelected
                          ? "rgba(255, 255, 255, 0)"
                          : "whiteAlpha.400"
                        : "whiteAlpha.300"
                    }
                    boxShadow={
                      isOwned && isSelected
                        ? "0 0 14px 2px rgba(255, 255, 255, 1)"
                        : "none"
                    }
                    cursor={isOwned ? "pointer" : "not-allowed"}
                    transition="all 0.2s ease"
                    onClick={() => {
                      void handleSkinSelect(skinId, isOwned, isSelected);
                    }}
                  >
                    {ownedCount > 1 && (
                      <TimesBadge count={ownedCount} size="sm" />
                    )}
                    <Flex
                      direction="column"
                      alignItems="center"
                      gap={1}
                      px={1}
                      pb={1}
                    >
                      <CachedImage
                        borderRadius="6px"
                        src={getImageSrc(skinId)}
                        alt={`${baseWithoutSkin}${skinId > 0 ? `_sk${skinId}` : ""}`}
                        width={thumbWidth}
                        height={thumbHeight}
                        filter={isOwned ? "none" : "grayscale(1)"}
                        opacity={isOwned ? 1 : 0.5}
                      />
                      <Text
                        fontSize="10px"
                        lineHeight={0.9}
                        letterSpacing={0.4}
                        color="whiteAlpha.800"
                        textTransform="uppercase"
                        maxW={thumbWidth}
                        textAlign="center"
                        whiteSpace="normal"
                        wordBreak="break-word"
                      >
                        {getSkinLabel(skinId)}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </>
        )}
        <Box
          width={bigWidth}
          height={bigHeight}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          boxShadow="0 10px 30px rgba(0, 0, 0, 0.6)"
          position="relative"
        >
          <CardImage3D
            key={`collection-highlight-${cardId}-${resolvedSkinId}`}
            hideTooltip
            card={card}
            skinId={resolvedSkinId}
            width={bigWidth}
            height={bigHeight}
          />
          {variantsEnabled && (
            <Box
              position="absolute"
              bottom={{ base: 2, sm: 3 }}
              left="50%"
              transform="translateX(-50%)"
              width={{ base: "92%", sm: "88%" }}
              zIndex={3}
              onClick={(e) => e.stopPropagation()}
            >
              <Collapse in={isDescriptionOpen} animateOpacity>
                <Box
                  borderRadius="16px"
                  backgroundColor="rgba(0, 0, 0, 0.6)"
                  px={4}
                  pb={3}
                  pt={2}
                  textAlign="center"
                >
                  <IconButton
                    aria-label={t("hide-details")}
                    icon={<ChevronDownIcon />}
                    variant="ghost"
                    size="md"
                    color="white"
                    _hover={{ color: "white" }}
                    mb={1}
                    onClick={() => setIsDescriptionOpen(false)}
                  />
                  {(cardRarityLabel || skinRarityLabel) && (
                    <Flex flexDir="column" alignItems="center">
                      {cardRarityLabel && (
                        <Text
                          fontSize={{ base: "13px", sm: "16px" }}
                          color="white"
                        >
                          {t("card-rarity-label")}{" "}
                          <Text
                            as="span"
                            fontWeight="bold"
                            textTransform="uppercase"
                            fontSize={{ base: "14px", sm: "17px" }}
                          >
                            {cardRarityLabel}
                          </Text>
                        </Text>
                      )}
                      {skinRarityLabel && (
                        <Text
                          fontSize={{ base: "13px", sm: "16px" }}
                          color="white"
                        >
                          {t("skin-rarity-label")}{" "}
                          <Text
                            as="span"
                            fontWeight="bold"
                            textTransform="uppercase"
                            fontSize={{ base: "14px", sm: "17px" }}
                          >
                            {skinRarityLabel}
                          </Text>
                        </Text>
                      )}
                      <Divider my={3} w="80%" borderColor="whiteAlpha.700" />
                    </Flex>
                  )}
                  <Text
                    fontSize={{ base: "14px", sm: "17px" }}
                    color="whiteAlpha.900"
                  >
                    {colorizeText(description)}
                  </Text>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Flex>
      {variantsEnabled && (
        <Flex
          position={{ base: "absolute", sm: "relative" }}
          bottom={{ base: 4, sm: "auto" }}
          mt={{ base: 0, sm: 3 }}
          pb={{ base: 0, sm: 0 }}
          width={{ base: "100%", sm: "auto" }}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={{ base: 3, sm: 3 }}
          alignSelf="center"
          onClick={(e) => e.stopPropagation()}
        >
          <Flex gap={5} justifyContent="center" mt={{ base: 0, sm: 6 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              variant="secondarySolid"
              size={{ base: "xs", sm: "md" }}
              fontSize={{ base: "10px !important", sm: "14px !important" }}
            >
              {t("close")}
            </Button>
            <Button
              onClick={() => setIsDescriptionOpen((open) => !open)}
              variant="solid"
              size={{ base: "xs", sm: "md" }}
              isDisabled={!description}
              fontSize={{ base: "10px !important", sm: "14px !important" }}
            >
              {detailsToggleLabel}
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
