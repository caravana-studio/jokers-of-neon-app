import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUsername } from "../dojo/utils/useUsername";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useAudioPlayer } from "../providers/AudioPlayerProvider.tsx";
import { useGameContext } from "../providers/GameProvider";
import { useDisconnect } from "@starknet-react/core";

interface GameMenuProps {
  onlySound?: boolean;
  showTutorial?: () => void;
}

export const GameMenu = ({
  onlySound = false,
  showTutorial,
}: GameMenuProps) => {
  const username = useUsername();
  const { executeCreateGame, restartGame } = useGameContext();
  const navigate = useNavigate();
  const { isPlaying, toggleSound } = useAudioPlayer();
  const { t } = useTranslation(["game"]);

  const togglePlayPause = () => {
    toggleSound();
  };

  const {disconnect} = useDisconnect();

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
                disconnect();
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
  return isMobile ? (
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
        bottom: decoratedPage ? "96px" : "60px",
        left: "70px",
        zIndex: 1000,
      }}
    >
      <GameMenu {...rest} />
    </Box>
  );
};
