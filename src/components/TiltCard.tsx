import {
  Box,
  Heading,
  Image,
  SystemStyleObject,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { Tilt } from "react-tilt";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  MODIFIERS_OFFSET,
  TILT_OPTIONS,
} from "../constants/visualProps";

import ClockIcon from "../assets/clock.svg?component";
import { useIsSilent } from "../hooks/useIsSilent.tsx";
import { VIOLET } from "../theme/colors.tsx";
import { Card } from "../types/Card";
import { getTemporalCardText } from "../utils/getTemporalCardText.ts";
import { getTooltip } from "../utils/getTooltip.tsx";
import { AnimatedCard } from "./AnimatedCard";
import { DraggableCard } from "./DraggableCard";
import { HoloEffect } from "./HoloEffect.tsx";
import { CashSymbol } from "./CashSymbol.tsx";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  onClick?: () => void;
  cursor?: string;
  scale?: number;
  isPack?: boolean;
  isHolographic?: boolean;
}

export const TiltCard = ({
  card,
  onClick,
  cursor,
  scale = 1,
  isPack = false,
  isHolographic = false,
}: ICardProps) => {
  const { img, purchased = false } = card;
  const cardWith = scale ? CARD_WIDTH * scale : CARD_WIDTH;
  const cardHeight = scale ? CARD_HEIGHT * scale : CARD_HEIGHT;
  const hoverStyle = {
    boxShadow: "0px 0px 20px 2px white",
    transition: "box-shadow 0.3s ease-in-out",
  };

  const isSilent = useIsSilent(card);

  const tiltCardComponent = (
    <Box
      width={cardWith}
      sx={{ cursor: cursor && !purchased ? cursor : "default" }}
    >
      <Box
        sx={{
          zIndex: 6,
          position: "relative",
          boxShadow: isPack
            ? `inset 0px 0px 17px 2px ${VIOLET}, 0px 0px 17px 2px ${VIOLET}`
            : "none",
          _hover: !isPack ? hoverStyle : "none",
        }}
      >
        <Tilt options={TILT_OPTIONS}>
          {isHolographic && (
            <Tooltip
              hasArrow
              label={getTooltip(card, isPack)}
              closeOnPointerDown
            >
              <Box
                boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
                sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                <HoloEffect
                  url={`Cards/${img}`}
                  width={`${cardWith}px`}
                  height={`${cardHeight}px`}
                  borderRadius={isPack ? {} : { base: "5px", sm: "8px" }}
                />
              </Box>
            </Tooltip>
          )}

          {!isHolographic && (
            <Tooltip
              hasArrow
              label={getTooltip(card, isPack)}
              closeOnPointerDown
            >
              <Box
                position="relative"
                w={`${cardWith}px`}
                h={`${cardHeight}px`}
              >
                <Image
                  borderRadius={{ base: "5px", sm: "8px" }}
                  boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
                  sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
                  src={`Cards/${img}`}
                  alt={img}
                  w="100%"
                  height="100%"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                  }}
                />

                {isSilent && (
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
              </Box>
            </Tooltip>
          )}

          {card.price && (
            <Box
              sx={{
                position: "absolute",
                bottom: "-8%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                backgroundColor: "black",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 2px white",
                color: "white",
                fontSize: isMobile ? 15 * scale : 18 * scale,
                px: 2,
                pt: "1px",
                opacity: purchased ? 0.5 : 1,
              }}
            >
              {card.price}
              <CashSymbol />
            </Box>
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
                PURCHASED
              </Heading>
            </Box>
          )}
          {card.temporary && (
            <Tooltip
              hasArrow
              label={getTemporalCardText(card.remaining)}
              closeOnPointerDown
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 10,
                  opacity: purchased ? 0.5 : 1,
                  padding: "2px 6px",
                  background:
                    "linear-gradient(90deg, rgba(97,97,97,1) 0%, rgba(61,61,61,1) 49%, rgba(35,35,35,1) 100%)",
                  borderRadius: "20%",
                  display: "flex",
                  alignItems: "center",
                  direction: "row",
                  gap: 1.5,
                }}
              >
                <ClockIcon color="white" width={14} height={14} />
                {
                  <Text color="white" fontSize="xs">
                    {card.remaining ? card.remaining : 3}
                  </Text>
                }
              </Box>
            </Tooltip>
          )}
        </Tilt>
      </Box>
      {card.modifiers?.map((c, index) => {
        return (
          <Box
            key={c.id}
            sx={{
              zIndex: 5 - index,
              marginTop: `-${cardHeight + MODIFIERS_OFFSET}px`,
              marginLeft: `-${(MODIFIERS_OFFSET / 2) * (index + 1)}px`,
              position: "relative",
            }}
          >
            <Tilt options={TILT_OPTIONS}>
              <AnimatedCard idx={c.idx}>
                <Tooltip
                  hasArrow
                  label={getTooltip(c)}
                  placement="top"
                  closeOnPointerDown
                >
                  <Image
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

  return card.isModifier || card.isSpecial ? (
    <DraggableCard id={cardId}>{tiltCardComponent}</DraggableCard>
  ) : (
    tiltCardComponent
  );
};
