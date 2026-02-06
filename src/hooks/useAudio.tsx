import { useCallback } from "react";
import AudioManager from "../audio/AudioManager";
import { useSettings } from "../providers/SettingsProvider";

/**
 * useAudio hook for short sound effects (SFX)
 * Delegates to AudioManager singleton which handles preloading and playback.
 * Volume is managed globally by SettingsProvider, not per-hook.
 */
export const useAudio = (audioPath: string, _volume: number = 1) => {
  const { sfxOn } = useSettings();

  const play = useCallback(() => {
    if (!sfxOn) return;
    AudioManager.getInstance().play(audioPath);
  }, [audioPath, sfxOn]);

  const stop = useCallback(() => {
    AudioManager.getInstance().stop(audioPath);
  }, [audioPath]);

  return { play, stop };
};
