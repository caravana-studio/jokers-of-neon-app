import { Box, Image, SystemStyleObject } from "@chakra-ui/react";
import { Tilt } from "react-tilt";
import {
  CARD_HEIGHT,
  CARD_WIDTH_PX,
  MODIFIERS_OFFSET,
} from "../constants/visualProps";
import { Card } from "../types/Card";
import { DraggableCard } from "./DraggableCard";

interface ICardProps {
  sx?: SystemStyleObject;
  card: Card;
  onClick?: () => void;
}

const TILT_OPTIONS = {
  reverse: true, // reverse the tilt direction
  max: 30, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1.05, // 2 = 200%, 1.5 = 150%, etc..
  speed: 800, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

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
