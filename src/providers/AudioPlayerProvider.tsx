import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { Howl } from "howler";
import { SETTINGS_MUSIC_VOLUME, SOUND_OFF } from "../constants/localStorage.ts";
import { useGameContext } from "./GameProvider.tsx";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  const [isInMenu, setIsInMenu] = useState(location.pathname === "/");
  const [musicVolume, setMusicVolume] = useState(0.2);
  const { isRageRound } = useGameContext();

  useEffect(() => {
    setIsInMenu(location.pathname === "/");
  }, [location.pathname]);

  useEffect(() => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    const newSound = new Howl({
      src: [
        isInMenu ? introSongPath : isRageRound ? rageSongPath : baseSongPath,
      ],
      loop: true,
      volume: musicVolume,
    });

    if (sound) sound.stop();

    setSound(newSound);

    if (gameWithSound) {
      newSound.play();
      setIsPlaying(true);
    }

    return () => {
      newSound.stop();
      newSound.unload();
    };
  }, [isRageRound, baseSongPath, rageSongPath, isInMenu]);

  useEffect(() => {
    if (sound) {
      if (gameWithSound) {
        sound.play();
        setIsPlaying(true);
      }
    }
  }, [sound]);

  useEffect(() => {
    if (sound) {
      if (gameWithSound) {
        sound.play();
        setIsPlaying(true);
      } else {
        sound.stop();
        setIsPlaying(false);
      }
    }
  }, [gameWithSound]);

  useEffect(() => {
    if (sound) {
      sound.volume(musicVolume);
    }
  }, [musicVolume, sound]);

  const toggleSound = () => {
    if (gameWithSound) {
      localStorage.setItem(SOUND_OFF, "true");
      setGameWithSound(false);
    } else {
      localStorage.removeItem(SOUND_OFF);
      setGameWithSound(true);
    }
  };

  useEffect(() => {
    const savedVolume = localStorage.getItem(SETTINGS_MUSIC_VOLUME);
    if (savedVolume !== null) {
      setMusicVolume(JSON.parse(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_MUSIC_VOLUME, JSON.stringify(musicVolume));
  }, [musicVolume]);

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
