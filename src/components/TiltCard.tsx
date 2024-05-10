import { Box, Image, SystemStyleObject } from "@chakra-ui/react";
import { Tilt } from "react-tilt";
import {
  CARD_HEIGHT,
  CARD_WIDTH_PX,
  MODIFIERS_OFFSET,
  TILT_OPTIONS,
} from "../constants/visualProps";
import { Card } from "../types/Card";
import { DraggableCard } from "./DraggableCard";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  onClick?: () => void;
}

export const TiltCard = ({ sx, card, onClick }: ICardProps) => {
  const { img } = card;

  const tiltCardComponent = (
    <Box>
      <Box
        sx={{
          zIndex: 6,
          position: "relative",
        }}
      >
        <Tilt options={TILT_OPTIONS}>
          <Image
            sx={{ maxWidth: "unset" }}
            src={`Cards/${img}`}
            alt={img}
            width={CARD_WIDTH_PX}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          />
        </Tilt>
      </Box>
      {card.modifiers?.map((c, index) => (
        <Box
          sx={{
            zIndex: 5 - index,
            marginTop: `-${CARD_HEIGHT + MODIFIERS_OFFSET}px`,
            marginLeft: `-${MODIFIERS_OFFSET * (index + 1)}px`,
            position: "relative",
          }}
        >
          <Tilt options={TILT_OPTIONS}>
            <Image
              sx={{ maxWidth: "unset" }}
              src={`Cards/${c.img}`}
              alt={c.img}
              width={CARD_WIDTH_PX}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            />
          </Tilt>
        </Box>
      ))}
    </Box>
  );

  return card.isModifier ? (
    <DraggableCard id={card.id ?? ""}>{tiltCardComponent}</DraggableCard>
  ) : (
    tiltCardComponent
  );
};
