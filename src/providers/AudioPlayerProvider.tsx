import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { Howl } from "howler";
import { SETTINGS_MUSIC_VOLUME, SOUND_OFF } from "../constants/localStorage.ts";

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
  songPath: string;
}

export const AudioPlayerProvider = ({
  children,
  songPath,
}: AudioPlayerProviderProps) => {
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWithSound, setGameWithSound] = useState(
    !localStorage.getItem(SOUND_OFF)
  );
  const [musicVolume, setMusicVolume] = useState(0.2);

  useEffect(() => {
    const howl = new Howl({
      src: [songPath],
      loop: true,
      volume: musicVolume,
    });
    setSound(howl);
  }, [songPath]);

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
