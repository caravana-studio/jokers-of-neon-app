import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";

export const TutorialBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();

  return (
    <MenuBtn
      width={width}
      icon={Icons.TUTORIAL}
      description={t("game.game-menu.tutorial-btn")}
      label={label ? t("game.game-menu.tutorial-btn") : undefined}
      onClick={() => {
        navigate("/tutorial");
      }}
    />
  );
};
