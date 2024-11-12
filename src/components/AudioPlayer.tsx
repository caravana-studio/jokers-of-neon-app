import { Box, SystemStyleObject } from "@chakra-ui/react";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAudioPlayer } from "../providers/AudioPlayerProvider";

interface AudioPlayerProps {
  sx?: SystemStyleObject;
  isEnabled?: boolean;
  onClick?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  sx,
  isEnabled,
  onClick,
}) => {
  const { isPlaying, toggleSound } = useAudioPlayer();
  const effectiveIsEnabled = isEnabled ?? isPlaying;
  const effectiveOnClick = onClick ?? toggleSound;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        ...sx,
      }}
    >
      <Box sx={{ cursor: "pointer" }} onClick={effectiveOnClick}>
        {effectiveIsEnabled ? (
          <FontAwesomeIcon color="white" fontSize={20} icon={faVolumeHigh} />
        ) : (
          <FontAwesomeIcon color="white" fontSize={20} icon={faVolumeXmark} />
        )}
      </Box>
    </Box>
  );
};

export default AudioPlayer;
