import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useUsername } from "../dojo/utils/useUsername";
import { useAudioPlayer } from "../providers/AudioPlayerProvider.tsx";
import { useGameContext } from "../providers/GameProvider";
import { TutorialModal } from "./TutorialModal.tsx";

interface GameMenuProps {
  onlySound?: boolean;
  inStore?: boolean;
}

export const GameMenu = ({ onlySound = false, inStore = false }: GameMenuProps) => {
  const username = useUsername();
  const { executeCreateGame } = useGameContext();
  const navigate = useNavigate();
  const { isPlaying, toggleSound } = useAudioPlayer();

  const togglePlayPause = () => {
    toggleSound();
  };

  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
      {showTutorial && <TutorialModal inStore={inStore} onClose={() => setShowTutorial(false)} />}
      <Menu>
        <MenuButton className="game-tutorial-step-9">
          <FontAwesomeIcon icon={faBars} style={{ verticalAlign: "middle" }} />
        </MenuButton>
        <MenuList>
          {!onlySound && (
            <MenuItem onClick={() => executeCreateGame()}>
              Start new game
            </MenuItem>
          )}
          <MenuItem onClick={() => setShowTutorial(true)}>
            See tutorial
          </MenuItem>
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
