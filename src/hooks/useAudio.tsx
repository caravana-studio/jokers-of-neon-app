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

/**
 * useAudio hook for short sound effects (SFX)
 * - Web: uses Howler
 * - Native: uses Capacitor NativeAudio
 * - Default channel = 2 (can be changed via play(channel))
 */
export const useAudio = (audioPath: string, volume: number = 1) => {
  const isNative = Capacitor.isNativePlatform();
  const { sfxOn } = useSettings();
  const soundRef = useRef<Howl | null>(null);
  const assetId = useRef<string>(toNativeAssetId(audioPath));

  useEffect(() => {
    assetId.current = toNativeAssetId(audioPath);
  }, [audioPath]);

  // 🔹 Prepare sound
  useEffect(() => {
    const setup = async () => {
      if (isNative) {
        try {
          const nativeAssetPath = toNativeAssetPath(audioPath);

          await runNativeAudioTask(async () => {
            await NativeAudio.preload({
              assetId: assetId.current,
              assetPath: nativeAssetPath,
              audioChannelNum: 2, // default for SFX (Android)
              channels: 2,
              isUrl: false,
            } as any);

            await NativeAudio.setVolume({
              assetId: assetId.current,
              volume,
            }).catch(() => {});
          });
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
        runNativeAudioTask(() =>
          NativeAudio.unload({ assetId: assetId.current }).catch(() => {})
        );
      } else if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [audioPath]);

  // 🔹 Update volume
  useEffect(() => {
    if (isNative) {
      runNativeAudioTask(() =>
        NativeAudio.setVolume({
          assetId: assetId.current,
          volume,
        }).catch(() => {})
      );
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

  // 🔹 Play sound (with optional channel)
  const play = useCallback(async (channel: number = 2) => {
    if (!sfxOn) return;

    try {
      if (isNative) {
        const nativeAssetPath = toNativeAssetPath(audioPath);

        // ensure it uses the requested channel
        await runNativeAudioTask(async () => {
          await NativeAudio.unload({ assetId: assetId.current }).catch(
            () => {}
          );
          await NativeAudio.preload({
            assetId: assetId.current,
            assetPath: nativeAssetPath,
            audioChannelNum: channel,
            channels: channel,
            isUrl: false,
          } as any);

          await NativeAudio.setVolume({
            assetId: assetId.current,
            volume,
          }).catch(() => {});

          await NativeAudio.play({ assetId: assetId.current });
        });
      } else if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.play();
      }
    } catch (err) {
      console.warn("Audio play error:", err);
    }
  }, [audioPath, isNative, sfxOn, volume]);

  const stop = useCallback(async () => {
    try {
      if (isNative) {
        await runNativeAudioTask(() =>
          NativeAudio.stop({ assetId: assetId.current })
        );
      } else if (soundRef.current) {
        soundRef.current.stop();
      }
    } catch {}
  }, []);

  return { play, stop };
};
