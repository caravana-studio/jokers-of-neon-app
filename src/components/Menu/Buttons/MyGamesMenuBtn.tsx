import { useTranslation } from "react-i18next";
import { MenuBtn } from "./MenuBtn";
import { Icons } from "../../../constants/icons";
import { useNavigate } from "react-router-dom";

export const MyGamesMenuBtn = ({
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
      icon={Icons.JOKER}
      label={label ? t("game.game-menu.my-games") : undefined}
      description={t("game.game-menu.my-games")}
      onClick={() => {
        navigate("/my-games");
      }}
    />
  );
};
