import { useEffect, useRef, useState } from "react";
import { getVideoFromCache } from "../utils/cacheUtils";
import { BackgroundType } from "./Background";

interface BackgroundVideoProps {
  type: BackgroundType;
}

const BackgroundVideo = ({ type }: BackgroundVideoProps) => {
  const [videoSrc1, setVideoSrc1] = useState<string | null>(null);
  const [videoSrc2, setVideoSrc2] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);

  const videoSources: Record<string, string> = {
    home: "/bg/jn-bg.mp4",
    store: "/bg/store-bg.mp4",
    game: "/bg/game-bg.mp4",
    rage: "/bg/rage-bg.mp4",
    map: "/bg/map-bg.mp4",
  };

  useEffect(() => {
    const loadVideo = async () => {
      const cachedVideo = await getVideoFromCache(videoSources[type]);
      const newVideoSrc = cachedVideo || videoSources[type];

      setIsFading(true);

      setTimeout(() => {
        if (activeVideo === 1) {
          setVideoSrc2(newVideoSrc);
          setActiveVideo(2);
        } else {
          setVideoSrc1(newVideoSrc);
          setActiveVideo(1);
        }
        setTimeout(() => setIsFading(false), 800);
      }, 100);
    };

    loadVideo();
  }, [type]);

  // useEffect to programmatically play the videos
  useEffect(() => {
    const playVideo = (videoRef: React.RefObject<HTMLVideoElement>) => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    if (activeVideo === 1 && videoRef1.current?.src) {
      playVideo(videoRef1);
    }
    if (activeVideo === 2 && videoRef2.current?.src) {
      playVideo(videoRef2);
    }
  }, [videoSrc1, videoSrc2, activeVideo]);

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
      <video
        ref={videoRef1}
        src={videoSrc1 || videoSources[type]}
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
          opacity: activeVideo === 1 && !isFading ? 1 : 0,
        }}
      />
      <video
        ref={videoRef2}
        src={videoSrc2 || ""}
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
          opacity: activeVideo === 2 && !isFading ? 1 : 0,
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
