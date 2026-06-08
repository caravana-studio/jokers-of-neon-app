import { useEffect, useRef, useState } from "react";
import { useSeasonNumber } from "../constants/season";
import { getVideoFromCache } from "../utils/cacheUtils";
import {
  BackgroundVideoType,
  getVideoSourceCandidates,
} from "./backgroundVideoSources";

interface BackgroundVideoProps {
  type: BackgroundVideoType;
  useTournamentTheme: boolean;
}

interface LoadedVideoSource {
  src: string;
}

const waitForVideoToBecomePlayable = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    let settled = false;

    const cleanup = () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("canplay", handleLoaded);
      video.removeEventListener("error", handleError);
      video.removeAttribute("src");
      video.load();
    };

    const settle = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };

    const handleLoaded = () => {
      settle(resolve);
    };

    const handleError = () => {
      settle(() => reject(new Error(`Failed to load video: ${src}`)));
    };

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("loadeddata", handleLoaded, { once: true });
    video.addEventListener("canplay", handleLoaded, { once: true });
    video.addEventListener("error", handleError, { once: true });
    video.src = src;
    video.load();
  });

const resolveVideoSource = async (
  candidateSources: string[],
): Promise<LoadedVideoSource> => {
  for (const candidateSource of candidateSources) {
    const cachedVideo = await getVideoFromCache(candidateSource);

    if (cachedVideo) {
      return {
        src: cachedVideo,
      };
    }

    try {
      await waitForVideoToBecomePlayable(candidateSource);
      return {
        src: candidateSource,
      };
    } catch {
      // Try the next candidate until one is playable.
    }
  }

  throw new Error("Failed to resolve a playable background video source");
};

const BackgroundVideo = ({ type, useTournamentTheme }: BackgroundVideoProps) => {
  const seasonNumber = useSeasonNumber();
  const [videoSrc1, setVideoSrc1] = useState<LoadedVideoSource | null>(null);
  const [videoSrc2, setVideoSrc2] = useState<LoadedVideoSource | null>(null);
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
      let nextVideoSource: LoadedVideoSource;

      try {
        nextVideoSource = await resolveVideoSource(
          getVideoSourceCandidates(type, useTournamentTheme, seasonNumber),
        );
      } catch (error) {
        console.error("Failed to load background video", error);
        return;
      }

      if (!isMounted) return;
      const hasLoadedVideo = hasLoadedVideoRef.current;

      if (!hasLoadedVideo) {
        setVideoSrc1(nextVideoSource);
        setVideoSrc2(null);
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
            setVideoSrc2(nextVideoSource);
            return 2;
          }

          setVideoSrc1(nextVideoSource);
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
          ref={videoRef1}
          src={videoSrc1.src}
          autoPlay
          loop
          muted
          playsInline
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
            opacity: activeVideo === 1 ? 1 : isFading ? 0 : 0, // Fade out if inactive
          }}
        />
      )}
      {videoSrc2 && (
        <video
          ref={videoRef2}
          src={videoSrc2.src}
          autoPlay
          loop
          muted
          playsInline
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
            opacity: activeVideo === 2 ? 1 : isFading ? 0 : 0, // Fade out if inactive
          }}
        />
      )}
    </div>
  );
};

export default BackgroundVideo;
