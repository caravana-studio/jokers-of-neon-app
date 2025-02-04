import { useRef, useEffect, useState } from "react";
import { getVideoFromCache } from "../utils/preloadVideos";

interface BackgroundVideoProps {
  type: "home" | "store" | "game" | "rage";
}

const BackgroundVideo = ({ type }: BackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const videoSources: Record<string, string> = {
    home: "/bg/jn-bg.mp4",
    store: "/bg/store-bg.mp4",
    game: "/bg/game-bg.mp4",
    rage: "/bg/rage-bg.mp4",
  };

  useEffect(() => {
    const loadVideo = async () => {
      const cachedVideo = await getVideoFromCache(videoSources[type]);
      setVideoSrc(cachedVideo || videoSources[type]);
    };

    loadVideo();
  }, [type]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const currentTime = video.currentTime;

      if (video.src !== videoSources[type]) {
        video.pause();
        video.src = videoSources[type];
        video.load();
        video.currentTime = currentTime;
        video.play();
      }
    }
  }, [type]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};

export default BackgroundVideo;
