import { NativeAudio } from "@capacitor-community/native-audio";
import { Capacitor } from "@capacitor/core";
import { Howl } from "howler";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { mainMenuUrls } from "../components/Menu/useContextMenuItems";
import {
  SETTINGS_ANIMATION_SPEED,
  SETTINGS_LOOTBOX_TRANSITION,
  SETTINGS_MUSIC_VOLUME,
  SETTINGS_SFX_VOLUME,
  SOUND_OFF,
  SFX_ON,
} from "../constants/localStorage";
import { LOOTBOX_TRANSITION_DEFAULT } from "../constants/settings.ts";
import { Speed } from "../enums/settings.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { runNativeAudioTask } from "../utils/nativeAudioQueue";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

interface SettingsContextType {
  sfxOn: boolean;
  setSfxOn: (sfxOn: boolean) => void;
  musicOn: boolean;
  setMusicOn: (musicOn: boolean) => void;
  toggleMusic: () => void;
  isMusicPlaying: boolean;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;
  animationSpeed: Speed;
  setAnimationSpeed: (speed: Speed) => void;
  lootboxTransition: string;
  setLootboxTransition: (color: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
  introSongPath: string;
  baseSongPath: string;
  rageSongPath: string;
}

export const SettingsProvider = ({
  children,
  introSongPath,
  baseSongPath,
  rageSongPath,
}: SettingsProviderProps) => {
  const isNative = Capacitor.isNativePlatform();
  const [sfxOn, setSfxOn] = useState(true);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [animationSpeed, setAnimationSpeed] = useState<Speed>(Speed.NORMAL);
  const [lootboxTransition, setLootboxTransition] = useState(() => {
    return (
      localStorage.getItem(SETTINGS_LOOTBOX_TRANSITION) ??
      LOOTBOX_TRANSITION_DEFAULT
    );
  });
  const [musicOn, setMusicOnState] = useState(() => {
    return !localStorage.getItem(SOUND_OFF);
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  const [currentActiveSongPath, setCurrentActiveSongPath] = useState<
    string | null
  >(null);

  const location = useLocation();
  const { isRageRound } = useGameStore();
  const isMainMenuRoute = mainMenuUrls.includes(location.pathname);

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

  useEffect(() => {
    let activeSoundInstance: Howl | undefined = sound;
    let fadeTimeout: NodeJS.Timeout;

    const playWithFade = async () => {
      if (isNative) {
        try {
          const shouldPlay = await runNativeAudioTask(async () => {
            await NativeAudio.stop({ assetId: "bg_music" }).catch(() => {});
            await NativeAudio.unload({ assetId: "bg_music" }).catch(() => {});

            if (!currentActiveSongPath || !musicOn) {
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

          setIsMusicPlaying(shouldPlay);
        } catch (err) {
          setIsMusicPlaying(false);
          console.warn("NativeAudio bg_music error:", err);
        }
        return;
      }

      const currentHowlSource = sound ? (sound as any)._src[0] : null;

      if (
        currentActiveSongPath === null ||
        currentActiveSongPath !== currentHowlSource ||
        !sound
      ) {
        if (sound) {
          sound.fade(musicVolume, 0, 1000);
          fadeTimeout = setTimeout(() => {
            sound.stop();
            sound.unload();
          }, 1000);
        }

        if (currentActiveSongPath && musicOn) {
          const newSound = new Howl({
            src: [currentActiveSongPath],
            loop: true,
            volume: 0,
          });
          setSound(newSound);

          newSound.play();
          newSound.fade(0, musicVolume, 1000);
          setIsMusicPlaying(true);
        } else {
          setIsMusicPlaying(false);
        }
      } else if (sound) {
        if (musicOn) {
          if (!sound.playing()) sound.play();
          sound.fade(0, musicVolume, 500);
          setIsMusicPlaying(true);
        } else {
          sound.fade(musicVolume, 0, 500);
          setTimeout(() => sound.stop(), 500);
          setIsMusicPlaying(false);
        }
      }
    };

    playWithFade();

    return () => {
      if (isNative) {
        runNativeAudioTask(() =>
          NativeAudio.stop({ assetId: "bg_music" }).catch(() => {})
        );
        setIsMusicPlaying(false);
      } else if (activeSoundInstance) {
        activeSoundInstance.stop();
        activeSoundInstance.unload();
      }
      clearTimeout(fadeTimeout);
    };
  }, [currentActiveSongPath, musicOn, musicVolume, isNative]);

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

  useEffect(() => {
    const savedVolume = localStorage.getItem(SETTINGS_SFX_VOLUME);
    if (savedVolume !== null) {
      setSfxVolume(JSON.parse(savedVolume));
    }

    const savedAnimationSpeed = localStorage.getItem(SETTINGS_ANIMATION_SPEED);
    if (savedAnimationSpeed !== null) {
      setAnimationSpeed(JSON.parse(savedAnimationSpeed));
    }

    const savedSfxOn = localStorage.getItem(SFX_ON);

    if (savedSfxOn !== null) {
      setSfxOn(JSON.parse(savedSfxOn));
    }

    const savedMusicVolume = localStorage.getItem(SETTINGS_MUSIC_VOLUME);
    if (savedMusicVolume !== null) {
      setMusicVolume(JSON.parse(savedMusicVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_SFX_VOLUME, JSON.stringify(sfxVolume));
  }, [sfxVolume]);

  useEffect(() => {
    localStorage.setItem(SFX_ON, JSON.stringify(sfxOn));
  }, [sfxOn]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_MUSIC_VOLUME, JSON.stringify(musicVolume));
  }, [musicVolume]);

  useEffect(() => {
    if (musicOn) {
      localStorage.removeItem(SOUND_OFF);
    } else {
      localStorage.setItem(SOUND_OFF, "true");
    }
  }, [musicOn]);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_ANIMATION_SPEED,
      JSON.stringify(animationSpeed)
    );
  }, [animationSpeed]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_LOOTBOX_TRANSITION, lootboxTransition);
  }, [lootboxTransition]);

  const setMusicOn = (value: boolean) => {
    setMusicOnState(value);
  };

  const toggleMusic = () => {
    setMusicOnState((prev) => !prev);
  };

  return (
    <SettingsContext.Provider
      value={{
        sfxOn,
        setSfxOn,
        musicOn,
        setMusicOn,
        toggleMusic,
        isMusicPlaying,
        musicVolume,
        setMusicVolume,
        sfxVolume,
        setSfxVolume,
        animationSpeed,
        setAnimationSpeed,
        lootboxTransition,
        setLootboxTransition,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
