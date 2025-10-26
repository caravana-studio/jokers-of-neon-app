import { NativeAudio } from "@capacitor-community/native-audio";
import { App } from "@capacitor/app";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { SFX_ON } from "../constants/localStorage";

/**
 * useAudio hook for short sound effects (SFX)
 * - Web: uses Howler
 * - Native: uses Capacitor NativeAudio
 * - Default channel = 2 (can be changed via play(channel))
 */
export const useAudio = (audioPath: string, volume: number = 1) => {
  const isNative = Capacitor.isNativePlatform();
  const soundRef = useRef<Howl | null>(null);
  const assetId = useRef<string>(`sfx_${audioPath}`);

  // 🔹 Prepare sound
  useEffect(() => {
    const setup = async () => {
      if (isNative) {
        try {
          await NativeAudio.preload({
            assetId: assetId.current,
            assetPath: audioPath,
            audioChannelNum: 2, // default for SFX
            isUrl: false,
          });
        } catch (err) {
          console.warn("NativeAudio preload error:", err);
        }
      } else {
        soundRef.current = new Howl({
          src: [audioPath],
          preload: true,
          volume,
        });
      }
    };

    setup();

    return () => {
      if (isNative) {
        NativeAudio.unload({ assetId: assetId.current }).catch(() => {});
      } else if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [audioPath]);

  // 🔹 Update volume (web only)
  useEffect(() => {
    if (!isNative && soundRef.current) {
      soundRef.current.volume(volume ?? 0);
    }
  }, [volume]);

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
    const isSoundOn = localStorage.getItem(SFX_ON) === "true";
    if (!isSoundOn) return;

    try {
      if (isNative) {
        // ensure it uses the requested channel
        await NativeAudio.unload({ assetId: assetId.current }).catch(() => {});
        await NativeAudio.preload({
          assetId: assetId.current,
          assetPath: audioPath,
          audioChannelNum: channel,
          isUrl: false,
        });

        await NativeAudio.play({ assetId: assetId.current });
      } else if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.play();
      }
    } catch (err) {
      console.warn("Audio play error:", err);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      if (isNative) {
        await NativeAudio.stop({ assetId: assetId.current });
      } else if (soundRef.current) {
        soundRef.current.stop();
      }
    } catch {}
  }, []);

  return { play, stop };
};
