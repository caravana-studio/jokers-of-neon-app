import { useTranslation } from "react-i18next";
import { Icons } from "../../../../constants/icons";
import { MenuBtn } from "../MenuBtn";
import { useLogout } from "../../../../hooks/useLogout";
import { useDojo } from "../../../../dojo/DojoContext";

export const LogoutMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const { handleLogout } = useLogout();
  const { setup } = useDojo();

  if (setup.useBurnerAcc) return null;

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
