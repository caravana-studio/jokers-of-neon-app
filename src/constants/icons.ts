import HeartIcon from "../assets/heart.png";
import SpadeIcon from "../assets/spade.png";
import DiamondIcon from "../assets/diamond.png";
import CheckIcon from "../assets/check.svg?component";
import UnCheckIcon from "../assets/unchecked.svg?component";
import ClockIcon from "../assets/clock.svg?component";
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
import LeaderboardIcon from "../assets/MenuIcons/leaderboard.png";
import SettingsIcon from "../assets/MenuIcons/settings.png";
import CartridgeIcon from "../assets/MenuIcons/cartridge.png";
import LogoutIcon from "../assets/MenuIcons/logout.png";
import DiscordIcon from "../assets/MenuIcons/discord.png";
import TutorialIcon from "../assets/MenuIcons/tutorial.png";
import GameoverIcon from "../assets/MenuIcons/gameover.png";
import MapSimpleIcon from "../assets/MenuIcons/map-simple.png";
import StoreIcon from "../assets/MenuIcons/shop.png";
import ShopIcon from "../assets/MenuIcons/shop2.png";
import SeasonIcon from "../assets/MenuIcons/season.png";
import RoundIcon from "../assets/MenuIcons/round.png";
import RageIcon from "../assets/MenuIcons/rage.png";
import HomeIcon from "../assets/MenuIcons/home.png";
import ProfileIcon from "../assets/MenuIcons/profile.png";
import BackIcon from "../assets/MenuIcons/back.png";
import DeckIcon from "../assets/MenuIcons/deck.png";
import ListIcon from "../assets/MenuIcons/list.png";
import MoreIcon from "../assets/MenuIcons/more.png";
import FreepackIcon from "../assets/free-pack.png";
import GiftIcon from "../assets/gift.png";

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
  MAP_SIMPLE: MapSimpleIcon,
  PODIUM: PodiumIcon,
  SETTINGS: SettingsIcon,
  CARTRIDGE: CartridgeIcon,
  LOGOUT: LogoutIcon,
  DISCORD: DiscordIcon,
  TUTORIAL: TutorialIcon,
  STORE: StoreIcon,
  ROUND: RoundIcon,
  RAGE: RageIcon,
  GAMEOVER: GameoverIcon,
  HOME: HomeIcon,
  PROFILE: ProfileIcon,
  BACK: BackIcon,
  DECK: DeckIcon,
  LIST: ListIcon,
  MORE: MoreIcon,
  CHECK: CheckIcon,
  UNCHECK: UnCheckIcon,
  CLOCK: ClockIcon,
  LEADERBOARD: LeaderboardIcon,
  FREEPACK: FreepackIcon,
  SHOP: ShopIcon,
  SEASON: SeasonIcon,
  GIFT: GiftIcon,
} as const;

export type IconType = keyof typeof Icons;
