import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const SettingsMenuBtn = ({
  width,
  label,
  onClose,
}: {
  width: string;
  label?: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();

  return (
    <MenuBtn
      icon={Icons.SETTINGS}
      label={label ? t("game.game-menu.settings-btn") : undefined}
      description={t("game.game-menu.settings-btn")}
      onClick={() => {
        navigate("/settings-game");
        onClose();
      }}
      width={width}
    />
  );
};
