import { NativeAudio } from "@capacitor-community/native-audio";
import { App } from "@capacitor/app";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { SFX_ON } from "../constants/localStorage";

export const useAudio = (audioPath: string, volume: number = 1) => {
  const isNative = Capacitor.isNativePlatform();
  const soundRef = useRef<Howl | null>(null);
  const assetId = useRef<string>(audioPath); // used for NativeAudio

  // 🔹 Prepare sound
  useEffect(() => {
    const setup = async () => {
      if (isNative) {
        try {
          await NativeAudio.preload({
            assetId: assetId.current,
            assetPath: audioPath,
            audioChannelNum: 1,
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
          try {
            await NativeAudio.stop({ assetId: assetId.current });
          } catch {}
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

  // 🔹 Play & Stop
  const play = useCallback(async () => {
    const isSoundOn = localStorage.getItem(SFX_ON) === "true";
    if (!isSoundOn) return;

    try {
      if (isNative) {
        await NativeAudio.stop({ assetId: assetId.current }).catch(() => {});
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
