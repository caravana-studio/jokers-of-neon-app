import { Flex, Button } from "@chakra-ui/react";
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
    onStartGameClick,
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
      onStartGameClick={onStartGameClick}
      isLoading={isLoading}
      mainActionButtons={
        <Flex gap={4}>
          <Button
            variant="secondarySolid"
            onClick={() => {
              initiateTransferFlow();
            }}
            alignItems={"center"}
          >
            <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
              {t("game-over.login")}{" "}
              <IconComponent
                icon={Icons.CARTRIDGE}
                width={"20px"}
                height={"20px"}
              ></IconComponent>
            </Flex>
          </Button>
          <Button onClick={handleLogout}>{t("skip")}</Button>
        </Flex>
      }
    />
  );
};
