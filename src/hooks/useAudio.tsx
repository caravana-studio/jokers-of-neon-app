import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { SOUND_OFF } from "../constants/localStorage";

export const useAudio = (audioPath: string, volume: number = 1) => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [audioPath],
      preload: true,
      volume: volume,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume ?? 0);
    }
  }, [volume]);

  const play = useCallback(() => {
    const isSoundOff = localStorage.getItem(SOUND_OFF) === "true";
    if (!isSoundOff && soundRef.current) {
      soundRef.current.stop(); // Stop any currently playing instances
      soundRef.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  }, []);

  return { play, stop };
};
