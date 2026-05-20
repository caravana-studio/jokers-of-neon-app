import { Box, Image } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSeasonNumber } from "../constants/season";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import {
  addSeasonSuffixToAssetPath,
  doesAssetExist,
  resolveSeasonalAssetPath,
} from "../utils/assetAvailability";
import { getImageFromCache } from "../utils/cacheUtils";
import { isNativeAndroid } from "../utils/capacitorUtils";
import BackgroundVideo from "./BackgroundVideo";
import CachedImage, { checkImageExists } from "./CachedImage";
import { isInGamePath } from "./Menu/useContextMenuItems";

const getBackgroundColor = (type?: string) => {
  switch (type) {
    case "white":
      return "white";
    case "rage":
      return "black";
    default:
      return "transparent";
  }
};

export enum BackgroundType {
  Home = "home",
  Game = "game",
  Store = "store",
  Rage = "rage",
  RageBoss = "rageboss",
  Map = "map",
  Win = "win",
  Loose = "loose",
}

const tournamentBackgroundTypes = new Set<BackgroundType>([
  BackgroundType.Home,
  BackgroundType.Game,
  BackgroundType.Store,
  BackgroundType.Rage,
  BackgroundType.RageBoss,
  BackgroundType.Map,
]);

const tournamentBackgroundImageByType: Partial<Record<BackgroundType, string>> = {
  [BackgroundType.Game]: "/bg/game-bg_t.jpg",
  [BackgroundType.Store]: "/bg/store-bg_t.jpg",
  [BackgroundType.Rage]: "/bg/rage-bg_t.jpg",
  [BackgroundType.Map]: "/bg/map-bg_t.jpg",
  // There is no rageboss jpg, so fallback to rage tournament jpg.
  [BackgroundType.RageBoss]: "/bg/rage-bg_t.jpg",
};

const getBaseBackgroundImagePath = (
  type: BackgroundType,
  useTournamentTheme: boolean
) => {
  if (type === BackgroundType.Home) {
    return "/bg/home-bg.jpg";
  }

  if (useTournamentTheme) {
    const tournamentPath = tournamentBackgroundImageByType[type];
    if (tournamentPath) return tournamentPath;
  }

  if (type === BackgroundType.RageBoss) {
    // There is no rageboss jpg in default assets.
    return "/bg/rage-bg.jpg";
  }

  return `/bg/${type}-bg.jpg`;
};

const resolveBackgroundImagePath = async (
  type: BackgroundType,
  useTournamentTheme: boolean,
  seasonNumber: number
) => {
  const fallbackType = type === BackgroundType.RageBoss ? BackgroundType.Rage : type;
  const fallbackPath = getBaseBackgroundImagePath(fallbackType, useTournamentTheme);
  const resolvedFallbackPath = await resolveSeasonalAssetPath(
    fallbackPath,
    seasonNumber
  );

  if (type !== BackgroundType.RageBoss) {
    return resolvedFallbackPath;
  }

  const seasonalRageBossPath = addSeasonSuffixToAssetPath(
    useTournamentTheme ? "/bg/rage-boss-bg_t.jpg" : "/bg/rage-boss-bg.jpg",
    seasonNumber
  );
  const hasSeasonalRageBossPath = await doesAssetExist(seasonalRageBossPath);

  return hasSeasonalRageBossPath ? seasonalRageBossPath : resolvedFallbackPath;
};

const scrollOnMobile = true;
const dark = false;

const bgConfig: Record<
  string,
  {
    bg: BackgroundType;
    decoration?: boolean;
    overlay?: string;
    withBoss?: boolean;
  }
> = {
  season: {
    bg: BackgroundType.Game,
  },
  mods: {
    bg: BackgroundType.Home,
  },
  login: {
    bg: BackgroundType.Home,
  },
  gameover: {
    bg: BackgroundType.Home,
  },
  demo: {
    bg: BackgroundType.Game,
  },
  round: {
    bg: BackgroundType.Game,
  },
  rewards: {
    bg: BackgroundType.Game,
  },
  store: {
    bg: BackgroundType.Store,
  },
  tutorial: {
    bg: BackgroundType.Game,
  },
  practice: {
    bg: BackgroundType.Game,
  },
  preview: {
    bg: BackgroundType.Store,
  },
  "open-loot-box": {
    bg: BackgroundType.Store,
  },
  plays: {
    bg: BackgroundType.Game,
  },
  manage: {
    bg: BackgroundType.Store,
  },
  home: {
    bg: BackgroundType.Home,
  },
  "my-games": {
    bg: BackgroundType.Home,
  },
  "entering-tournament": {
    bg: BackgroundType.Home,
  },
  leaderboard: {
    bg: BackgroundType.Home,
  },
  missions: {
    bg: BackgroundType.Home,
    overlay: "rgba(0,0,0,0.5)",
    withBoss: true,
  },
  settings: {
    bg: BackgroundType.Home,
  },
  deck: {
    bg: BackgroundType.Home,
  },
  docs: {
    bg: BackgroundType.Home,
  },
  map: {
    bg: BackgroundType.Map,
  },
  profile: {
    bg: BackgroundType.Game,
  },
  shop: {
    bg: BackgroundType.Game,
  },
  "external-pack": {
    bg: BackgroundType.Store,
  },
  "purchasing-pack": {
    bg: BackgroundType.Store,
  },
  win: {
    bg: BackgroundType.Win,
  },
  loose: {
    bg: BackgroundType.Loose,
  },
  "shop-tier-unlocked": {
    bg: BackgroundType.Store,
  },
  redirect: {
    bg: BackgroundType.Game,
  },
};

