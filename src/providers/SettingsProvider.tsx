import { NativeAudio } from "@capacitor-community/native-audio";
import { App } from "@capacitor/app";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { Howl } from "howler";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { mainMenuUrls } from "../components/Menu/useContextMenuItems";
import {
  getUserPreferences,
  patchUserPreferences,
  UserPreferences,
  UserPreferencesPatch,
} from "../api/userPreferences";
import { LOOTBOX_TRANSITION_DEFAULT } from "../constants/settings.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { Speed } from "../enums/settings.ts";
import i18n from "../i18n.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { runNativeAudioTask } from "../utils/nativeAudioQueue";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const toWebAssetPath = (path: string) => {
  const sanitized = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${sanitized}`;
};

const getHowlSource = (sound?: Howl) => {
  if (!sound) return null;
  const src = (sound as any)._src;
  if (!src) return null;
  return Array.isArray(src) ? src[0] : src;
};

const SOUND_VOLUME_MAX = 1;
const MUSIC_VOLUME_MAX = 0.4;
const API_VOLUME_MAX = 100;
const VOLUME_DEBOUNCE_MS = 300;

const DEFAULT_SOUND_VOLUME = SOUND_VOLUME_MAX;
const DEFAULT_MUSIC_VOLUME = 0.2;

const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const getDefaultTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

const normalizeLanguageValue = (
  value?: string | null,
  fallback: string = "en"
): string => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("pt")) return "pt";
  if (normalized.startsWith("en")) return "en";
  return fallback;
};

const getDefaultLanguage = (): string => {
  const detected = i18n.resolvedLanguage ?? i18n.language;
  return normalizeLanguageValue(detected, "en");
};

const normalizeNumber = (value: unknown, fallback: number): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const normalizeString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const LOOTBOX_TRANSITION_VALUES = new Set(["white", "black"]);

const normalizeLootboxTransition = (
  value: unknown,
  fallback: string
): string => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return fallback;
  if (LOOTBOX_TRANSITION_VALUES.has(normalized)) return normalized;
  return fallback;
};

const normalizeTimezone = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const normalizeSpeed = (value: unknown, fallback: Speed): Speed => {
  const normalized =
    typeof value === "string" ? value.toUpperCase() : value;
  if (normalized === Speed.NORMAL) return Speed.NORMAL;
  if (normalized === Speed.FAST) return Speed.FAST;
  if (normalized === Speed.FASTEST) return Speed.FASTEST;
  return fallback;
};

const parseSoundVolumeFromApi = (
  value: unknown,
  fallback: number
): number => {
  const parsed = normalizeNumber(value, fallback);
  if (parsed <= SOUND_VOLUME_MAX) {
    return clampNumber(parsed, 0, SOUND_VOLUME_MAX);
  }
  return clampNumber(
    (Math.min(parsed, API_VOLUME_MAX) / API_VOLUME_MAX) * SOUND_VOLUME_MAX,
    0,
    SOUND_VOLUME_MAX
  );
};

const parseMusicVolumeFromApi = (
  value: unknown,
  fallback: number
): number => {
  const parsed = normalizeNumber(value, fallback);
  if (parsed <= MUSIC_VOLUME_MAX) {
    return clampNumber(parsed, 0, MUSIC_VOLUME_MAX);
  }
  return clampNumber(
    (Math.min(parsed, API_VOLUME_MAX) / API_VOLUME_MAX) * MUSIC_VOLUME_MAX,
    0,
    MUSIC_VOLUME_MAX
  );
};

const toApiSoundVolume = (value: number): number =>
  Math.round(
    (clampNumber(value, 0, SOUND_VOLUME_MAX) / SOUND_VOLUME_MAX) *
      API_VOLUME_MAX
  );

const toApiMusicVolume = (value: number): number =>
  Math.round(
    (clampNumber(value, 0, MUSIC_VOLUME_MAX) / MUSIC_VOLUME_MAX) *
      API_VOLUME_MAX
  );

const buildDefaultPreferences = (): UserPreferences => ({
  push_daily_missions_enabled: false,
  push_reminders_enabled: true,
  push_events_enabled: true,
  push_daily_packs_enabled: true,
  push_extra1_enabled: true,
  push_extra2_enabled: true,
  timezone: getDefaultTimezone(),
  language: getDefaultLanguage(),
  sound_volume: DEFAULT_SOUND_VOLUME,
  music_volume: DEFAULT_MUSIC_VOLUME,
  animation_speed: Speed.NORMAL,
  loot_box_transition: LOOTBOX_TRANSITION_DEFAULT,
});
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
  pushDailyMissionsEnabled: boolean;
  setPushDailyMissionsEnabled: (value: boolean) => void;
  pushRemindersEnabled: boolean;
  setPushRemindersEnabled: (value: boolean) => void;
  pushEventsEnabled: boolean;
  setPushEventsEnabled: (value: boolean) => void;
  pushDailyPacksEnabled: boolean;
  setPushDailyPacksEnabled: (value: boolean) => void;
  pushExtra1Enabled: boolean;
  setPushExtra1Enabled: (value: boolean) => void;
  pushExtra2Enabled: boolean;
  setPushExtra2Enabled: (value: boolean) => void;
  timezone: string;
  setTimezone: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  updateSettings: (patch: UserPreferencesPatch) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useOptionalSettings = () => useContext(SettingsContext);

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
  const defaultPreferences = useMemo(() => buildDefaultPreferences(), []);
  const lastSfxVolumeRef = useRef(defaultPreferences.sound_volume);
  const lastMusicVolumeRef = useRef(defaultPreferences.music_volume);

  const [sfxVolume, setSfxVolumeState] = useState(
    defaultPreferences.sound_volume
  );
  const [sfxOn, setSfxOnState] = useState(
    defaultPreferences.sound_volume > 0
  );
  const [musicVolume, setMusicVolumeState] = useState(
    defaultPreferences.music_volume
  );
  const [musicOn, setMusicOnState] = useState(
    defaultPreferences.music_volume > 0
  );
  const [animationSpeed, setAnimationSpeedState] = useState<Speed>(
    Speed.NORMAL
  );
  const [lootboxTransition, setLootboxTransitionState] = useState(
    defaultPreferences.loot_box_transition
  );
  const [pushDailyMissionsEnabled, setPushDailyMissionsEnabledState] =
    useState(defaultPreferences.push_daily_missions_enabled);
  const [pushRemindersEnabled, setPushRemindersEnabledState] = useState(
    defaultPreferences.push_reminders_enabled
  );
  const [pushEventsEnabled, setPushEventsEnabledState] = useState(
    defaultPreferences.push_events_enabled
  );
  const [pushDailyPacksEnabled, setPushDailyPacksEnabledState] = useState(
    defaultPreferences.push_daily_packs_enabled
  );
  const [pushExtra1Enabled, setPushExtra1EnabledState] = useState(
    defaultPreferences.push_extra1_enabled
  );
  const [pushExtra2Enabled, setPushExtra2EnabledState] = useState(
    defaultPreferences.push_extra2_enabled
  );
  const [timezone, setTimezoneState] = useState(
    defaultPreferences.timezone
  );
  const [language, setLanguageState] = useState(
    defaultPreferences.language
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  const [nativePlaybackKey, setNativePlaybackKey] = useState(0);
  const [currentActiveSongPath, setCurrentActiveSongPath] = useState<
    string | null
  >(null);
  const sfxDebounceTimerRef = useRef<number | null>(null);
  const musicDebounceTimerRef = useRef<number | null>(null);

  const location = useLocation();
  const {
    account: { account: dojoAccount },
  } = useDojo();
  const walletAddress = dojoAccount.address;
  const { isRageRound } = useGameStore();
  const isMainMenuRoute = mainMenuUrls.includes(location.pathname);

  const applyPreferences = useCallback(
    (preferences: UserPreferences) => {
      const soundVolume = parseSoundVolumeFromApi(
        preferences.sound_volume,
        defaultPreferences.sound_volume
      );
      const musicVolume = parseMusicVolumeFromApi(
        preferences.music_volume,
        defaultPreferences.music_volume
      );
      const animation = normalizeSpeed(
        preferences.animation_speed,
        Speed.NORMAL
      );
      const transition = normalizeLootboxTransition(
        preferences.loot_box_transition,
        defaultPreferences.loot_box_transition
      );
      const timezoneValue = normalizeTimezone(
        preferences.timezone,
        defaultPreferences.timezone
      );
      const languageValue = normalizeLanguageValue(
        preferences.language,
        defaultPreferences.language
      );

      setSfxVolumeState(soundVolume);
      setSfxOnState(soundVolume > 0);
      if (soundVolume > 0) {
        lastSfxVolumeRef.current = soundVolume;
      }

      setMusicVolumeState(musicVolume);
      setMusicOnState(musicVolume > 0);
      if (musicVolume > 0) {
        lastMusicVolumeRef.current = musicVolume;
      }

      setAnimationSpeedState(animation);
      setLootboxTransitionState(transition);

      setPushDailyMissionsEnabledState(
        normalizeBoolean(
          preferences.push_daily_missions_enabled,
          defaultPreferences.push_daily_missions_enabled
        )
      );
      setPushRemindersEnabledState(
        normalizeBoolean(
          preferences.push_reminders_enabled,
          defaultPreferences.push_reminders_enabled
        )
      );
      setPushEventsEnabledState(
        normalizeBoolean(
          preferences.push_events_enabled,
          defaultPreferences.push_events_enabled
        )
      );
      setPushDailyPacksEnabledState(
        normalizeBoolean(
          preferences.push_daily_packs_enabled,
          defaultPreferences.push_daily_packs_enabled
        )
      );
      setPushExtra1EnabledState(
        normalizeBoolean(
          preferences.push_extra1_enabled,
          defaultPreferences.push_extra1_enabled
        )
      );
      setPushExtra2EnabledState(
        normalizeBoolean(
          preferences.push_extra2_enabled,
          defaultPreferences.push_extra2_enabled
        )
      );
      setTimezoneState(timezoneValue);
      setLanguageState(languageValue);
    },
    [defaultPreferences]
  );

  const sanitizePatch = useCallback(
    (patch: UserPreferencesPatch): UserPreferencesPatch => {
      const sanitized: UserPreferencesPatch = {};

      if (patch.sound_volume !== undefined) {
        const volume = normalizeNumber(
          patch.sound_volume,
          defaultPreferences.sound_volume
        );
        sanitized.sound_volume = clampNumber(volume, 0, SOUND_VOLUME_MAX);
      }
      if (patch.music_volume !== undefined) {
        const volume = normalizeNumber(
          patch.music_volume,
          defaultPreferences.music_volume
        );
        sanitized.music_volume = clampNumber(volume, 0, MUSIC_VOLUME_MAX);
      }
      if (patch.animation_speed !== undefined) {
        sanitized.animation_speed = normalizeSpeed(
          patch.animation_speed,
          Speed.NORMAL
        );
      }
      if (patch.loot_box_transition !== undefined) {
        sanitized.loot_box_transition = normalizeLootboxTransition(
          patch.loot_box_transition,
          defaultPreferences.loot_box_transition
        );
      }
      if (patch.timezone !== undefined) {
        sanitized.timezone = normalizeTimezone(
          patch.timezone,
          defaultPreferences.timezone
        );
      }
      if (patch.language !== undefined) {
        sanitized.language = normalizeLanguageValue(
          patch.language,
          defaultPreferences.language
        );
      }

      if (patch.push_daily_missions_enabled !== undefined) {
        sanitized.push_daily_missions_enabled = normalizeBoolean(
          patch.push_daily_missions_enabled,
          defaultPreferences.push_daily_missions_enabled
        );
      }
      if (patch.push_reminders_enabled !== undefined) {
        sanitized.push_reminders_enabled = normalizeBoolean(
          patch.push_reminders_enabled,
          defaultPreferences.push_reminders_enabled
        );
      }
      if (patch.push_events_enabled !== undefined) {
        sanitized.push_events_enabled = normalizeBoolean(
          patch.push_events_enabled,
          defaultPreferences.push_events_enabled
        );
      }
      if (patch.push_daily_packs_enabled !== undefined) {
        sanitized.push_daily_packs_enabled = normalizeBoolean(
          patch.push_daily_packs_enabled,
          defaultPreferences.push_daily_packs_enabled
        );
      }
      if (patch.push_extra1_enabled !== undefined) {
        sanitized.push_extra1_enabled = normalizeBoolean(
          patch.push_extra1_enabled,
          defaultPreferences.push_extra1_enabled
        );
      }
      if (patch.push_extra2_enabled !== undefined) {
        sanitized.push_extra2_enabled = normalizeBoolean(
          patch.push_extra2_enabled,
          defaultPreferences.push_extra2_enabled
        );
      }

      return sanitized;
    },
    [defaultPreferences]
  );

  const toApiPatch = useCallback(
    (patch: UserPreferencesPatch): UserPreferencesPatch => {
      const apiPatch: UserPreferencesPatch = { ...patch };
      if (patch.sound_volume !== undefined) {
        apiPatch.sound_volume = toApiSoundVolume(patch.sound_volume);
      }
      if (patch.music_volume !== undefined) {
        apiPatch.music_volume = toApiMusicVolume(patch.music_volume);
      }
      return apiPatch;
    },
    []
  );

  const toApiPreferences = useCallback(
    (preferences: UserPreferences): UserPreferences => ({
      ...preferences,
      sound_volume: toApiSoundVolume(preferences.sound_volume),
      music_volume: toApiMusicVolume(preferences.music_volume),
    }),
    []
  );

  const scheduleSettingsPatch = useCallback(
    (
      patch: UserPreferencesPatch,
      timerRef: React.MutableRefObject<number | null>
    ) => {
      if (!walletAddress || Object.keys(patch).length === 0) return;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(async () => {
        try {
          await patchUserPreferences(walletAddress, toApiPatch(patch));
        } catch (error) {
          console.warn(
            "SettingsProvider: failed to update preferences",
            error
          );
        } finally {
          timerRef.current = null;
        }
      }, VOLUME_DEBOUNCE_MS);
    },
    [toApiPatch, walletAddress]
  );

  const applyPatchToState = useCallback(
    (patch: UserPreferencesPatch) => {
      if (patch.sound_volume !== undefined) {
        const volume = clampNumber(
          normalizeNumber(
            patch.sound_volume,
            defaultPreferences.sound_volume
          ),
          0,
          SOUND_VOLUME_MAX
        );
        setSfxVolumeState(volume);
        setSfxOnState(volume > 0);
        if (volume > 0) {
          lastSfxVolumeRef.current = volume;
        }
      }

      if (patch.music_volume !== undefined) {
        const volume = clampNumber(
          normalizeNumber(
            patch.music_volume,
            defaultPreferences.music_volume
          ),
          0,
          MUSIC_VOLUME_MAX
        );
        setMusicVolumeState(volume);
        setMusicOnState(volume > 0);
        if (volume > 0) {
          lastMusicVolumeRef.current = volume;
        }
      }

      if (patch.animation_speed !== undefined) {
        setAnimationSpeedState(
          normalizeSpeed(patch.animation_speed, Speed.NORMAL)
        );
      }

      if (patch.loot_box_transition !== undefined) {
        setLootboxTransitionState(
          normalizeLootboxTransition(
            patch.loot_box_transition,
            defaultPreferences.loot_box_transition
          )
        );
      }

      if (patch.push_daily_missions_enabled !== undefined) {
        setPushDailyMissionsEnabledState(
          normalizeBoolean(
            patch.push_daily_missions_enabled,
            defaultPreferences.push_daily_missions_enabled
          )
        );
      }
      if (patch.push_reminders_enabled !== undefined) {
        setPushRemindersEnabledState(
          normalizeBoolean(
            patch.push_reminders_enabled,
            defaultPreferences.push_reminders_enabled
          )
        );
      }
      if (patch.push_events_enabled !== undefined) {
        setPushEventsEnabledState(
          normalizeBoolean(
            patch.push_events_enabled,
            defaultPreferences.push_events_enabled
          )
        );
      }
      if (patch.push_daily_packs_enabled !== undefined) {
        setPushDailyPacksEnabledState(
          normalizeBoolean(
            patch.push_daily_packs_enabled,
            defaultPreferences.push_daily_packs_enabled
          )
        );
      }
      if (patch.push_extra1_enabled !== undefined) {
        setPushExtra1EnabledState(
          normalizeBoolean(
            patch.push_extra1_enabled,
            defaultPreferences.push_extra1_enabled
          )
        );
      }
      if (patch.push_extra2_enabled !== undefined) {
        setPushExtra2EnabledState(
          normalizeBoolean(
            patch.push_extra2_enabled,
            defaultPreferences.push_extra2_enabled
          )
        );
      }

      if (patch.timezone !== undefined) {
        setTimezoneState(
          normalizeTimezone(patch.timezone, defaultPreferences.timezone)
        );
      }
      if (patch.language !== undefined) {
        setLanguageState(
          normalizeLanguageValue(
            patch.language,
            defaultPreferences.language
          )
        );
      }
    },
    [defaultPreferences]
  );

  const updateSettings = useCallback(
    async (patch: UserPreferencesPatch) => {
      const sanitizedPatch = sanitizePatch(patch);
      if (Object.keys(sanitizedPatch).length === 0) return;
      if (sanitizedPatch.sound_volume !== undefined) {
        if (sfxDebounceTimerRef.current !== null) {
          window.clearTimeout(sfxDebounceTimerRef.current);
          sfxDebounceTimerRef.current = null;
        }
      }
      if (sanitizedPatch.music_volume !== undefined) {
        if (musicDebounceTimerRef.current !== null) {
          window.clearTimeout(musicDebounceTimerRef.current);
          musicDebounceTimerRef.current = null;
        }
      }
      applyPatchToState(sanitizedPatch);
      if (!walletAddress) {
        console.warn("SettingsProvider: missing wallet for preferences update");
        return;
      }
      try {
        await patchUserPreferences(walletAddress, toApiPatch(sanitizedPatch));
      } catch (error) {
        console.warn("SettingsProvider: failed to update preferences", error);
      }
    },
    [
      applyPatchToState,
      sanitizePatch,
      toApiPatch,
      walletAddress,
      sfxDebounceTimerRef,
      musicDebounceTimerRef,
    ]
  );

  useEffect(() => {
    let isActive = true;

    const loadPreferences = async () => {
      try {
        if (!walletAddress) return;
        const preferences = await getUserPreferences(walletAddress);
        if (!isActive) return;

        if (!preferences) {
          const created = await patchUserPreferences(
            walletAddress,
            toApiPreferences(defaultPreferences)
          );
          if (!isActive) return;
          applyPreferences(created ?? defaultPreferences);
          return;
        }

        applyPreferences(preferences);
      } catch (error) {
        console.warn("SettingsProvider: failed to load preferences", error);
        applyPreferences(defaultPreferences);
      }
    };

    loadPreferences();

    return () => {
      isActive = false;
    };
  }, [applyPreferences, defaultPreferences, toApiPreferences, walletAddress]);

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

      const resolvedSongPath = currentActiveSongPath
        ? toWebAssetPath(currentActiveSongPath)
        : null;
      const currentHowlSource = getHowlSource(sound);

      if (
        resolvedSongPath === null ||
        resolvedSongPath !== currentHowlSource ||
        !sound
      ) {
        if (sound) {
          sound.fade(musicVolume, 0, 1000);
          fadeTimeout = setTimeout(() => {
            sound.stop();
            sound.unload();
          }, 1000);
        }

        if (resolvedSongPath && musicOn) {
          const newSound = new Howl({
            src: [resolvedSongPath],
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
  }, [
    currentActiveSongPath,
    musicOn,
    musicVolume,
    isNative,
    nativePlaybackKey,
    sound,
  ]);

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
    if (!isNative) return;

    let pauseHandle: PluginListenerHandle | undefined;
    let resumeHandle: PluginListenerHandle | undefined;

    const registerListeners = async () => {
      pauseHandle = await App.addListener("pause", async () => {
        await runNativeAudioTask(() =>
          NativeAudio.stop({ assetId: "bg_music" }).catch(() => {})
        );
        setIsMusicPlaying(false);
      });

      resumeHandle = await App.addListener("resume", () => {
        if (!musicOn || !currentActiveSongPath) return;
        setNativePlaybackKey((key) => key + 1);
      });
    };

    registerListeners();

    return () => {
      pauseHandle?.remove();
      resumeHandle?.remove();
    };
  }, [isNative, musicOn, currentActiveSongPath]);

  useEffect(() => {
    if (!language) return;
    i18n.changeLanguage(language).catch((error: Error) => {
      console.warn("SettingsProvider: failed to change language", error);
    });
  }, [language]);

  const setSfxOn = useCallback(
    (value: boolean) => {
      const nextVolume = value
        ? lastSfxVolumeRef.current > 0
          ? lastSfxVolumeRef.current
          : defaultPreferences.sound_volume
        : 0;
      updateSettings({ sound_volume: nextVolume });
    },
    [defaultPreferences.sound_volume, updateSettings]
  );

  const setSfxVolume = useCallback(
    (vol: number) => {
      const sanitizedPatch = sanitizePatch({ sound_volume: vol });
      if (Object.keys(sanitizedPatch).length === 0) return;
      applyPatchToState(sanitizedPatch);
      scheduleSettingsPatch(sanitizedPatch, sfxDebounceTimerRef);
    },
    [applyPatchToState, sanitizePatch, scheduleSettingsPatch]
  );

  const setMusicOn = useCallback(
    (value: boolean) => {
      const nextVolume = value
        ? lastMusicVolumeRef.current > 0
          ? lastMusicVolumeRef.current
          : defaultPreferences.music_volume
        : 0;
      updateSettings({ music_volume: nextVolume });
    },
    [defaultPreferences.music_volume, updateSettings]
  );

  const toggleMusic = useCallback(() => {
    setMusicOn(!musicOn);
  }, [musicOn, setMusicOn]);

  const setMusicVolume = useCallback(
    (vol: number) => {
      const sanitizedPatch = sanitizePatch({ music_volume: vol });
      if (Object.keys(sanitizedPatch).length === 0) return;
      applyPatchToState(sanitizedPatch);
      scheduleSettingsPatch(sanitizedPatch, musicDebounceTimerRef);
    },
    [applyPatchToState, sanitizePatch, scheduleSettingsPatch]
  );

  const setAnimationSpeed = useCallback(
    (speed: Speed) => {
      updateSettings({ animation_speed: speed });
    },
    [updateSettings]
  );

  const setLootboxTransition = useCallback(
    (value: string) => {
      updateSettings({ loot_box_transition: value });
    },
    [updateSettings]
  );

  const setPushDailyMissionsEnabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_daily_missions_enabled: value });
    },
    [updateSettings]
  );

  const setPushRemindersEnabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_reminders_enabled: value });
    },
    [updateSettings]
  );

  const setPushEventsEnabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_events_enabled: value });
    },
    [updateSettings]
  );

  const setPushDailyPacksEnabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_daily_packs_enabled: value });
    },
    [updateSettings]
  );

  const setPushExtra1Enabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_extra1_enabled: value });
    },
    [updateSettings]
  );

  const setPushExtra2Enabled = useCallback(
    (value: boolean) => {
      updateSettings({ push_extra2_enabled: value });
    },
    [updateSettings]
  );

  const setTimezone = useCallback(
    (value: string) => {
      updateSettings({ timezone: value });
    },
    [updateSettings]
  );

  const setLanguage = useCallback(
    (value: string) => {
      updateSettings({ language: value });
    },
    [updateSettings]
  );

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
        pushDailyMissionsEnabled,
        setPushDailyMissionsEnabled,
        pushRemindersEnabled,
        setPushRemindersEnabled,
        pushEventsEnabled,
        setPushEventsEnabled,
        pushDailyPacksEnabled,
        setPushDailyPacksEnabled,
        pushExtra1Enabled,
        setPushExtra1Enabled,
        pushExtra2Enabled,
        setPushExtra2Enabled,
        timezone,
        setTimezone,
        language,
        setLanguage,
        updateSettings,
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
