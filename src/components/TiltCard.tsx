import { TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Image,
  SystemStyleObject,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Tilt } from "react-tilt";
import {
  CARD_HEIGHT,
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
  MODIFIERS_OFFSET,
  TILT_OPTIONS,
} from "../constants/visualProps";
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
}

export const TiltCard = ({ card, onClick, cursor }: ICardProps) => {
  const { img, purchased = false } = card;
  const tiltCardComponent = (
    <Box
      width={CARD_WIDTH_PX}
      sx={{ cursor: cursor && !purchased ? cursor : "default" }}
    >
      <Box
        sx={{
          zIndex: 6,
          position: "relative",
        }}
      >
        <Tilt options={TILT_OPTIONS}>
          <Tooltip hasArrow label={getTooltip(card)} closeOnPointerDown>
            <Image
              sx={{ maxWidth: "unset", opacity: purchased ? 0.3 : 1 }}
              src={`Cards/${img}`}
              alt={img}
              width={CARD_WIDTH_PX}
              height={CARD_HEIGHT_PX}
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
                fontSize: 20,
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
                top: `${CARD_HEIGHT / 2 - 20}px`,
                left: 0,
                zIndex: 10,
              }}
            >
              <Heading variant="neonWhite" size="m">
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
                  top: 2,
                  left: 2,
                  zIndex: 10,
                  opacity: purchased ? 0.5 : 1,
                  padding: 0.5,
                  backgroundColor: "rgba(255, 253, 208)",
                  borderRadius: "25%",
                  border: "4px solid black",
                  display: "flex",
                  alignItems: "center",
                  direction: "row",
                  gap: 1.5,
                }}
              >
                <TimeIcon boxSize={4} color={"black"} />
                {card.remaining && (
                  <Text color="black" fontSize="medium">
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
              marginTop: `-${CARD_HEIGHT + MODIFIERS_OFFSET}px`,
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
                    width={CARD_WIDTH_PX}
                    height={CARD_HEIGHT_PX}
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

  return card.isModifier ? (
    <DraggableCard id={card.id ?? ""}>{tiltCardComponent}</DraggableCard>
  ) : (
    tiltCardComponent
  );
};
