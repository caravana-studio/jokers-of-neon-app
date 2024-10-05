import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useAudioPlayer } from "../providers/AudioPlayerProvider.tsx";
import { useGameContext } from "../providers/GameProvider";
import { useTranslation } from "react-i18next";

interface GameMenuProps {
  onlySound?: boolean;
  inStore?: boolean;
  showTutorial?: () => void;
}

export const GameMenu = ({
  onlySound = false,
  inStore = false,
  showTutorial,
}: GameMenuProps) => {
  const username = localStorage.getItem(LOGGED_USER);
  const { executeCreateGame, restartGame } = useGameContext();
  const navigate = useNavigate();
  const { isPlaying, toggleSound } = useAudioPlayer();
  const { t } = useTranslation(["game"]);

  const togglePlayPause = () => {
    toggleSound();
  };

  return (
    <>
      <Menu>
        <MenuButton className="game-tutorial-step-9">
          <FontAwesomeIcon icon={faBars} style={{ verticalAlign: "middle" }} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              navigate("/");
            }}
          >
            {t('game.game-menu.home-btn')}
          </MenuItem>
          {!onlySound && (
            <MenuItem onClick={() => executeCreateGame()}>
              {t('game.game-menu.new-game-btn')}
            </MenuItem>
          )}
          {showTutorial && <MenuItem onClick={showTutorial}>{t('game.game-menu.tutorial-btn')}</MenuItem>}
          <MenuItem onClick={togglePlayPause}>
          {t('game.game-menu.sound-btn')} {isPlaying ? "OFF" : "ON"}
          </MenuItem>
          {!onlySound && (
            <MenuItem
              onClick={() => {
                localStorage.removeItem(GAME_ID);
                localStorage.removeItem(LOGGED_USER);
                restartGame();
                navigate("/");
              }}
            >
            {t('game.game-menu.logout-btn')} {username}{" "}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
