import { useCallback, useEffect } from "react";
import AudioManager from "../audio/AudioManager";
import { useSettings } from "../providers/SettingsProvider";

/**
 * useAudio hook for short sound effects (SFX)
 * Delegates to AudioManager singleton which handles preloading and playback.
 */
export const useAudio = (audioPath: string, volume: number = 1) => {
  const { sfxOn } = useSettings();

  // Sync volume changes to AudioManager
  useEffect(() => {
    AudioManager.getInstance().setVolume(volume);
  }, [volume]);

  const play = useCallback(() => {
    if (!sfxOn) return;
    AudioManager.getInstance().play(audioPath);
  }, [audioPath, sfxOn]);

  const stop = useCallback(() => {
    AudioManager.getInstance().stop(audioPath);
  }, [audioPath]);

  return { play, stop };
};
