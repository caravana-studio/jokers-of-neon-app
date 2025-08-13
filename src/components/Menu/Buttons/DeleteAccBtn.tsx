import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const DeleteAccBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");

  return (
    <MenuBtn
      width={width}
      icon={Icons.TUTORIAL}
      description={t("game.game-menu.delete-acc-btn")}
      label={label ? t("game.game-menu.delete-acc-btn") : undefined}
      onClick={() => {}}
    />
  );
};
