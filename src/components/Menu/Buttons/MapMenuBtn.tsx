import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import { BarMenuComingSoonBtn } from "./BarMenuComingSoonBtn";

export const MapMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");

  return (
    <BarMenuComingSoonBtn
      width={width}
      icon={Icons.MAP}
      label={label ? t("game.game-menu.map-btn") : undefined}
      description={t("game.game-menu.map-btn")}
    />
  );
};
