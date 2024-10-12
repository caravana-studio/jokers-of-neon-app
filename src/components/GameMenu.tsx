import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useAudioPlayer } from "../providers/AudioPlayerProvider.tsx";
import { useGameContext } from "../providers/GameProvider";

interface GameMenuProps {
  onlySound?: boolean;
  showTutorial?: () => void;
}

export const GameMenu = ({
  onlySound = false,
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
            {t("game.game-menu.home-btn")}
          </MenuItem>
          {!onlySound && (
            <MenuItem onClick={() => executeCreateGame()}>
              {t("game.game-menu.new-game-btn")}
            </MenuItem>
          )}
          {showTutorial && (
            <MenuItem onClick={showTutorial}>
              {t("game.game-menu.tutorial-btn")}
            </MenuItem>
          )}
          <MenuItem onClick={togglePlayPause}>
            {t("game.game-menu.sound-btn")} {isPlaying ? "OFF" : "ON"}
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
              {t("game.game-menu.logout-btn")} {username}{" "}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

interface PositionedGameMenuProps extends GameMenuProps {
  decoratedPage?: boolean;
}
export const PositionedGameMenu = ({
  decoratedPage = false,
  ...rest
}: PositionedGameMenuProps) => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return isSmallScreen ? (
    <Box
      sx={{
        position: "fixed",
        bottom: "5px",
        right: "5px",
        zIndex: 1000,
        transform: "scale(0.7)",
      }}
    >
      <GameMenu {...rest} />
    </Box>
  ) : (
    <Box
      sx={{
        position: "fixed",
        bottom: decoratedPage ? 14 : "20px",
        left: decoratedPage ? "70px" : "20px",
        zIndex: 1000,
      }}
    >
      <GameMenu {...rest} />
    </Box>
  );
};
