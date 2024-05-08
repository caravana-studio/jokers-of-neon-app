import { Image, SystemStyleObject } from "@chakra-ui/react";
import { Tilt } from "react-tilt";
import { HandCard } from "../types/Card";

interface ICardProps {
  sx?: SystemStyleObject;
  card: HandCard;
  onClick?: () => void;
}

const TILT_OPTIONS = {
  reverse: true, // reverse the tilt direction
  max: 20, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1.05, // 2 = 200%, 1.5 = 150%, etc..
  speed: 1000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

export const TiltCard = ({ sx, card, onClick }: ICardProps) => {
  const { img } = card;
  return (
    <Tilt options={TILT_OPTIONS}>
      <Image
        sx={sx}
        src={`Cards/${img}`}
        alt={img}
        width="100%"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      />
    </Tilt>
  );
};
