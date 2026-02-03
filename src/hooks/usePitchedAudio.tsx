import { useCallback } from "react";
import AudioManager from "../audio/AudioManager";
import { useSettings } from "../providers/SettingsProvider";

/**
 * Hook for audio with pre-generated pitch variants
 * Expects files named: basePath_0.mp3, basePath_1.mp3, ..., basePath_{N-1}.mp3
 *
 * Delegates to AudioManager singleton which handles preloading and playback.
 * Volume is managed globally by SettingsProvider, not per-hook.
 *
 * @param basePath - Base path for files (e.g., "/music/sfx/points")
 * @param variants - Number of variant files (e.g., 18 for points_0.mp3 to points_17.mp3)
 * @param _volume - Deprecated, volume is managed globally
 */
export const usePitchedAudio = (
  basePath: string,
  variants: number,
  _volume: number = 1
) => {
  const { sfxOn } = useSettings();

  const getSoundPath = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(0, index), variants - 1);
      return `${basePath}_${clampedIndex}.mp3`;
    },
    [basePath, variants]
  );

  const play = useCallback(
    (soundIndex: number = 0) => {
      if (!sfxOn) return;

      const clampedIndex = Math.min(Math.max(0, soundIndex), variants - 1);
      const path = getSoundPath(clampedIndex);
      AudioManager.getInstance().play(path);
    },
    [sfxOn, variants, getSoundPath]
  );

  const stop = useCallback(() => {
    for (let i = 0; i < variants; i++) {
      const path = getSoundPath(i);
      AudioManager.getInstance().stop(path);
    }
  }, [variants, getSoundPath]);

  return { play, stop };
};
