import { Howl } from "howler";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { SETTINGS_MUSIC_VOLUME, SOUND_OFF } from "../constants/localStorage.ts";
import { useLocation } from "react-router-dom";
import { usePrevious } from "../hooks/usePrevious.tsx";
import { useGameStore } from "../state/useGameStore.ts";

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

  const prevLocationPath = usePrevious(location.pathname);

  const isHomeOrLoginRoute =
    location.pathname === "/" || location.pathname === "/login";
  const isMyGamesRoute = location.pathname === "/my-games";
  const isDemoRoute = location.pathname === "/demo";

  useEffect(() => {
    let newActiveSongPath: string;

    if (isHomeOrLoginRoute) {
      newActiveSongPath = introSongPath;
    } else if (isMyGamesRoute) {
      const navigatedFromHomeOrLogin =
        prevLocationPath === "/" || prevLocationPath === "/login";

      if (navigatedFromHomeOrLogin) {
        newActiveSongPath = introSongPath;
      } else {
        newActiveSongPath = isRageRound ? rageSongPath : baseSongPath;
      }
    } else if (isDemoRoute) {
      newActiveSongPath = isRageRound ? rageSongPath : baseSongPath;
    } else {
      newActiveSongPath = baseSongPath;
    }

    if (newActiveSongPath !== currentActiveSongPath) {
      setCurrentActiveSongPath(newActiveSongPath);
    }
  }, [
    location.pathname,
    prevLocationPath,
    isRageRound,
    introSongPath,
    baseSongPath,
    rageSongPath,
    currentActiveSongPath,
  ]);

  useEffect(() => {
    const currentHowlSource = sound ? (sound as any)._src[0] : null;

    let activeSoundInstance: Howl | undefined = sound;

    if (
      currentActiveSongPath === null ||
      currentActiveSongPath !== currentHowlSource ||
      !sound
    ) {
      if (sound) {
        sound.stop();
        sound.unload();
      }

      if (currentActiveSongPath === null) {
        activeSoundInstance = undefined;
      } else {
        const newSound = new Howl({
          src: [currentActiveSongPath],
          loop: true,
          volume: musicVolume,
        });
        activeSoundInstance = newSound;
      }

      setSound(activeSoundInstance);
    } else {
      activeSoundInstance = sound;
    }

    if (activeSoundInstance) {
      if (gameWithSound) {
        if (!activeSoundInstance.playing()) {
          activeSoundInstance.play();
        }
        setIsPlaying(true);
      } else {
        activeSoundInstance.stop();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (activeSoundInstance) {
        activeSoundInstance.stop();
        activeSoundInstance.unload();
      }
    };
  }, [currentActiveSongPath, gameWithSound, musicVolume]);

  useEffect(() => {
    if (sound) {
      sound.volume(musicVolume);
    }
  }, [musicVolume, sound]);

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
