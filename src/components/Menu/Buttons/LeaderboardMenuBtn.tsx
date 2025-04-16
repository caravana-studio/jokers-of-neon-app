import { useTranslation } from "react-i18next";
import { MenuBtn } from "./MenuBtn";
import { Icons } from "../../../constants/icons";
import { useNavigate } from "react-router-dom";

export const LeaderboardMenuBtn = ({
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
      icon={Icons.PODIUM}
      label={label ? t("game.game-menu.leaderboard-btn") : undefined}
      description={t("game.game-menu.leaderboard-btn")}
      onClick={() => {
        navigate("/leaderboard");
      }}
    />
  );
};
