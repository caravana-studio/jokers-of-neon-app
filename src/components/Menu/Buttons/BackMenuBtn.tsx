import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const BackMenuBtn = ({
  width,
  label,
  onClose
}: {
  width: string;
  label?: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();

  return (
    <MenuBtn
      width={width}
      icon={Icons.HOME}
      label={label ? t("game.game-menu.back") : undefined}
      description={t("game.game-menu.back")}
      onClick={() => {
        navigate("/");
        onClose();
      }}
    />
  );
};
