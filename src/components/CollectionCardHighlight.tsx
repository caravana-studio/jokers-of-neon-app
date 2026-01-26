import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { CardTypes } from "../enums/cardTypes";
import { useCardData } from "../providers/CardDataProvider";
import { useGameStore } from "../state/useGameStore";
import { Card } from "../types/Card";
import { colorizeText } from "../utils/getTooltip";
import CachedImage from "./CachedImage";
import { CardImage3D } from "./CardImage3D";

interface CollectionCardHighlightProps {
  card: Card;
  selectedSkinId: number;
  ownedSkinIds: number[];
  onSkinChange: (skinId: number) => void;
  onClose: () => void;
}

const SKIN_CANDIDATES = [1, 2, 3, 4];

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
  onSkinChange,
  onClose,
}: CollectionCardHighlightProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-collection.highlight",
  });
  const { t: tGame } = useTranslation("game");
  const { isClassic } = useGameStore();
  const { getCardData } = useCardData();
  const cardId = card.card_id ?? 0;
  const baseImageName = card.img || `${cardId}.png`;
  const { baseWithoutSkin, extension } = splitBaseImageName(baseImageName);
  const baseDir = cardId < 300 && isMobile && isClassic ? "mobile/" : "";
  const [availableSkinIds, setAvailableSkinIds] = useState<number[]>([0]);
  const [hasCheckedSkins, setHasCheckedSkins] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { name, description, type } = getCardData(cardId);
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
  const resolvedSkinId =
    variantsEnabled
      ? selectedIsOwned && (selectedIsAvailable || !hasCheckedSkins)
        ? selectedSkinId
        : fallbackSkinId
      : 0;

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
  const bigImageSrc =
    resolvedSkinId > 0 ? getImageSrc(resolvedSkinId) : undefined;

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
      justifyContent="center"
      alignItems="center"
      backdropFilter="blur(10px)"
      backgroundColor=" rgba(0, 0, 0, 0.7)"
      onClick={onClose}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        gap={3}
        transform={`scale(${scale})`}
        transition="transform 0.3s ease"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex flexDirection="column" alignItems="center" textAlign="center">
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
            <Flex gap={3} justifyContent="center" flexWrap="wrap">
              {availableSkinIds.map((skinId) => {
                const isSelected = skinId === resolvedSkinId;
                const isOwned = ownedSkinIds.includes(skinId);
                return (
                  <Box
                    key={`skin-option-${skinId}`}
                    borderRadius="8px"
                    border="1px solid"
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
                      if (isOwned) onSkinChange(skinId);
                    }}
                  >
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
                        letterSpacing={0.4}
                        color="whiteAlpha.800"
                        textTransform="uppercase"
                      >
                        {skinId === 0
                          ? t("base-label")
                          : t("skin-label", { id: skinId })}
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
        >
          <CardImage3D
            key={`collection-highlight-${cardId}-${resolvedSkinId}`}
            hideTooltip
            card={card}
            imageSrc={bigImageSrc}
            width={bigWidth}
            height={bigHeight}
          />
        </Box>
      </Flex>
      {variantsEnabled && (
        <Flex
          position="absolute"
          bottom={{ base: 4, sm: 6 }}
          width="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={3}
          onClick={(e) => e.stopPropagation()}
        >
          <Collapse in={isDescriptionOpen} animateOpacity style={{ width: "100%" }}>
            <Flex justifyContent="center">
              <Box
                width={{ base: "90%", sm: "70%", md: "60%" }}
                maxW="720px"
                borderRadius="16px"
                backgroundColor="rgba(0, 0, 0, 0.6)"
                px={4}
                pb={3}
                textAlign="center"
              >
                <IconButton
                  aria-label={t("hide-description")}
                  icon={<ChevronDownIcon />}
                  variant="ghost"
                  size="md"
                  color="white"
                  _hover={{ color: "white" }}
                  mb={1}
                  onClick={() => setIsDescriptionOpen(false)}
                />
                <Text fontSize={{ base: "14px", sm: "17px" }} color="whiteAlpha.900">
                  {colorizeText(description)}
                </Text>
              </Box>
            </Flex>
          </Collapse>
          <Flex gap={5} justifyContent="center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              variant="secondarySolid"
              size="xs"
              fontSize={{ base: "9px", sm: "14px" }}
            >
              {t("close")}
            </Button>
            <Button
              onClick={() => setIsDescriptionOpen((open) => !open)}
              variant="solid"
              size="xs"
              isDisabled={!description}
              fontSize={{ base: "9px", sm: "14px" }}
            >
              {isDescriptionOpen ? t("hide-description") : t("show-description")}
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
