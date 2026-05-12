import { GameOverContent } from "./GameOverContent";
import { IconComponent } from "../../components/IconComponent";
import { Icons } from "../../constants/icons";
import { useGameOver } from "../../hooks/useGameOver";
import { useNavigate } from "react-router-dom";

export const GameOverGuest = () => {
  const {
    gameId,
    congratulationsMsj,
    actualPlayer,
    t,
    onShareClick,
    onSecondButtonClick,
    isLoading,
  } = useGameOver();
  const navigate = useNavigate();

  return (
    <GameOverContent
      gameId={gameId}
      congratulationsMsj={congratulationsMsj}
      actualPlayerPosition={actualPlayer?.position}
      t={t}
      onShareClick={onShareClick}
      onSecondButtonClick={onSecondButtonClick}
      isLoading={isLoading}
      guestCtaMessage={t("game-over.guest-login-prompt")}
      firstButton={{
        onClick: () => {
          navigate("/", { replace: true });
        },
        label: t("game-over.continue-without-account").toUpperCase(),
        whiteSpace: "normal",
        lineHeight: "1.2",
        textAlign: "center",
        px: 1,
        wordBreak: "normal",
        overflowWrap: "normal",
      }}
      secondButton={{
        onClick: () => {
          navigate("/login");
        },
        label: t("game-over.login").toUpperCase(),
        icon: (
          <IconComponent
            width={"12px"}
            icon={Icons.CARTRIDGE}
            height={"12px"}
          />
        ),
      }}
    />
  );
};
