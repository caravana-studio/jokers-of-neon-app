import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const DocsMenuBtn = ({
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
      icon={Icons.LIST}
      description={t("game.game-menu.docs-btn")}
      label={label ? t("game.game-menu.docs-btn") : undefined}
      onClick={() => {
        navigate("/docs");
        onClose()
      }}
    />
  );
};
