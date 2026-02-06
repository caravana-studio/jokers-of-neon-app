import { Box, SystemStyleObject } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import Tilt from "react-parallax-tilt";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  MODIFIERS_OFFSET_X,
  MODIFIERS_OFFSET_Y,
  TILT_OPTIONS,
} from "../constants/visualProps";

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import {
  isModifierSilent,
  useIsDebuffed,
  useIsSilent,
} from "../hooks/useIsSilent.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { useSkinPreferencesStore } from "../state/useSkinPreferencesStore";
import { HEARTS, VIOLET } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { Card } from "../types/Card";
import { useTransformedCard } from "../utils/cardTransformation/cardTransformation.ts";
import { AnimatedCard } from "./AnimatedCard";
import { BrokenCard } from "./BrokenCard.tsx";
import CachedImage from "./CachedImage.tsx";
import { CardTooltip } from "./CardTooltip.tsx";
import { DraggableCard } from "./DraggableCard";
import { PriceBox } from "./PriceBox.tsx";
import { PurchasedLbl } from "./PurchasedLbl.tsx";
import { TemporalBadge } from "./TemporalBadge.tsx";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  skin_id?: number;
  onClick?: () => void;
  cursor?: string;
  isPack?: boolean;
  scale?: number;
  className?: string;
  used?: boolean;
  onDeck?: boolean;
  onHold?: () => void;
  height?: number;
}

export const TiltCard = ({
  card,
  skin_id,
  onClick,
  cursor,
  isPack = false,
  scale = 1,
  className,
  used = false,
  onDeck = false,
  onHold,
  height,
}: ICardProps) => {
  const { img, purchased = false } = card;
  const cardHeight = height
    ? height
    : scale
      ? CARD_HEIGHT * scale
      : CARD_HEIGHT;
  const cardWith = height
    ? height / 1.52
    : scale
      ? CARD_WIDTH * scale
      : CARD_WIDTH;

  const modifiedCard = useTransformedCard(card);
  const isSilent = useIsSilent(modifiedCard);
  const isDebuffed = useIsDebuffed(modifiedCard);
  const storeSkinId = useSkinPreferencesStore((store) =>
    card.card_id !== undefined ? store.getSkinFor(card.card_id) : 0
  );
  const resolvedSkinId = skin_id ?? storeSkinId;
  const skinSuffix =
    resolvedSkinId && resolvedSkinId > 0 ? `_sk${resolvedSkinId}` : "";
  const cardImgWithSkin = (() => {
    if (!skinSuffix) return modifiedCard.img;
    const dotIndex = modifiedCard.img.lastIndexOf(".");
    if (dotIndex === -1) return `${modifiedCard.img}${skinSuffix}`;
    return `${modifiedCard.img.slice(0, dotIndex)}${skinSuffix}${modifiedCard.img.slice(dotIndex)}`;
  })();

  const { t } = useTranslation(["store"]);
  const { state, isClassic } = useGameStore();

  const { rageCards } = useGameStore();

  const getModifierOffset = (index: number) => {
    if (isMobile) {
      return {
        top: [`${MODIFIERS_OFFSET_Y[0]}px`, `${MODIFIERS_OFFSET_Y[1]}px`],
        left: [
          `${MODIFIERS_OFFSET_X[0] * (index + 1)}px`,
          `${MODIFIERS_OFFSET_X[1] * (index + 1)}px`,
        ],
      };
    }
    return {
      top: `${MODIFIERS_OFFSET_Y[0]}px`,
      left: `${MODIFIERS_OFFSET_X[0] * (index + 1)}px`,
    };
  };

  const tiltCardComponent = (
    <Box
      width={`${cardWith}px`}
      height={`${cardHeight}px`}
      sx={{ cursor: cursor && !purchased ? cursor : "default" }}
    >
      <Box
        sx={{
          zIndex: 6,
          position: "relative",
          boxShadow: isPack
            ? `inset 0px 0px 17px 2px ${VIOLET}, 0px 0px 17px 2px ${VIOLET}`
            : "none",
        }}
      >
        <ConditionalTilt cardId={card.card_id ?? 0}>
          <CardTooltip card={card}>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              position="relative"
              w={`${cardWith}px`}
              h={`${cardHeight}px`}
            >
              <CachedImage
                borderRadius={{ base: "5px", sm: "8px" }}
                boxShadow={
                  isDebuffed
                    ? `0 0 10px 2px ${HEARTS}`
                    : "0px 0px 5px 0px rgba(0,0,0,0.5)"
                }
                sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
                src={`/Cards/${(modifiedCard.card_id ?? 0) < 300 && isMobile && isClassic ? "mobile/" : ""}${cardImgWithSkin}`}
                alt={cardImgWithSkin}
                w="100%"
                height="100%"
                className={className}
              />

              {(isSilent || isDebuffed) && state === GameStateEnum.Rage && (
                <BrokenCard onDeck={onDeck} isPack={isPack} />
              )}

              {used && (
                <>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    zIndex={-1}
                    backgroundColor="rgba(0,0,0,1)"
                    borderRadius={{ base: "5px", sm: "8px" }}
                    pointerEvents="none"
                  />
                </>
              )}
            </Box>
          </CardTooltip>

          {!onDeck && card.price && (
            <PriceBox
              price={card.price}
              purchased={purchased}
              discountPrice={card.discount_cost}
            />
          )}
          <PurchasedLbl
            purchased={purchased ?? false}
            topOffset={`${cardHeight / 2 - 10}px`}
            fontSize={isMobile ? 7 : 14 * scale}
          />
          {card.temporary && (
            <TemporalBadge
              remaining={card.remaining ?? 3}
              purchased={purchased}
            />
          )}
        </ConditionalTilt>
      </Box>
      {card.modifiers?.map((c, index) => {
        const { top, left } = getModifierOffset(index);
        const isSilent = isModifierSilent(c, rageCards);

        return (
          <Box
            key={c.id}
            sx={{
              zIndex: 5 - index,
              top,
              left,
              position: "absolute",
            }}
          >
            <Tilt {...TILT_OPTIONS}>
              <AnimatedCard idx={c.idx}>
                <CardTooltip card={c}>
                  <CachedImage
                    sx={{ maxWidth: "unset" }}
                    src={`/Cards/${c.img}`}
                    alt={c.img}
                    width={`${cardWith}px`}
                    height={`${cardHeight}px`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.();
                    }}
                  />
                  {isSilent && state === GameStateEnum.Rage && (
                    <BrokenCard onDeck={onDeck} isPack={isPack} />
                  )}
                </CardTooltip>
              </AnimatedCard>
            </Tilt>
          </Box>
        );
      })}
    </Box>
  );

  // when is a special card, prefix with s and use idx instead of id
  const cardId = card.isSpecial ? "s" + card.idx.toString() : card.id ?? "";

  return (
    <DraggableCard id={cardId} onCardHold={onHold}>
      {tiltCardComponent}
    </DraggableCard>
  );
};

const ConditionalTilt = ({
  children,
  cardId,
}: {
  children: ReactNode;
  cardId: number;
}) => {
  const { isSmallScreen } = useResponsiveValues();
  return isSmallScreen ? (
    <>{children}</>
  ) : (
    <Tilt
      {...TILT_OPTIONS}
      glareMaxOpacity={cardId > 52 ? 0.2 : TILT_OPTIONS.glareMaxOpacity}
    >
      {children}
    </Tilt>
  );
};
