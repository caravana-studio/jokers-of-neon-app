import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuBtn } from "./MenuBtn";
import { GAME_ID, LOGGED_USER } from "../../../constants/localStorage";
import { Icons } from "../../../constants/icons";
import { useDisconnect } from "@starknet-react/core";
import { useGameContext } from "../../../providers/GameProvider";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IconComponent } from "../../IconComponent";
import { useUsername } from "../../../dojo/utils/useUsername";

export const LogoutMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { restartGame } = useGameContext();
  const username = useUsername();

  const handleLogout = () => {
    localStorage.removeItem(GAME_ID);
    localStorage.removeItem(LOGGED_USER);
    disconnect();
    restartGame();
    navigate("/");
  };

  return (
    <Menu placement="right">
      <MenuButton
        borderRadius={["8px", "14px"]}
        className="game-tutorial-step-9"
        width={width}
        justifyContent="flex-start"
      >
        <IconComponent icon={Icons.LOGOUT} width={width} height={width} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleLogout}>
          {t("game.game-menu.logout-btn")} {username}{" "}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
