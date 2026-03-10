import { AppLauncher } from "@capacitor/app-launcher";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { SEASON_NUMBER } from "../constants/season";
import { GAME_ID } from "../constants/localStorage";
import { looseSfx } from "../constants/sfx";
import { useSettings } from "../providers/SettingsProvider";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { isNative } from "../utils/capacitorUtils";
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

  const onShareClick = async () => {
    if (
      actualPlayer?.position === undefined ||
      actualPlayer?.level === undefined
    ) {
      return;
    }

    const gameTypeLabel = actualPlayer.isTournament
      ? "tournament game"
      : "game";
    const message =
      `🃏 I just finished a ${gameTypeLabel} in @jokers_of_neon — check out my results:\n` +
      `🏅 Rank: ${actualPlayer.position}\n` +
      `🔥 Level: ${actualPlayer.level}\n\n` +
      `Try to beat me on Jokers of Neon Season ${SEASON_NUMBER}`;

    const site = "https://jokersofneon.com/";

    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", message);
    u.searchParams.set("url", site);

    try {
      const native = `twitter://post?message=${encodeURIComponent(`${message}\n${site}`)}`;
      if (!isNative) {
        return window.open(u.toString(), "_blank");
      }

      const nativeOpenResult = await AppLauncher.openUrl({ url: native });
      if (nativeOpenResult.completed) {
        return;
      }
    } catch {
      // if it fails, continue to the next step
    }

    await AppLauncher.openUrl({ url: u.toString() });
  };

  const canShareOnX =
    actualPlayer?.position !== undefined && actualPlayer?.level !== undefined;

  return {
    gameId,
    actualPlayer,
    canShareOnX,
    congratulationsMsj,
    position,
    isLoading,
    t,
    onSecondButtonClick,
    onShareClick,
    setIsLoading,
  };
};
