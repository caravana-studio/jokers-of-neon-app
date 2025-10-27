import { NativeAudio } from "@capacitor-community/native-audio";
import { Capacitor } from "@capacitor/core";
import { Howl } from "howler";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { mainMenuUrls } from "../components/Menu/useContextMenuItems";
import { SETTINGS_MUSIC_VOLUME, SOUND_OFF } from "../constants/localStorage.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { runNativeAudioTask } from "../utils/nativeAudioQueue";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

interface AudioPlayerContextProps {
  isPlaying: boolean;
  toggleSound: () => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(
  undefined
);

interface AudioPlayerProviderProps extends PropsWithChildren {
  baseSongPath: string;
  rageSongPath: string;
  introSongPath: string;
}

export const AudioPlayerProvider = ({
  children,
  baseSongPath,
  rageSongPath,
  introSongPath,
}: AudioPlayerProviderProps) => {
  const isNative = Capacitor.isNativePlatform();
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWithSound, setGameWithSound] = useState(
    !localStorage.getItem(SOUND_OFF)
  );
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [currentActiveSongPath, setCurrentActiveSongPath] = useState<
    string | null
  >(null);

  const location = useLocation();
  const { isRageRound } = useGameStore();
  const isMainMenuRoute = mainMenuUrls.includes(location.pathname);

  // 🔹 determine which track should be active
  useEffect(() => {
    let newActiveSongPath: string;
    if (isMainMenuRoute) {
      newActiveSongPath = introSongPath;
    } else if (isRageRound) {
      newActiveSongPath = rageSongPath;
    } else {
      newActiveSongPath = baseSongPath;
    }

    if (newActiveSongPath !== currentActiveSongPath) {
      setCurrentActiveSongPath(newActiveSongPath);
    }
  }, [
    location.pathname,
    isRageRound,
    introSongPath,
    baseSongPath,
    rageSongPath,
    currentActiveSongPath,
  ]);

  // 🔹 handle background music
  useEffect(() => {
    let activeSoundInstance: Howl | undefined = sound;
    let fadeTimeout: NodeJS.Timeout;

    const playWithFade = async () => {
      if (isNative) {
        try {
          const shouldPlay = await runNativeAudioTask(async () => {
            await NativeAudio.stop({ assetId: "bg_music" }).catch(() => {});
            await NativeAudio.unload({ assetId: "bg_music" }).catch(() => {});

            if (!currentActiveSongPath || !gameWithSound) {
              return false;
            }

            const safePath = currentActiveSongPath.startsWith("/")
              ? currentActiveSongPath.slice(1)
              : currentActiveSongPath;
            const nativeAssetPath = safePath.startsWith("public/")
              ? safePath
              : `public/${safePath}`;

            await NativeAudio.preload({
              assetId: "bg_music",
              assetPath: nativeAssetPath,
              audioChannelNum: 1,
              channels: 1,
              isUrl: false,
            } as any);

            await NativeAudio.setVolume({
              assetId: "bg_music",
              volume: musicVolume,
            }).catch(() => {});

            await delay(200);
            await NativeAudio.play({ assetId: "bg_music" });
            return true;
          });

          setIsPlaying(shouldPlay);
        } catch (err) {
          setIsPlaying(false);
          console.warn("NativeAudio bg_music error:", err);
        }
        return;
      }

      // 🧠 web (Howler)
      const currentHowlSource = sound ? (sound as any)._src[0] : null;

      if (
        currentActiveSongPath === null ||
        currentActiveSongPath !== currentHowlSource ||
        !sound
      ) {
        // fade out old track
        if (sound) {
          sound.fade(musicVolume, 0, 1000);
          fadeTimeout = setTimeout(() => {
            sound.stop();
            sound.unload();
          }, 1000);
        }

        // fade in new track
        if (currentActiveSongPath && gameWithSound) {
          const newSound = new Howl({
            src: [currentActiveSongPath],
            loop: true,
            volume: 0,
          });
          setSound(newSound);

          newSound.play();
          newSound.fade(0, musicVolume, 1000);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      } else {
        // same track, just toggle on/off
        if (sound) {
          if (gameWithSound) {
            if (!sound.playing()) sound.play();
            sound.fade(0, musicVolume, 500);
            setIsPlaying(true);
          } else {
            sound.fade(musicVolume, 0, 500);
            setTimeout(() => sound.stop(), 500);
            setIsPlaying(false);
          }
        }
      }
    };

    playWithFade();

    return () => {
      if (isNative) {
        runNativeAudioTask(() =>
          NativeAudio.stop({ assetId: "bg_music" }).catch(() => {})
        );
        setIsPlaying(false);
      } else if (activeSoundInstance) {
        activeSoundInstance.stop();
        activeSoundInstance.unload();
      }
      clearTimeout(fadeTimeout);
    };
  }, [currentActiveSongPath, gameWithSound, musicVolume]);

  // 🔹 update volume dynamically
  useEffect(() => {
    if (isNative) {
      runNativeAudioTask(() =>
        NativeAudio.setVolume({
          assetId: "bg_music",
          volume: musicVolume,
        }).catch(() => {})
      );
    } else if (sound) {
      sound.volume(musicVolume);
    }
  }, [isNative, musicVolume, sound]);

  // 🔹 persist volume
  useEffect(() => {
    const savedVolume = localStorage.getItem(SETTINGS_MUSIC_VOLUME);
    if (savedVolume !== null) {
      setMusicVolume(JSON.parse(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_MUSIC_VOLUME, JSON.stringify(musicVolume));
  }, [musicVolume]);

  const toggleSound = () => {
    if (gameWithSound) {
      localStorage.setItem(SOUND_OFF, "true");
      setGameWithSound(false);
    } else {
      localStorage.removeItem(SOUND_OFF);
      setGameWithSound(true);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{ isPlaying, toggleSound, musicVolume, setMusicVolume }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextProps => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
