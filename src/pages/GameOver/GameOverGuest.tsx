import { GameOverContent } from "./GameOverContent";
import { IconComponent } from "../../components/IconComponent";
import { Icons } from "../../constants/icons";
import { useGameOver } from "../../hooks/useGameOver";
import { useLogout } from "../../hooks/useLogout";
import { useGameContext } from "../../providers/GameProvider";

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
  const { initiateTransferFlow } = useGameContext();
  const { handleLogout } = useLogout();

  return (
    <GameOverContent
      gameId={gameId}
      congratulationsMsj={congratulationsMsj}
      actualPlayerPosition={actualPlayer?.position}
      t={t}
      onShareClick={onShareClick}
      onSecondButtonClick={onSecondButtonClick}
      isLoading={isLoading}
      firstButton={{
        onClick: () => {
          initiateTransferFlow();
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
      secondButton={{
        onClick: () => {
          handleLogout();
        },
        label: t("skip").toUpperCase(),
      }}
    />
  );
};
