import { useTranslation } from "react-i18next";
import { Icons } from "../../../../constants/icons";
import { MenuBtn } from "../MenuBtn";
import { useLogout } from "../../../../hooks/useLogout";

export const LogoutMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const { handleLogout } = useLogout();

  return (
    <MenuBtn
      width={width}
      icon={Icons.LOGOUT}
      description={t("game.game-menu.logout-btn")}
      onClick={handleLogout}
      label={label ? t("game.game-menu.logout-btn") : undefined}
    />
  );
};
