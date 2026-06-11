import { useEffect, useRef, useState } from "react";
import { useSeasonNumber } from "../constants/season";
import {
  addSeasonSuffixToAssetPath,
  doesAssetExist,
  resolveSeasonalAssetPath,
} from "../utils/assetAvailability";
import { getVideoFromCache } from "../utils/cacheUtils";
import { BackgroundType as BackgroundTypeEnum } from "./Background";

type BackgroundType =
  | BackgroundTypeEnum.Home
  | BackgroundTypeEnum.Store
  | BackgroundTypeEnum.Game
  | BackgroundTypeEnum.Rage
  | BackgroundTypeEnum.RageBoss
  | BackgroundTypeEnum.Map
  | BackgroundTypeEnum.Win
  | BackgroundTypeEnum.Loose;

interface BackgroundVideoProps {
  type: BackgroundType;
  useTournamentTheme: boolean;
}

const tournamentVideoSources: Partial<Record<BackgroundType, string>> = {
  home: "/bg/home-bg_t.mp4",
  store: "/bg/store-bg_t.mp4",
  game: "/bg/game-bg_t.mp4",
  rage: "/bg/rage-bg_t.mp4",
  map: "/bg/map-bg_t.mp4",
  rageboss: "/bg/rage-bg_t.mp4",
};

const defaultVideoSources: Record<BackgroundType, string> = {
  home: "/bg/home-bg.mp4",
  store: "/bg/store-bg.mp4",
  game: "/bg/game-bg.mp4",
  rage: "/bg/rage-bg.mp4",
  // There is no default rage boss video. It falls back to rage unless a seasonal boss asset exists.
  rageboss: "/bg/rage-bg.mp4",
  map: "/bg/map-bg.mp4",
  win: "/bg/summary-bg.mp4",
  loose: "/bg/summary-bg.mp4",
};

const getBaseVideoSource = (
  type: BackgroundType,
  useTournamentTheme: boolean
): string => {
  if (useTournamentTheme) {
    const tournamentVideo = tournamentVideoSources[type];
    if (tournamentVideo) return tournamentVideo;
  }

  return defaultVideoSources[type];
};

const resolveVideoSource = async (
  type: BackgroundType,
  useTournamentTheme: boolean,
  seasonNumber: number
): Promise<string> => {
  const fallbackType =
    type === BackgroundTypeEnum.RageBoss ? BackgroundTypeEnum.Rage : type;
  const fallbackSource = getBaseVideoSource(fallbackType, useTournamentTheme);
  const resolvedFallbackSource = await resolveSeasonalAssetPath(
    fallbackSource,
    seasonNumber
  );

  if (type !== BackgroundTypeEnum.RageBoss) {
    return resolvedFallbackSource;
  }

  const rageBossSeasonalPath = addSeasonSuffixToAssetPath(
    useTournamentTheme ? "/bg/rage-boss-bg_t.mp4" : "/bg/rage-boss-bg.mp4",
    seasonNumber
  );

  const hasSeasonalRageBossVideo = await doesAssetExist(rageBossSeasonalPath);
  return hasSeasonalRageBossVideo ? rageBossSeasonalPath : resolvedFallbackSource;
};

const BackgroundVideo = ({ type, useTournamentTheme }: BackgroundVideoProps) => {
  const seasonNumber = useSeasonNumber();
  const [videoSrc1, setVideoSrc1] = useState<string | null>(null);
  const [videoSrc2, setVideoSrc2] = useState<string | null>(null);
  const [isVideo1Ready, setIsVideo1Ready] = useState(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1); // Track which video is active

  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const hasLoadedVideoRef = useRef(false);

  const isLooseVideo = type === "loose";

  useEffect(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    let isMounted = true;

    const loadVideo = async () => {
      const videoSource = await resolveVideoSource(
        type,
        useTournamentTheme,
        seasonNumber
      );
      const cachedVideo = await getVideoFromCache(videoSource);
      const newVideoSrc = cachedVideo || videoSource;

      if (!isMounted) return;
      const hasLoadedVideo = hasLoadedVideoRef.current;

      if (!hasLoadedVideo) {
        setVideoSrc1(newVideoSrc);
        setVideoSrc2(null);
        setIsVideo1Ready(false);
        setIsVideo2Ready(false);
        setActiveVideo(1);
        setIsFading(false);
        hasLoadedVideoRef.current = true;
        return;
      }

      setIsFading(true); // Start fade transition

      transitionTimeoutRef.current = window.setTimeout(() => {
        if (!isMounted) return;

        setActiveVideo((currentActiveVideo) => {
          if (currentActiveVideo === 1) {
            setVideoSrc2(newVideoSrc);
            setIsVideo2Ready(false);
            return 2;
          }

          setVideoSrc1(newVideoSrc);
          setIsVideo1Ready(false);
          return 1;
        });
        hasLoadedVideoRef.current = true;

        fadeTimeoutRef.current = window.setTimeout(() => {
          if (!isMounted) return;
          setIsFading(false);
        }, 800);
      }, 100); // Delay before starting transition
    };

    void loadVideo();

    return () => {
      isMounted = false;

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };
  }, [seasonNumber, type, useTournamentTheme]);

  const markVideoReady = (slot: 1 | 2) => {
    if (slot === 1) {
      setIsVideo1Ready(true);
      void videoRef1.current?.play().catch(() => undefined);
      return;
    }

    setIsVideo2Ready(true);
    void videoRef2.current?.play().catch(() => undefined);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        objectFit: "cover",
        pointerEvents: "none",
      }}
    >
      {videoSrc1 && (
        <video
          className="background-video"
          ref={videoRef1}
          src={videoSrc1}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => markVideoReady(1)}
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
            filter: isLooseVideo ? "grayscale(1)" : "none",
            visibility: isVideo1Ready ? "visible" : "hidden",
            opacity: activeVideo === 1 && isVideo1Ready ? 1 : isFading ? 0 : 0,
          }}
        />
      )}
      {videoSrc2 && (
        <video
          className="background-video"
          ref={videoRef2}
          src={videoSrc2}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => markVideoReady(2)}
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
            filter: isLooseVideo ? "grayscale(1)" : "none",
            visibility: isVideo2Ready ? "visible" : "hidden",
            opacity: activeVideo === 2 && isVideo2Ready ? 1 : isFading ? 0 : 0,
          }}
        />
      )}
    </div>
  );
};

export default BackgroundVideo;
