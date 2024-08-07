import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER, SKIP_PWA_INSTALL } from "../constants/localStorage";
import { useUsername } from "../dojo/utils/useUsername";
import { useAudioPlayer } from "../providers/AudioPlayerProvider.tsx";
import { useGameContext } from "../providers/GameProvider";
import { useEffect, useState } from "react";

interface GameMenuProps {
  onlySound?: boolean;
  inStore?: boolean;
  onTutorialButtonClick?: () => void;
  onInstallPWAButtonClick?: () => void;
}

export const GameMenu = ({ onlySound = false, inStore = false, onTutorialButtonClick, onInstallPWAButtonClick }: GameMenuProps) => {
  const username = useUsername();
  const { executeCreateGame } = useGameContext();
  const navigate = useNavigate();
  const { isPlaying, toggleSound } = useAudioPlayer();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }
  }, [])

  const togglePlayPause = () => {
    toggleSound();
  };

  return (
    <>
      {/* {showTutorial && <TutorialModal inStore={inStore} onClose={() => setShowTutorial(false)} />} */}
      {/* {showInstallPWAIOS && <InstallPWAIOS onClose={() => setShowInstallPWAIOS(false)} />} */}
      <Menu>
        <MenuButton>
          <FontAwesomeIcon icon={faBars} style={{ verticalAlign: "middle" }} />
        </MenuButton>
        <MenuList>
          {!onlySound && (
            <MenuItem onClick={() => executeCreateGame()}>
              Start new game
            </MenuItem>
          )}
          <MenuItem onClick={onTutorialButtonClick}>
            See tutorial
          </MenuItem>
          {onInstallPWAButtonClick && isIOS && (
              <MenuItem onClick={onInstallPWAButtonClick}>
                See install Instructions
              </MenuItem>
          )}
          <MenuItem onClick={togglePlayPause}>
            Turn sound {isPlaying ? "OFF" : "ON"}
          </MenuItem>
          {!onlySound && (
            <MenuItem
              onClick={() => {
                localStorage.removeItem(GAME_ID);
                localStorage.removeItem(LOGGED_USER);
                navigate("/");
              }}
            >
              Logout {username}{" "}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
