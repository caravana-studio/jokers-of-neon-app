import { useTranslation } from "react-i18next";
import { Icons } from "../../../constants/icons";
import {
  BarMenuComingSoonBtn,
  BarMenuComingSoonBtnProps,
} from "./BarMenuComingSoonBtn";

interface MapMenuBtnProps
  extends Omit<BarMenuComingSoonBtnProps, "icon" | "description"> {
  width: string;
  useLabel?: boolean;
}

export const MapMenuBtn: React.FC<MapMenuBtnProps> = ({
  width,
  useLabel,
  mtText,
  fontSizeText,
}) => {
  const { t } = useTranslation("game");

  return (
    <BarMenuComingSoonBtn
      width={width}
      icon={Icons.MAP}
      label={useLabel ? t("game.game-menu.map-btn") : undefined}
      description={t("game.game-menu.map-btn")}
      mtText={mtText}
      fontSizeText={fontSizeText}
    />
  );
};
