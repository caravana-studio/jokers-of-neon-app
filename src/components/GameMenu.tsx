import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../constants/localStorage";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal.tsx";

interface GameMenuProps {
  onlySound?: boolean;
  showTutorial?: () => void;
  setSettingsModalOpened?: (opened: boolean) => void;
}

export const GameMenu = ({
  onlySound = false,
  showTutorial,
  setSettingsModalOpened,
}: GameMenuProps) => {
  const username = localStorage.getItem(LOGGED_USER);
  const { executeCreateGame, restartGame } = useGameContext();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);

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
          <MenuItem
            onClick={() => {
              if (setSettingsModalOpened) {
                setSettingsModalOpened(true);
              }
            }}
          >
            Settings
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
  bottomPositionDesktop?: number | string;
}
export const PositionedGameMenu = ({
  decoratedPage = false,
  bottomPositionDesktop,
  ...rest
}: PositionedGameMenuProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const [isSettingsModal, setIsSettingsModal] = useState(false);

  if (!bottomPositionDesktop)
    bottomPositionDesktop = decoratedPage ? "100px" : "20px";

  return (
    <>
      {isSettingsModal && (
        <SettingsModal close={() => setIsSettingsModal(false)} />
      )}
      {isSmallScreen ? (
        <Box
          sx={{
            position: "fixed",
            bottom: "5px",
            right: "5px",
            zIndex: 1000,
            transform: "scale(0.7)",
          }}
        >
          <GameMenu {...rest} setSettingsModalOpened={setIsSettingsModal} />
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            bottom: bottomPositionDesktop,
            left: decoratedPage ? 20 : "20px",
            zIndex: 1000,
          }}
        >
          <GameMenu {...rest} setSettingsModalOpened={setIsSettingsModal} />
        </Box>
      )}
    </>
  );
};
