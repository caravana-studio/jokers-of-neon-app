import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const DocsMenuBtn = ({
  width,
  label,
  onClose,
  disabled,
}: {
  width: string;
  label?: boolean;
  onClose: () => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();

  return (
    <MenuBtn
      width={width}
      icon={Icons.LIST}
      description={t("game.game-menu.docs-btn")}
      label={label ? t("game.game-menu.docs-btn") : undefined}
      disabled={disabled}
      onClick={() => {
        navigate("/docs-game");
        onClose()
      }}
    />
  );
};
