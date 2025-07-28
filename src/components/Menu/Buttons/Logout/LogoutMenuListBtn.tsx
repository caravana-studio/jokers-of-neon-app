import { useTranslation } from "react-i18next";
import { Icons } from "../../../../constants/icons";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IconComponent } from "../../../IconComponent";
import { useUsername } from "../../../../dojo/utils/useUsername";
import { useLogout } from "../../../../hooks/useLogout";
import { useDojo } from "../../../../dojo/DojoContext";

export const LogoutMenuListBtn = ({ width }: { width: string }) => {
  const { t } = useTranslation("game");
  const username = useUsername();
  const { handleLogout } = useLogout();
  const { setup } = useDojo();

  if (setup.useBurnerAcc) return null;

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
