import { Box, SystemStyleObject } from "@chakra-ui/react";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSettings } from "../providers/SettingsProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";

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
  const { musicOn, toggleMusic } = useSettings();
  const effectiveIsEnabled = isEnabled ?? musicOn;
  const effectiveOnClick = onClick ?? toggleMusic;

  const { isSmallScreen } = useResponsiveValues();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isSmallScreen ? "25px" : "70px",
        left: isSmallScreen ? "15px" : "45px",
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
