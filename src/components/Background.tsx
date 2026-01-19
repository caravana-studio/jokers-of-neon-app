import { Box } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { getImageFromCache } from "../utils/cacheUtils";
import { isNativeAndroid } from "../utils/capacitorUtils";
import BackgroundVideo from "./BackgroundVideo";
import CachedImage, { checkImageExists } from "./CachedImage";

const getBackgroundColor = (type: string) => {
  switch (type) {
    case "white":
      return "white";
    case "rage":
      return "black";
    default:
      return "transparent";
  }
};

const getBackgroundImage = (type: string) => {
  switch (type) {
    case "white":
      return "none";
    default:
      return `url(/bg/${type}-bg.jpg)`;
  }
};

const scrollOnMobile = true;
const dark = false;

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

const bgConfig: Record<string, { bg: BackgroundType; decoration?: boolean }> = {
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
  rewards: {
    bg: BackgroundType.Game,
  },
  store: {
    bg: BackgroundType.Store,
  },
  tutorial: {
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
};

export const Background = ({ children }: PropsWithChildren) => {
  const { isSmallScreen } = useResponsiveValues();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("none");

  const { isRageRound, modId, isClassic, inBossRound } = useGameStore();

  const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/resources";

  const location = useLocation();
  const pathname = location.pathname.split("/")?.[1];
  const page = pathname === "" ? "home" : pathname;
  const type =
    isRageRound && bgConfig[page]?.bg === BackgroundType.Game
      ? inBossRound
        ? BackgroundType.RageBoss
        : BackgroundType.Rage
      : bgConfig[page]?.bg;

  const [src, setSrc] = useState("");
  const [videoType, setVideoType] = useState<BackgroundType>(
    BackgroundType.Home
  );

  useEffect(() => {
    if (type) {
      setSrc(`/bg/${type}-bg.jpg`);
      setVideoType(type);
    }
  }, [type, isRageRound, inBossRound]);

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
  }, [type, isClassic]);

  return (
    <Box
      sx={{
        backgroundColor: getBackgroundColor(type),
        backgroundImage: isClassic
          ? getBackgroundImage(type)
          : backgroundImageUrl != "none"
            ? backgroundImageUrl
            : getBackgroundImage(type),
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100svh",
        width: "100vw",
        position: isSmallScreen ? "fixed" : "unset",
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
      {isClassic && !isNativeAndroid && <BackgroundVideo type={videoType} />}

      {children}
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
