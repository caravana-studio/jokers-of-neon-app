import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const DailyMissionsMenuBtn = ({
  width,
  label,
  onClick,
}: {
  width: string;
  label?: boolean;
  onClick: () => void;
}) => {
  const { t } = useTranslation("game");

  return (
    <MenuBtn
      width={width}
      icon={Icons.CHECK}
      description={t("game.game-menu.daily-missions-btn")}
      label={label ? t("game.game-menu.daily-missions-btn") : undefined}
      onClick={onClick}
    />
  );
};
