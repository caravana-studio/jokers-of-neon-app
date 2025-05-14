import HeartIcon from "../assets/heart.png";
import SpadeIcon from "../assets/spade.png";
import DiamondIcon from "../assets/diamond.png";
import ClubIcon from "../assets/club.png";
import ModifierIcon from "../assets/modifier.svg?component";
import NeonIcon from "../assets/neon.svg?component";
import JokerIcon from "../assets/joker.png";
import AsIcon from "../assets/as.png";
import FigureIcon from "../assets/figure.png";
import BarsIcon from "../assets/MenuIcons/bars.png";
import CircleIcon from "../assets/MenuIcons/circle.png";
import DocsIcon from "../assets/MenuIcons/docs.png";
import MapIcon from "../assets/MenuIcons/map.png";
import PodiumIcon from "../assets/MenuIcons/podium.png";
import SettingsIcon from "../assets/MenuIcons/settings.png";
import CartridgeIcon from "../assets/MenuIcons/cartridge.png";
import LogoutIcon from "../assets/MenuIcons/logout.png";
import DiscordIcon from "../assets/MenuIcons/discord.png";
import TutorialIcon from "../assets/MenuIcons/tutorial.png";
import BoxIcon from "../assets/MenuIcons/box.png";
import GameoverIcon from "../assets/MenuIcons/gameover.png";

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
  BARS: BarsIcon,
  CIRCLE: CircleIcon,
  DOCS: DocsIcon,
  MAP: MapIcon,
  PODIUM: PodiumIcon,
  SETTINGS: SettingsIcon,
  CARTRIDGE: CartridgeIcon,
  LOGOUT: LogoutIcon,
  DISCORD: DiscordIcon,
  TUTORIAL: TutorialIcon,
  STORE_DECK: "/map/icons/rewards/1.png",
  STORE_GLOBAL: "/map/icons/rewards/2.png",
  STORE_SPECIALS: "/map/icons/rewards/3.png",
  STORE_LEVELUPS: "/map/icons/rewards/4.png",
  STORE_MODIFIERS: "/map/icons/rewards/5.png",
  STORE_MIX: "/map/icons/rewards/6.png",
  ROUND: "/map/icons/round/round.png",
  RAGE_INTERMEDIATE: "/map/icons/rage/intermediate-off.png",
  RAGE_FINAL: "/map/icons/rage/final-off.png",
  LOOTBOX: BoxIcon,
  GAMEOVER: GameoverIcon,
} as const;

export type IconType = keyof typeof Icons;
