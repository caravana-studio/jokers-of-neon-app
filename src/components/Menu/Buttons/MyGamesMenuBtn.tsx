import { useTranslation } from "react-i18next";
import { BarMenuBtn } from "./BarMenuBtn";
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
    <BarMenuBtn
      width={width}
      icon={Icons.JOKER}
      label={label ? t("game.game-menu.my-games") : undefined}
      description={""}
      onClick={() => {
        navigate("/my-games");
      }}
    />
  );
};
