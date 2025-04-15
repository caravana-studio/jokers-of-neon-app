import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GAME_ID, LOGGED_USER } from "../../constants/localStorage.ts";
import { useUsername } from "../../dojo/utils/useUsername.tsx";
import { useFeatureFlagEnabled } from "../../featureManagement/useFeatureFlagEnabled.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { GameMenuProps } from "./GameMenu.tsx";
import { connectControllerCommand } from "../../commands/connectController.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useSettingsModal } from "../../hooks/useSettingsModal.tsx";
import { useState } from "react";
import { GameMenuContent } from "./GameMenuContent.tsx";

export const GameMenuMobile = ({ showTutorial }: GameMenuProps) => {
  const username = useUsername();
  const { restartGame } = useGameContext();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const { t: tHome } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");
  const { disconnect } = useDisconnect();
  const { connector } = useAccount();
  const game = useGame();
  const { openSettings, Modal } = useSettingsModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {isMenuOpen && (
        <GameMenuContent
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
      <Menu placement="right" variant={"menuGameOutline"}>
        <MenuButton
          height={["30px", "45px"]}
          width={["30px", "45px"]}
          borderRadius={["8px", "14px"]}
          className="game-tutorial-step-9"
          onClick={() => setIsMenuOpen(true)}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              verticalAlign: "middle",
              fontSize: isSmallScreen ? 14 : 20,
            }}
          />
        </MenuButton>
        {/*<MenuList>
          <MenuItem onClick={() => connectControllerCommand(connector)}>
            {t("controller")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/leaderboard");
            }}
          >
            {t("game.game-menu.leaderboard-btn")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/docs", {
                state: { inStore: game?.state === "AT_SHOP" },
              });
            }}
          >
            {t("game.game-menu.docs-btn")}
          </MenuItem>
          <MenuItem onClick={openSettings}>
            {t("game.game-menu.settings-btn")}
          </MenuItem>
          {Modal}
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
            onClick={() =>
              window.open("https://discord.gg/4y296W6jaq", "_blank")
            }
          >
            {tHome("home.join-discord")}
          </MenuItem>
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
        </MenuList> */}
      </Menu>
    </>
  );
};
