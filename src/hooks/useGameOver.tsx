import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { GAME_ID } from "../constants/localStorage";
import { looseSfx } from "../constants/sfx";
import { useAudio } from "./useAudio";
import { useGameContext } from "../providers/GameProvider";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { signedHexToNumber } from "../utils/signedHexToNumber";

const GAME_URL = "https://jokersofneon.com";

export const useGameOver = () => {
  const params = useParams();
  const gameId = Number(params.gameId);

  const { executeCreateGame } = useGameContext();
  const { play: looseSound, stop: stopLooseSound } = useAudio(looseSfx);
  const { data: fullLeaderboard } = useGetLeaderboard(gameId);

  const actualPlayer = fullLeaderboard?.find(
    (player) => signedHexToNumber(player.id.toString()) === gameId
  );

  const { t } = useTranslation(["intermediate-screens"]);
  const [isLoading, setIsLoading] = useState(false);

  const position = actualPlayer?.position ?? 100;

  let congratulationsMsj = "";
  if (actualPlayer?.position !== undefined) {
    congratulationsMsj =
      actualPlayer?.position === 1
        ? t("game-over.table.gameOver-leader-msj")
        : actualPlayer?.position > 1 && actualPlayer?.position <= 5
          ? t("game-over.table.gameOver-top5-msj")
          : "";
  }

  useEffect(() => {
    looseSound();
    localStorage.removeItem(GAME_ID);
    return () => {
      stopLooseSound(); // Cleanup sound on unmount
    };
  }, [looseSound, stopLooseSound]);



  const onStartGameClick = () => {
    setIsLoading(true);
    localStorage.removeItem(GAME_ID);
    stopLooseSound();
    executeCreateGame();
  };

  const onShareClick = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=%F0%9F%83%8F%20I%20just%20finished%20a%20game%20in%20%40jokers_of_neon%20%E2%80%94%20check%20out%20my%20results%3A%0A%F0%9F%8F%85%20Rank%3A%20${actualPlayer?.position ?? 0}%0A%F0%9F%94%A5%20Level%3A%20${actualPlayer?.level ?? 0}%0A%0AJoin%20me%20and%20test%20the%20early%20access%20version%0A${GAME_URL}%2F%20%F0%9F%83%8F%E2%9C%A8
`,
      "_blank"
    );
  };

  return {
    gameId,
    actualPlayer,
    congratulationsMsj,
    position,
    isLoading,
    t,
    onStartGameClick,
    onShareClick,
    setIsLoading,
  };
};
