import { Box } from "@chakra-ui/react";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { SOUND_OFF } from "../constants/localStorage";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(!localStorage.getItem(SOUND_OFF));

  useEffect(() => {
    if (audioRef.current) {
      if (!localStorage.getItem(SOUND_OFF)) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error: any) => {
            console.error("Auto-play failed:", error);
          });
      }
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem(SOUND_OFF, "true");
      } else {
        audioRef.current.play();
        localStorage.removeItem(SOUND_OFF);
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
      <audio ref={audioRef} src="/music/new-track.mp3" loop />
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
