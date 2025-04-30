import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";
import { MenuComingSoonBtnProps } from "./MenuComingSoonBtn";

interface MapMenuBtnProps
  extends Omit<MenuComingSoonBtnProps, "icon" | "description"> {
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
  const navigate = useNavigate();

  return (
    <MenuBtn
      width={width}
      icon={Icons.MAP}
      label={useLabel ? t("game.game-menu.map-btn") : undefined}
      description={t("game.game-menu.map-btn")}
      onClick={() => {
        navigate("/map");
      }}
    />
  );
};
