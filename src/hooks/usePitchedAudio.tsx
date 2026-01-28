import { NativeAudio } from "@capacitor-community/native-audio";
import { Capacitor } from "@capacitor/core";
import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { useSettings } from "../providers/SettingsProvider";
import { runNativeAudioTask } from "../utils/nativeAudioQueue";

const toNativeAssetPath = (path: string) => {
  const sanitized = path.replace(/^\/+/, "");
  return sanitized.startsWith("public/") ? sanitized : `public/${sanitized}`;
};

const toWebAssetPath = (path: string) => {
  const sanitized = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${sanitized}`;
};

const toNativeAssetId = (path: string) =>
  `sfx_${path.replace(/^\/+/, "").replace(/[^\w-]/g, "_")}`;

/**
 * Hook for audio with pre-generated pitch variants
 * Expects files named: basePath_0.mp3, basePath_1.mp3, ..., basePath_{N-1}.mp3
 *
 * @param basePath - Base path for files (e.g., "/music/sfx/points")
 * @param variants - Number of variant files (e.g., 18 for points_0.mp3 to points_17.mp3)
 * @param volume - Volume level (0-1)
 */
export const usePitchedAudio = (
  basePath: string,
  variants: number,
  volume: number = 1
) => {
  const isNative = Capacitor.isNativePlatform();
  const { sfxOn } = useSettings();

  // Store Howl instances for web
  const howlPoolRef = useRef<Howl[]>([]);
  // Track preloaded native assets
  const nativePreloadedRef = useRef<string[]>([]);
  const isInitializedRef = useRef(false);
  const volumeRef = useRef(volume);

  // Keep volume ref updated
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Generate path for a sound variant
  const getSoundPath = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(0, index), variants - 1);
      return `${basePath}_${clampedIndex}.mp3`;
    },
    [basePath, variants]
  );

  // Initialize all sound variants
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initSounds = async () => {
      const preloadedIds: string[] = [];

      for (let i = 0; i < variants; i++) {
        const path = getSoundPath(i);

        if (isNative) {
          const assetId = toNativeAssetId(path);
          const nativePath = toNativeAssetPath(path);

          try {
            await runNativeAudioTask(async () => {
              await NativeAudio.preload({
                assetId,
                assetPath: nativePath,
                audioChannelNum: 1,
                isUrl: false,
              } as any);
              await NativeAudio.setVolume({
                assetId,
                volume: volumeRef.current,
              }).catch(() => {});
            });
            preloadedIds.push(assetId);
          } catch (err) {
            console.warn(`Failed to preload sound ${i}:`, err);
          }
        } else {
          const webPath = toWebAssetPath(path);
          howlPoolRef.current[i] = new Howl({
            src: [webPath],
            preload: true,
            volume: volumeRef.current,
            html5: false,
          });
        }
      }

      nativePreloadedRef.current = preloadedIds;
    };

    initSounds();

    return () => {
      if (isNative) {
        nativePreloadedRef.current.forEach((assetId) => {
          runNativeAudioTask(() =>
            NativeAudio.unload({ assetId }).catch(() => {})
          );
        });
        nativePreloadedRef.current = [];
      } else {
        howlPoolRef.current.forEach((howl) => howl?.unload());
        howlPoolRef.current = [];
      }
      isInitializedRef.current = false;
    };
  }, [basePath, variants, isNative, getSoundPath]);

  // Update volume on all instances
  useEffect(() => {
    if (isNative) {
      nativePreloadedRef.current.forEach((assetId) => {
        runNativeAudioTask(() =>
          NativeAudio.setVolume({ assetId, volume }).catch(() => {})
        );
      });
    } else {
      howlPoolRef.current.forEach((howl) => howl?.volume(volume));
    }
  }, [volume, isNative]);

  const play = useCallback(
    async (soundIndex: number = 0) => {
      if (!sfxOn) return;

      const clampedIndex = Math.min(Math.max(0, soundIndex), variants - 1);
      const path = getSoundPath(clampedIndex);

      try {
        if (isNative) {
          const assetId = toNativeAssetId(path);
          runNativeAudioTask(async () => {
            await NativeAudio.play({ assetId });
          }).catch(() => {});
        } else {
          const howl = howlPoolRef.current[clampedIndex];
          if (howl) {
            howl.play();
          }
        }
      } catch (err) {
        console.warn("Pitched audio play error:", err);
      }
    },
    [sfxOn, isNative, variants, getSoundPath]
  );

  const stop = useCallback(() => {
    try {
      if (isNative) {
        nativePreloadedRef.current.forEach((assetId) => {
          runNativeAudioTask(() =>
            NativeAudio.stop({ assetId }).catch(() => {})
          );
        });
      } else {
        howlPoolRef.current.forEach((howl) => howl?.stop());
      }
    } catch {}
  }, [isNative]);

  return { play, stop };
};
