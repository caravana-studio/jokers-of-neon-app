import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { GAME_ID } from "../constants/localStorage";
import { looseSfx } from "../constants/sfx";
import { useSettings } from "../providers/SettingsProvider";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { normalizeGameId } from "../utils/normalizeGameId";
import { useAudio } from "./useAudio";

export const useGameOver = () => {
  const REFETCH_INTERVAL_MS = 3000;
  const MAX_REFETCH_ATTEMPTS = 5;
  const params = useParams();
  const gameId = params.gameId ?? "";
  const navigate = useNavigate();
  const { sfxVolume } = useSettings();

  const { play: looseSound, stop: stopLooseSound } = useAudio(
    looseSfx,
    sfxVolume
  );
  const { data: fullLeaderboard, refetch } = useGetLeaderboard(gameId);

  const actualPlayer = fullLeaderboard?.find(
    (player) => normalizeGameId(player.id) === normalizeGameId(gameId)
  );

  const { t } = useTranslation(["intermediate-screens"]);

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

  useEffect(() => {
    if (!gameId || actualPlayer) {
      return;
    }

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      refetch();

      if (attempts >= MAX_REFETCH_ATTEMPTS) {
        window.clearInterval(intervalId);
      }
    }, REFETCH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [actualPlayer, gameId, refetch]);

  const onSecondButtonClick = () => {
    navigate("/my-games");
  };

  return {
    gameId,
    actualPlayer,
    congratulationsMsj,
    position,
    t,
    onSecondButtonClick,
  };
};
