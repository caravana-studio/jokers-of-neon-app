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
import { useUsername } from "../dojo/utils/useUsername.tsx";
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
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();
  const [isSettingsModalOpened, setSettingsModalOpened] = useState(false);

  const { disconnect } = useDisconnect();

  return (
    <>
      {isSettingsModalOpened && (
        <SettingsModal close={() => setSettingsModalOpened(false)} />
      )}
      <Menu>
        <MenuButton
          height={["30px", "45px"]}
          width={["30px", "45px"]}
          borderRadius={["8px", "14px"]}
          className="game-tutorial-step-9"
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              verticalAlign: "middle",
              fontSize: isSmallScreen ? 14 : 20,
            }}
          />
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
          <MenuItem
            onClick={() => {
              navigate("/docs");
            }}
          >
            {t("game.game-menu.docs-btn")}
          </MenuItem>
          {showTutorial && (
            <MenuItem
              onClick={() => {
                navigate("/tutorial");
              }}
            >
              {t("game.game-menu.tutorial-btn")}
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              console.log(
                "is settings modal opened: " + setSettingsModalOpened
              );
              if (setSettingsModalOpened) {
                setSettingsModalOpened(true);
              }
            }}
          >
            {t("game.game-menu.settings-btn")}
          </MenuItem>
          {!onlySound && (
            <MenuItem
              onClick={() => {
                localStorage.removeItem(GAME_ID);
                localStorage.removeItem(LOGGED_USER);
                disconnect();
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

  if (!bottomPositionDesktop)
    bottomPositionDesktop = decoratedPage ? "100px" : "20px";

  return (
    <>
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
          <GameMenu {...rest} />
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
          <GameMenu {...rest} />
        </Box>
      )}
    </>
  );
};
