import { NativeAudio } from "@capacitor-community/native-audio";
import { App } from "@capacitor/app";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
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

const DEFAULT_SFX_CHANNELS = 3;
const nativeSfxRefCounts = new Map<string, number>();
const nativeSfxPreloadPromises = new Map<string, Promise<void>>();

const preloadNativeSfx = (
  assetId: string,
  assetPath: string,
  volume: number,
  channels: number
) =>
  runNativeAudioTask(async () => {
    await NativeAudio.preload({
      assetId,
      assetPath,
      audioChannelNum: channels, // Android channels
      channels, // iOS channels
      isUrl: false,
    } as any);

    await NativeAudio.setVolume({
      assetId,
      volume,
    }).catch(() => {});
  }, assetId);

const retainNativeSfx = (
  assetId: string,
  assetPath: string,
  volume: number,
  channels: number = DEFAULT_SFX_CHANNELS
) => {
  const currentCount = nativeSfxRefCounts.get(assetId) ?? 0;
  nativeSfxRefCounts.set(assetId, currentCount + 1);

  let preloadPromise = nativeSfxPreloadPromises.get(assetId);
  if (!preloadPromise) {
    preloadPromise = preloadNativeSfx(assetId, assetPath, volume, channels);
    nativeSfxPreloadPromises.set(assetId, preloadPromise);
  } else {
    runNativeAudioTask(
      () =>
        NativeAudio.setVolume({
          assetId,
          volume,
        }).catch(() => {}),
      assetId
    );
  }

  return preloadPromise;
};

const releaseNativeSfx = (assetId: string) => {
  const currentCount = nativeSfxRefCounts.get(assetId);
  if (!currentCount) return;

  if (currentCount <= 1) {
    const preloadPromise = nativeSfxPreloadPromises.get(assetId);
    nativeSfxRefCounts.set(assetId, 0);

    runNativeAudioTask(async () => {
      if ((nativeSfxRefCounts.get(assetId) ?? 0) > 0) return;
      if (preloadPromise) {
        await preloadPromise.catch(() => {});
      }
      if ((nativeSfxRefCounts.get(assetId) ?? 0) > 0) return;
      await NativeAudio.unload({ assetId }).catch(() => {});
      if ((nativeSfxRefCounts.get(assetId) ?? 0) <= 0) {
        nativeSfxRefCounts.delete(assetId);
        nativeSfxPreloadPromises.delete(assetId);
      }
    }, assetId);
  } else {
    nativeSfxRefCounts.set(assetId, currentCount - 1);
  }
};

/**
 * useAudio hook for short sound effects (SFX)
 * - Web: uses Howler
 * - Native: uses Capacitor NativeAudio
 * - Default channel count = 3
 */
export const useAudio = (audioPath: string, volume: number = 1) => {
  const isNative = Capacitor.isNativePlatform();
  const { sfxOn } = useSettings();
  const soundRef = useRef<Howl | null>(null);
  const assetId = useRef<string>(toNativeAssetId(audioPath));

  // 🔹 Prepare sound
  useEffect(() => {
    const setup = async () => {
      if (isNative) {
        try {
          const currentAssetId = toNativeAssetId(audioPath);
          const nativeAssetPath = toNativeAssetPath(audioPath);

          assetId.current = currentAssetId;
          await retainNativeSfx(
            currentAssetId,
            nativeAssetPath,
            volume,
            DEFAULT_SFX_CHANNELS
          );
        } catch (err) {
          console.warn("NativeAudio preload error:", err);
        }
      } else {
        soundRef.current = new Howl({
          src: [toWebAssetPath(audioPath)],
          preload: true,
          volume,
        });
      }
    };

    setup();

    return () => {
      if (isNative) {
        const currentAssetId = toNativeAssetId(audioPath);
        releaseNativeSfx(currentAssetId);
      } else if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [audioPath, isNative]);

  // 🔹 Update volume
  useEffect(() => {
    if (isNative) {
      const currentAssetId = assetId.current;
      const preloadPromise = nativeSfxPreloadPromises.get(currentAssetId);
      runNativeAudioTask(async () => {
        if (preloadPromise) {
          await preloadPromise.catch(() => {});
        }
        await NativeAudio.setVolume({
          assetId: currentAssetId,
          volume,
        }).catch(() => {});
      }, currentAssetId);
    } else if (soundRef.current) {
      soundRef.current.volume(volume ?? 0);
    }
  }, [isNative, volume]);

  // 🔹 Pause when app goes background
  useEffect(() => {
    let listenerHandle: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      listenerHandle = await App.addListener("pause", async () => {
        if (isNative) {
          await NativeAudio.stop({ assetId: assetId.current }).catch(() => {});
        } else if (soundRef.current) {
          soundRef.current.stop();
        }
      });
    };

    setupListeners();

    return () => {
      if (listenerHandle) listenerHandle.remove();
    };
  }, []);

  // 🔹 Play sound
  const play = useCallback(async (_channel: number = DEFAULT_SFX_CHANNELS) => {
    if (!sfxOn) return;

    try {
      if (isNative) {
        const currentAssetId = assetId.current;
        const preloadPromise = nativeSfxPreloadPromises.get(currentAssetId);
        await runNativeAudioTask(async () => {
          if (preloadPromise) {
            await preloadPromise.catch(() => {});
          }
          await NativeAudio.setVolume({
            assetId: currentAssetId,
            volume,
          }).catch(() => {});
          await NativeAudio.play({ assetId: currentAssetId });
        }, currentAssetId);
      } else if (soundRef.current) {
        soundRef.current.play();
      }
    } catch (err) {
      console.warn("Audio play error:", err);
    }
  }, [isNative, sfxOn, volume]);

  const stop = useCallback(async () => {
    try {
      if (isNative) {
        const currentAssetId = assetId.current;
        await runNativeAudioTask(
          () => NativeAudio.stop({ assetId: currentAssetId }),
          currentAssetId
        );
      } else if (soundRef.current) {
        soundRef.current.stop();
      }
    } catch {}
  }, [isNative]);

  return { play, stop };
};
