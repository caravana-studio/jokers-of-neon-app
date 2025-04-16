import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuBtn } from "./MenuBtn";
import { GAME_ID, LOGGED_USER } from "../../../constants/localStorage";
import { Icons } from "../../../constants/icons";
import { useDisconnect } from "@starknet-react/core";
import { useGameContext } from "../../../providers/GameProvider";

export const LogoutMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { restartGame } = useGameContext();

  return (
    <MenuBtn
      width={width}
      icon={Icons.LOGOUT}
      description={t("game.game-menu.logout-btn")}
      onClick={() => {
        localStorage.removeItem(GAME_ID);
        localStorage.removeItem(LOGGED_USER);
        disconnect();
        restartGame();
        navigate("/");
      }}
      label={label ? t("game.game-menu.logout-btn") : undefined}
    />
  );
};
