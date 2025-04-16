import { useTranslation } from "react-i18next";
import { BarMenuBtn } from "./BarMenuBtn";
import { Icons } from "../../../constants/icons";
import { useSettingsModal } from "../../../hooks/useSettingsModal";

export const SettingsBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const { openSettings, Modal: SettingsModal } = useSettingsModal();

  return (
    <>
      {SettingsModal}
      <BarMenuBtn
        icon={Icons.SETTINGS}
        label={label ? t("game.game-menu.settings-btn") : undefined}
        description={t("game.game-menu.settings-btn")}
        onClick={openSettings}
        width={width}
      />
    </>
  );
};
