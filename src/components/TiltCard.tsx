import { TimeIcon } from "@chakra-ui/icons";
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
import { PASTEL_PINK, VIOLET } from "../theme/colors.tsx";
import { Card } from "../types/Card";
import { getTemporalCardText } from "../utils/getTemporalCardText.ts";
import { getTooltip } from "../utils/getTooltip.tsx";
import { AnimatedCard } from "./AnimatedCard";
import { DraggableCard } from "./DraggableCard";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  onClick?: () => void;
  cursor?: string;
  scale?: number;
  isPack?: boolean;
}

export const TiltCard = ({
  card,
  onClick,
  cursor,
  scale = 1,
  isPack = false,
}: ICardProps) => {
  const { img, purchased = false } = card;
  const cardWith = scale ? CARD_WIDTH * scale : CARD_WIDTH;
  const cardHeight = scale ? CARD_HEIGHT * scale : CARD_HEIGHT;
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
        }}
      >
        <Tilt options={TILT_OPTIONS}>
          <Tooltip hasArrow label={getTooltip(card)} closeOnPointerDown>
            <Image
              borderRadius={isPack ? {} : { base: "5px", sm: "8px" }}
              boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.5)"}
              sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
              src={`Cards/${img}`}
              alt={img}
              w={`${cardWith}px`}
              height={`${cardHeight}px`}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            />
          </Tooltip>

          {card.price && (
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                fontSize: isMobile ? 15 * scale : 20 * scale,
                px: 2,
                py: 1,
                opacity: purchased ? 0.5 : 1,
              }}
            >
              {card.price}ȼ
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
                  bottom: 2,
                  left: 2,
                  zIndex: 10,
                  opacity: purchased ? 0.5 : 1,
                  padding: 0.5,
                  backgroundColor: "pastelPink",
                  boxShadow: `0px 0px 5px 0px ${PASTEL_PINK}`,
                  borderRadius: "25%",
                  display: "flex",
                  alignItems: "center",
                  direction: "row",
                  gap: 1.5,
                }}
              >
                <TimeIcon boxSize={4} color={"black"} />
                {card.remaining && (
                  <Text color="black" size="l">
                    {card.remaining}
                  </Text>
                )}
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
