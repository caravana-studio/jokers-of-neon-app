import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisconnect } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../../constants/localStorage.ts";
import { useUsername } from "../../dojo/utils/useUsername.tsx";
import { useFeatureFlagEnabled } from "../../featureManagement/useFeatureFlagEnabled.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export interface GameMenuProps {
  showTutorial?: () => void;
}

export const GameMenu = ({ showTutorial }: GameMenuProps) => {
  const username = useUsername();
  const { restartGame } = useGameContext();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const { isSmallScreen } = useResponsiveValues();
  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");
  const { disconnect } = useDisconnect();

  return (
    <>
      <Menu placement="right">
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

          <MenuItem
            onClick={() => {
              navigate("/my-games");
            }}
          >
            {t("game.game-menu.my-games")}
          </MenuItem>
          {showTutorial && !hideTutorialFF && (
            <MenuItem
              onClick={() => {
                showTutorial();
              }}
            >
              {t("game.game-menu.tutorial-btn")}
            </MenuItem>
          )}
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
        </MenuList>
      </Menu>
    </>
  );
};
