import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  SETTINGS_ANIMATION_SPEED,
  SETTINGS_LOOTBOX_TRANSITION,
  SETTINGS_SFX_VOLUME,
  SFX_ON,
} from "../constants/localStorage";
import { LOOTBOX_TRANSITION_DEFAULT } from "../constants/settings.ts";
import { Speed } from "../enums/settings.ts";

interface SettingsContextType {
  sfxOn: boolean;
  setSfxOn: (sfxOn: boolean) => void;
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
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [sfxOn, setSfxOn] = useState(true);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState<Speed>(Speed.NORMAL);
  const [lootboxTransition, setLootboxTransition] = useState(() => {
    return (
      localStorage.getItem(SETTINGS_LOOTBOX_TRANSITION) ??
      LOOTBOX_TRANSITION_DEFAULT
    );
  });

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
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_SFX_VOLUME, JSON.stringify(sfxVolume));
  }, [sfxVolume]);

  useEffect(() => {
    localStorage.setItem(SFX_ON, JSON.stringify(sfxOn));
  }, [sfxOn]);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_ANIMATION_SPEED,
      JSON.stringify(animationSpeed)
    );
  }, [animationSpeed]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_LOOTBOX_TRANSITION, lootboxTransition);
  }, [lootboxTransition]);

  return (
    <SettingsContext.Provider
      value={{
        sfxOn,
        setSfxOn,
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
