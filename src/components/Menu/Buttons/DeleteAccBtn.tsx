import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const DeleteAccBtn = ({
  width,
  label,
  arrowRight,
}: {
  width: string;
  label?: boolean;
  arrowRight?: boolean;
}) => {
  const { t } = useTranslation("game");

  return (
    <MenuBtn
      width={width}
      icon={Icons.TUTORIAL}
      description={t("game.game-menu.delete-acc-btn")}
      label={label ? t("game.game-menu.delete-acc-btn") : undefined}
      onClick={() =>
        window.open("https://jokersofneon.com/delete-account", "_blank")
      }
      arrowRight={arrowRight}
    />
  );
};
