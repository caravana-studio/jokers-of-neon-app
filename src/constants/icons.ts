import HeartIcon from "../assets/heart.svg?component";
import SpadeIcon from "../assets/spade.svg?component";
import DiamondIcon from "../assets/diamond.svg?component";
import ClubIcon from "../assets/club.svg?component";
import ModifierIcon from "../assets/modifier.svg?component";
import NeonIcon from "../assets/neon.svg?component";
import JokerIcon from "../assets/joker.svg?component";
import AceIcon from "../assets/ace.svg?component";
import FigureIcon from "../assets/figure.svg?component";

export const Icons = {
  HEART: HeartIcon,
  SPADE: SpadeIcon,
  DIAMOND: DiamondIcon,
  CLUB: ClubIcon,
  MODIFIER: ModifierIcon,
  NEON: NeonIcon,
  JOKER: JokerIcon,
  ACE: AceIcon,
  FIGURE: FigureIcon,
} as const;

export type IconType = keyof typeof Icons;
