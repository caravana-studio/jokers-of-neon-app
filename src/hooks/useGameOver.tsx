import { AppLauncher } from "@capacitor/app-launcher";
import { Browser } from "@capacitor/browser";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { GAME_ID } from "../constants/localStorage";
import { looseSfx } from "../constants/sfx";
import { useSettings } from "../providers/SettingsProvider";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { isNative } from "../utils/capacitorUtils";
import { signedHexToNumber } from "../utils/signedHexToNumber";
import { useAudio } from "./useAudio";

export const useGameOver = () => {
  const params = useParams();
  const gameId = Number(params.gameId);
  const navigate = useNavigate();
  const { sfxVolume } = useSettings();

  const { play: looseSound, stop: stopLooseSound } = useAudio(
    looseSfx,
    sfxVolume
  );
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

  const onSecondButtonClick = () => {
    navigate("/my-games");
  };

  const onShareClick = async () => {
    const message =
      "🃏 I just finished a game in @jokers_of_neon — check out my results:\n" +
      `🏅 Rank: ${actualPlayer?.position ?? 0}\n` +
      `🔥 Level: ${actualPlayer?.level ?? 0}\n\n` +
      "Join me and test the early access version";

    const site = "https://jokersofneon.com/";

    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", message);
    u.searchParams.set("url", site);

    try {
      const native = `twitter://post?message=${encodeURIComponent(`${message}\n${site}`)}`;
      const canOpen = await AppLauncher.canOpenUrl({ url: native });
      if (!isNative) {
        return window.open(u, "_blank");
      } else if (canOpen.value) {
        await AppLauncher.openUrl({ url: native });
        return;
      }
    } catch {
      // if it fails, continue to the next step
    }

    // 3) Fallback: open intent web in system browser
    await Browser.open({ url: u.toString() });
  };

  return {
    gameId,
    actualPlayer,
    congratulationsMsj,
    position,
    isLoading,
    t,
    onSecondButtonClick,
    onShareClick,
    setIsLoading,
  };
};
