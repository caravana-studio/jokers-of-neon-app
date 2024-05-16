import { Box } from "@chakra-ui/react";
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error: any) => {
          console.error("Auto-play failed:", error);
        });
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
      }}
    >
      <audio ref={audioRef} src="/music/track1.mp3" loop />
      <Box sx={{ cursor: "pointer" }} onClick={togglePlayPause}>
        {isPlaying ? (
          <FontAwesomeIcon fontSize={25} icon={faVolumeXmark} />
        ) : (
          <FontAwesomeIcon fontSize={25} icon={faVolumeHigh} />
        )}
      </Box>
    </Box>
  );
};

export default AudioPlayer;