interface BackgroundProps extends PropsWithChildren {
  overlay?: string;
  withBoss?: boolean;
}

export const Background = ({
  children,
  overlay,
  withBoss,
}: BackgroundProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const seasonNumber = useSeasonNumber();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("none");

  const { isRageRound, modId, isClassic, inBossRound, isTournament } =
    useGameStore();

  const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/resources";

  const location = useLocation();
  const pathname = location.pathname.split("/")?.[1];
  const page = pathname === "" ? "home" : pathname;
  const pageConfig = bgConfig[page];
  const type =
    isRageRound && pageConfig?.bg === BackgroundType.Game
      ? inBossRound
        ? BackgroundType.RageBoss
        : BackgroundType.Rage
      : pageConfig?.bg;

  const overlayColor = overlay ?? pageConfig?.overlay;
  const shouldShowBoss = withBoss ?? Boolean(pageConfig?.withBoss);

  const isInGamePage = isInGamePath(location.pathname);
  const useTournamentTheme = Boolean(
    type && isTournament && isInGamePage && tournamentBackgroundTypes.has(type)
  );

  const [src, setSrc] = useState("/bg/home-bg.jpg");
  const [videoType, setVideoType] = useState<BackgroundType>(
    BackgroundType.Home
  );

  useEffect(() => {
    const backgroundType = type ?? BackgroundType.Home;
    setVideoType(backgroundType);

    const fallbackPath = getBaseBackgroundImagePath(
      backgroundType,
      useTournamentTheme
    );
    setSrc(fallbackPath);

    let isMounted = true;

    const resolveBackground = async () => {
      const resolvedPath = await resolveBackgroundImagePath(
        backgroundType,
        useTournamentTheme,
        seasonNumber
      );

      if (!isMounted) return;
      setSrc(resolvedPath);
    };

    void resolveBackground();

    return () => {
      isMounted = false;
    };
  }, [seasonNumber, type, useTournamentTheme]);

  const modAwareSrc = !isClassic ? baseUrl + src : src;

  useEffect(() => {
    const loadBackgroundImage = async () => {
      const cachedImage = await getImageFromCache(src);

      if (!isClassic) {
        const exists = await checkImageExists(modAwareSrc);
        setBackgroundImageUrl(exists ? modAwareSrc : src);
      } else if (cachedImage) {
        setBackgroundImageUrl(URL.createObjectURL(cachedImage));
      } else {
        setBackgroundImageUrl(src);
      }
    };

    loadBackgroundImage();
  }, [isClassic, modAwareSrc, src]);

  return (
    <Box
      sx={{
        backgroundColor: getBackgroundColor(type),
        backgroundImage: isClassic
          ? `url(${src})`
          : backgroundImageUrl != "none"
            ? `url(${backgroundImageUrl})`
            : `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100svh",
        width: "100vw",
        position: isSmallScreen ? "fixed" : "relative",
        bottom: isSmallScreen ? 0 : "unset",
        boxShadow: dark ? "inset 0 0 0 1000px rgba(0,0,0,.4)" : "none",
        overflow: scrollOnMobile && isSmallScreen ? "scroll" : "unset",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isClassic && !isNativeAndroid && (
        <BackgroundVideo
          type={videoType}
          useTournamentTheme={useTournamentTheme}
        />
      )}
      {overlayColor && (
        <Box
          position="absolute"
          inset={0}
          backgroundColor={overlayColor}
          pointerEvents="none"
          zIndex={0}
        />
      )}
      {shouldShowBoss && (
        <Image
          src={`/boss/s${seasonNumber}.png`}
          alt="Season boss"
          position="absolute"
          left={{ base: "-80%", sm: "-18%", md: "1%" }}
          bottom={{ base: "-30px", md: 0 }}
          h={{ base: "100%", sm: "78%", md: "88%" }}
          maxW={{ base: "175vw", md: "58vw" }}
          objectFit="contain"
          objectPosition="left bottom"
          opacity={{ base: 0.7, md: 0.7 }}
          pointerEvents="none"
          zIndex={0}
        />
      )}
      <Box position="relative" zIndex={1} w="100%" h="100%">
        {children}
      </Box>
    </Box>
  );
};

interface BackgroundDecorationProps {
  hidelogo?: boolean;
  contentHeight?: any;
}

export const BackgroundDecoration = ({
  children,
  hidelogo = false,
  contentHeight = { base: "80%", sm: "60%" },
}: PropsWithChildren<BackgroundDecorationProps>) => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {!isSmallScreen && (
        <CachedImage
          src="/borders/top.png"
          height="8%"
          width="100%"
          maxHeight="70px"
          position="fixed"
          top={0}
          zIndex={10}
        />
      )}
      {!hidelogo && (
        <Box
          height="15%"
          width="100%"
          display="flex"
          justifyContent={isSmallScreen ? "center" : "space-between"}
          alignItems="center"
          padding={isSmallScreen ? "0 50px" : "25px 50px 0px 50px"}
        >
          <CachedImage
            alignSelf="center"
            justifySelf="end"
            src="/logos/logo-variant.svg"
            alt="logo-variant"
            width={"65%"}
            maxW={"300px"}
            ml={4}
            zIndex={10}
          />
        </Box>
      )}
      <Box
        sx={{
          height: contentHeight,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
      {!isSmallScreen && (
        <>
          <CachedImage
            src="/borders/bottom.png"
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            bottom={0}
            zIndex={10}
          />

          <Box
            zIndex={10}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 12,
            }}
          >
            <CachedImage
              alignSelf="center"
              justifySelf="end"
              src="/logos/joker-logo.png"
              alt="/logos/joker-logo.png"
              maxW={"150px"}
              zIndex={10}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
