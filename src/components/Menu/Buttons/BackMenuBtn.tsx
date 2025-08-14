import { useTranslation } from "react-i18next";
import { MenuBtn } from "./MenuBtn";
import { Icons } from "../../../constants/icons";
import { useNavigate } from "react-router-dom";
import { useDojo } from "../../../dojo/DojoContext";

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
  const { setup } = useDojo();

  if (setup.useBurnerAcc) return null;

  return (
    <MenuBtn
      width={width}
      icon={Icons.BACK}
      label={label ? t("game.game-menu.back") : undefined}
      description={t("game.game-menu.back")}
      onClick={() => {
        navigate("/");
        onClose();
      }}
    />
  );
};
