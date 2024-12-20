import { Box, Heading, SystemStyleObject, Tooltip } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import Tilt from "react-parallax-tilt";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  MODIFIERS_OFFSET,
  TILT_OPTIONS,
} from "../constants/visualProps";

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useIsSilent } from "../hooks/useIsSilent.tsx";
import { VIOLET } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData.ts";
import { getTooltip } from "../utils/getTooltip.tsx";
import { transformCardByModifierId } from "../utils/modifierTransformation.ts";
import { AnimatedCard } from "./AnimatedCard";
import CachedImage from "./CachedImage.tsx";
import { DraggableCard } from "./DraggableCard";
import { PriceBox } from "./PriceBox.tsx";
import { TemporalBadge } from "./TemporalBadge.tsx";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  onClick?: () => void;
  cursor?: string;
  isPack?: boolean;
  scale?: number;
  className?: string;
  used?: boolean;
  onDeck?: boolean;
}

export const TiltCard = ({
  card,
  onClick,
  cursor,
  isPack = false,
  scale = 1,
  className,
  used = false,
  onDeck = false,
}: ICardProps) => {
  const { img, purchased = false } = card;
  const cardWith = scale ? CARD_WIDTH * scale : CARD_WIDTH;
  const cardHeight = scale ? CARD_HEIGHT * scale : CARD_HEIGHT;

  const isSilent = useIsSilent(card);
  const { t } = useTranslation(["store"]);

  let modifiedCard = card;

  if ((card.modifiers?.length ?? 0) > 0) {
    let modifierCard = card.modifiers![0];

    const transformedCard = transformCardByModifierId(
      modifierCard?.card_id!,
      card?.card_id!
    );

    if (transformedCard != -1) {
      modifiedCard = {
        ...card,
        card_id: transformedCard,
        img: `${transformedCard}.png`,
        suit: getCardData(card).suit,
      };
    }
  }

  const tiltCardComponent = (
    <Box
      width={`${cardWith}px`}
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
          <Tooltip
            hasArrow
            label={getTooltip(modifiedCard, isPack)}
            closeOnPointerDown
          >
            <Box position="relative" w={`${cardWith}px`} h={`${cardHeight}px`}>
              <CachedImage
                borderRadius={{ base: "5px", sm: "8px" }}
                boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
                sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
                src={`Cards/${(modifiedCard.card_id ?? 0) < 300 && isMobile ? "mobile/" : ""}${modifiedCard.img}`}
                alt={modifiedCard.img}
                w="100%"
                height="100%"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className={className}
              />

              {isSilent && !onDeck && (
                <>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    backgroundColor="rgba(0,0,0,0.3)"
                    backgroundImage={'url("/broken.png")'}
                    backgroundSize="cover"
                    borderRadius={isPack ? {} : { base: "5px", sm: "8px" }}
                    pointerEvents="none"
                  />
                </>
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
          </Tooltip>

          {card.price && (
            <PriceBox
              price={card.price}
              purchased={purchased}
              discountPrice={card.discount_cost}
            />
          )}
          {card.purchased && (
            <Box
              sx={{
                position: "absolute",
                top: `${cardHeight / 2 - 10}px`,
                left: 0,
                zIndex: 10,
              }}
            >
              <Heading variant="italic" fontSize={isMobile ? 7 : 14 * scale}>
                {t("store.labels.purchased").toUpperCase()}
              </Heading>
            </Box>
          )}
          {card.temporary && (
            <TemporalBadge
              remaining={card.remaining ?? 3}
              purchased={purchased}
            />
          )}
        </ConditionalTilt>
      </Box>
      {card.modifiers?.map((c, index) => {
        return (
          <Box
            key={c.id}
            sx={{
              zIndex: 5 - index,
              top: `-${MODIFIERS_OFFSET}px`,
              left: `-${(MODIFIERS_OFFSET / 2) * (index + 1)}px`,
              position: "absolute",
            }}
          >
            <Tilt {...TILT_OPTIONS}>
              <AnimatedCard idx={c.idx}>
                <Tooltip
                  hasArrow
                  label={getTooltip(c)}
                  placement="top"
                  closeOnPointerDown
                >
                  <CachedImage
                    sx={{ maxWidth: "unset" }}
                    src={`Cards/${c.img}`}
                    alt={c.img}
                    width={`${cardWith}px`}
                    height={`${cardHeight}px`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.();
                    }}
                  />
                </Tooltip>
              </AnimatedCard>
            </Tilt>
          </Box>
        );
      })}
    </Box>
  );

  // when is a special card, prefix with s and use idx instead of id
  const cardId = card.isSpecial ? "s" + card.idx.toString() : card.id ?? "";

  return <DraggableCard id={cardId}>{tiltCardComponent}</DraggableCard>;
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
