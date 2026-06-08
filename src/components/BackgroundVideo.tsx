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
  sourceKey: string;
}

const resolveVideoSource = async (
  candidateSource: string
): Promise<LoadedVideoSource> => {
  const cachedVideo = await getVideoFromCache(candidateSource);
  return {
    src: cachedVideo || candidateSource,
    sourceKey: candidateSource,
  };
};

const BackgroundVideo = ({ type, useTournamentTheme }: BackgroundVideoProps) => {
  const seasonNumber = useSeasonNumber();
  const [sourceCandidates, setSourceCandidates] = useState<string[]>([]);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState(0);
  const [videoSrc1, setVideoSrc1] = useState<LoadedVideoSource | null>(null);
  const [videoSrc2, setVideoSrc2] = useState<LoadedVideoSource | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const hasLoadedVideoRef = useRef(false);

  const isLooseVideo = type === "loose";

  useEffect(() => {
    setSourceCandidates(
      getVideoSourceCandidates(type, useTournamentTheme, seasonNumber)
    );
    setActiveCandidateIndex(0);
    hasLoadedVideoRef.current = false;
    setVideoSrc1(null);
    setVideoSrc2(null);
    setActiveVideo(1);
    setIsFading(false);
  }, [seasonNumber, type, useTournamentTheme]);

  useEffect(() => {
    const candidateSource = sourceCandidates[activeCandidateIndex];
    if (!candidateSource) {
      return;
    }

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
      const newVideoSource = await resolveVideoSource(candidateSource);

      if (!isMounted) return;
      const hasLoadedVideo = hasLoadedVideoRef.current;

      if (!hasLoadedVideo) {
        setVideoSrc1(newVideoSource);
        setVideoSrc2(null);
        setActiveVideo(1);
        setIsFading(false);
        hasLoadedVideoRef.current = true;
        return;
      }

      setIsFading(true);

      transitionTimeoutRef.current = window.setTimeout(() => {
        if (!isMounted) return;

        setActiveVideo((currentActiveVideo) => {
          if (currentActiveVideo === 1) {
            setVideoSrc2(newVideoSource);
            return 2;
          }

          setVideoSrc1(newVideoSource);
          return 1;
        });
        hasLoadedVideoRef.current = true;

        fadeTimeoutRef.current = window.setTimeout(() => {
          if (!isMounted) return;
          setIsFading(false);
        }, 800);
      }, 100);
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
  }, [activeCandidateIndex, sourceCandidates]);

  const handleVideoError = (failedSourceKey: string) => {
    if (failedSourceKey !== sourceCandidates[activeCandidateIndex]) {
      return;
    }

    setActiveCandidateIndex((currentIndex) => {
      if (currentIndex >= sourceCandidates.length - 1) {
        return currentIndex;
      }

      return currentIndex + 1;
    });
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
          ref={videoRef1}
          src={videoSrc1.src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => handleVideoError(videoSrc1.sourceKey)}
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
            opacity: activeVideo === 1 ? 1 : isFading ? 0 : 0,
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
          onError={() => handleVideoError(videoSrc2.sourceKey)}
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
            opacity: activeVideo === 2 ? 1 : isFading ? 0 : 0,
          }}
        />
      )}
    </div>
  );
};

export default BackgroundVideo;
