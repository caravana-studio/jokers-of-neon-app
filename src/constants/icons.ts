import HeartIcon from "../assets/heart.png";
import SpadeIcon from "../assets/spade.png";
import DiamondIcon from "../assets/diamond.png";
import ClubIcon from "../assets/club.png";
import ModifierIcon from "../assets/modifier.svg?component";
import NeonIcon from "../assets/neon.svg?component";
import JokerIcon from "../assets/joker.png";
import AsIcon from "../assets/as.png";
import FigureIcon from "../assets/figure.png";

export const Icons = {
  HEART: HeartIcon,
  SPADE: SpadeIcon,
  DIAMOND: DiamondIcon,
  CLUB: ClubIcon,
  MODIFIER: ModifierIcon,
  NEON: NeonIcon,
  JOKER: JokerIcon,
  AS: AsIcon,
  FIGURE: FigureIcon,
} as const;

export type IconType = keyof typeof Icons;
