import { AnimatePresence, motion } from "framer-motion";
import {
  CSSProperties,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LightPillar from "../components/animations/LightPilar/LightPillar";
import Lightning from "../components/animations/Lightning/Lightning";
import { Intensity } from "../types/intensity";
import { isNativeAndroid } from "../utils/capacitorUtils";

export type LightningSection = "full" | "top" | "middle" | "bottom";
export type LightningColor = "blue" | "violet";

export interface LightningAnimationConfig {
  section?: LightningSection;
  target?: HTMLElement | null;
  padding?: number;
  areaStyle?: CSSProperties;
  durationMs?: number;
  fadeDurationMs?: number;
  xOffset?: number;
  speed?: number;
  zIndex?: number;
  color?: LightningColor;
  intensityLevel?: Intensity;
}

export interface LightPillarAnimationConfig {
  section?: LightningSection;
  target?: HTMLElement | null;
  padding?: number;
  areaStyle?: CSSProperties;
  durationMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
  topColor?: string;
  bottomColor?: string;
  rotationSpeed?: number;
  interactive?: boolean;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  pillarRotation?: number;
  intensityLevel?: Intensity;
  intensity?: number;
}

interface LightningAnimationState extends LightningAnimationConfig {
  id: number;
  targetRect?: TargetRect;
  hue: number;
  intensity: number;
  size: number;
  color: LightningColor;
  intensityLevel: Intensity;
}

interface LightPillarAnimationState
  extends Omit<LightPillarAnimationConfig, "target"> {
  id: number;
  targetRect?: TargetRect;
  intensityLevel: Intensity;
  intensity: number;
}

interface BackgroundAnimationContextValue {
  showLightningAnimation: (config?: LightningAnimationConfig) => void;
  showLightPillarAnimation: (config?: LightPillarAnimationConfig) => void;
}

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const BackgroundAnimationContext = createContext<BackgroundAnimationContextValue>(
  {
    showLightningAnimation: () => {},
    showLightPillarAnimation: () => {},
  }
);

export const useBackgroundAnimation = () =>
  useContext(BackgroundAnimationContext);

const DEFAULT_LIGHTNING_CONFIG: {
  section: LightningSection;
  durationMs: number;
  fadeDurationMs: number;
  xOffset: number;
  speed: number;
  padding: number;
  color: LightningColor;
  intensityLevel: Intensity;
} = {
  section: "full",
  durationMs: 1500,
  fadeDurationMs: 300,
  xOffset: 0,
  speed: 0.5,
  padding: 12,
  color: "blue",
  intensityLevel: Intensity.MEDIUM,
};

const DEFAULT_LIGHT_PILLAR_CONFIG: {
  section: LightningSection;
  durationMs: number;
  fadeDurationMs: number;
  padding: number;
  topColor: string;
  bottomColor: string;
  rotationSpeed: number;
  interactive: boolean;
  glowAmount: number;
  pillarWidth: number;
  pillarHeight: number;
  noiseIntensity: number;
  mixBlendMode: CSSProperties["mixBlendMode"];
  pillarRotation: number;
  intensityLevel: Intensity;
} = {
  section: "full",
  durationMs: 1000,
  fadeDurationMs: 1000,
  padding: 12,
  topColor: "#5227FF",
  bottomColor: "#FF9FFC",
  rotationSpeed: 1.5,
  interactive: false,
  glowAmount: 0.002,
  pillarWidth: 2.4,
  pillarHeight: 0.4,
  noiseIntensity: 1.5,
  mixBlendMode: "screen",
  pillarRotation: 0,
  intensityLevel: Intensity.MEDIUM,
};

const DEFAULT_Z_INDEX = 0;

const INTENSITY_PRESETS: Record<
  Intensity,
  { intensity: number; size: number }
> = {
  [Intensity.LOW]: { intensity: 0.5, size: 0.5 },
  [Intensity.MEDIUM]: { intensity: 0.8, size: 0.8 },
  [Intensity.HIGH]: { intensity: 1.5, size: 1.5 },
  [Intensity.MAX]: { intensity: 2, size: 2 },
};

const COLOR_HUES: Record<LightningColor, number> = {
  blue: 220,
  violet: 265,
};

const SECTION_STYLES: Record<LightningSection, CSSProperties> = {
  full: { top: 0, left: 0, width: "100%", height: "100%" },
  top: { top: 0, left: 0, width: "100%", height: "35%" },
  middle: { top: "35%", left: 0, width: "100%", height: "35%" },
  bottom: { top: "70%", left: 0, width: "100%", height: "30%" },
};

const baseStyle: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  overflow: "hidden",
};

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: 0,
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const buildAreaStyle = (
  state: {
    targetRect?: TargetRect;
    padding?: number;
    section?: LightningSection;
    areaStyle?: CSSProperties;
  },
  defaultSection: LightningSection,
  defaultPadding: number
): CSSProperties => {
  if (state.targetRect) {
    const padding = state.padding ?? defaultPadding;
    return {
      top: Math.max(0, state.targetRect.top - padding),
      left: Math.max(0, state.targetRect.left - padding),
      width: state.targetRect.width + padding * 2,
      height: state.targetRect.height + padding * 2,
    };
  }

  const section = state.section ?? defaultSection;
  return { ...SECTION_STYLES[section], ...(state.areaStyle ?? {}) };
};

const getDerivedLightningValues = (
  color: LightningColor,
  intensityLevel: Intensity
) => {
  const hue = COLOR_HUES[color] ?? COLOR_HUES.blue;
  const preset =
    INTENSITY_PRESETS[intensityLevel] ?? INTENSITY_PRESETS[Intensity.MEDIUM];

  return { hue, intensity: preset.intensity, size: preset.size };
};

const getIntensityPreset = (intensityLevel: Intensity) =>
  INTENSITY_PRESETS[intensityLevel] ?? INTENSITY_PRESETS[Intensity.MEDIUM];

export const BackgroundAnimationProvider = ({
  children,
}: PropsWithChildren) => {
  const disableBackgroundAnimations = isNativeAndroid;
  const [lightningAnimation, setLightningAnimation] =
    useState<LightningAnimationState | null>(null);
  const [lightPillarAnimation, setLightPillarAnimation] =
    useState<LightPillarAnimationState | null>(null);
  const lightningTimeoutRef = useRef<number | null>(null);
  const lightPillarTimeoutRef = useRef<number | null>(null);

  const clearLightningTimeout = () => {
    if (lightningTimeoutRef.current) {
      window.clearTimeout(lightningTimeoutRef.current);
      lightningTimeoutRef.current = null;
    }
  };

  const clearLightPillarTimeout = () => {
    if (lightPillarTimeoutRef.current) {
      window.clearTimeout(lightPillarTimeoutRef.current);
      lightPillarTimeoutRef.current = null;
    }
  };

  const showLightningAnimation = useCallback(
    (config: LightningAnimationConfig = {}) => {
      if (disableBackgroundAnimations) {
        return;
      }
      clearLightningTimeout();

      const rect = config.target?.getBoundingClientRect();
      const color = config.color ?? DEFAULT_LIGHTNING_CONFIG.color;
      const intensityLevel =
        config.intensityLevel ?? DEFAULT_LIGHTNING_CONFIG.intensityLevel;
      const derived = getDerivedLightningValues(color, intensityLevel);

      const nextState: LightningAnimationState = {
        ...DEFAULT_LIGHTNING_CONFIG,
        ...config,
        color,
        intensityLevel,
        ...derived,
        targetRect: rect
          ? {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          : undefined,
        id: Date.now(),
      };

      setLightningAnimation(nextState);

      lightningTimeoutRef.current = window.setTimeout(() => {
        setLightningAnimation((current) =>
          current?.id === nextState.id ? null : current
        );
        lightningTimeoutRef.current = null;
      }, nextState.durationMs ?? DEFAULT_LIGHTNING_CONFIG.durationMs);
    },
    [disableBackgroundAnimations]
  );

  const showLightPillarAnimation = useCallback(
    (config: LightPillarAnimationConfig = {}) => {
      if (disableBackgroundAnimations) {
        return;
      }
      clearLightPillarTimeout();

      const rect = config.target?.getBoundingClientRect();
      const intensityLevel =
        config.intensityLevel ?? DEFAULT_LIGHT_PILLAR_CONFIG.intensityLevel;
      const preset = getIntensityPreset(intensityLevel);

      const pillarWidth =
        (config.pillarWidth ?? DEFAULT_LIGHT_PILLAR_CONFIG.pillarWidth) *
        preset.size;
      const pillarHeight =
        (config.pillarHeight ?? DEFAULT_LIGHT_PILLAR_CONFIG.pillarHeight) *
        preset.size;

      const nextState: LightPillarAnimationState = {
        ...DEFAULT_LIGHT_PILLAR_CONFIG,
        ...config,
        pillarWidth,
        pillarHeight,
        intensityLevel,
        intensity: config.intensity ?? preset.intensity,
        targetRect: rect
          ? {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          : undefined,
        id: Date.now(),
      };

      setLightPillarAnimation(nextState);

      lightPillarTimeoutRef.current = window.setTimeout(() => {
        setLightPillarAnimation((current) =>
          current?.id === nextState.id ? null : current
        );
        lightPillarTimeoutRef.current = null;
      }, nextState.durationMs ?? DEFAULT_LIGHT_PILLAR_CONFIG.durationMs);
    },
    [disableBackgroundAnimations]
  );

  useEffect(
    () => () => {
      clearLightningTimeout();
      clearLightPillarTimeout();
    },
    []
  );

  const value = useMemo(
    () => ({
      showLightningAnimation,
      showLightPillarAnimation,
    }),
    [showLightningAnimation, showLightPillarAnimation]
  );

  return (
    <BackgroundAnimationContext.Provider value={value}>
      <div style={{ ...containerStyle, height: "100%", width: "100%" }}>
        <AnimatePresence>
          {!disableBackgroundAnimations && lightPillarAnimation && (
            <motion.div
              key={lightPillarAnimation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration:
                  (lightPillarAnimation.fadeDurationMs ??
                    DEFAULT_LIGHT_PILLAR_CONFIG.fadeDurationMs) / 1000,
              }}
              style={{
                ...baseStyle,
                ...buildAreaStyle(
                  lightPillarAnimation,
                  DEFAULT_LIGHT_PILLAR_CONFIG.section,
                  DEFAULT_LIGHT_PILLAR_CONFIG.padding
                ),
                zIndex: lightPillarAnimation.zIndex ?? DEFAULT_Z_INDEX,
                pointerEvents: lightPillarAnimation.interactive
                  ? "auto"
                  : baseStyle.pointerEvents,
              }}
            >
              <LightPillar
                topColor={lightPillarAnimation.topColor}
                bottomColor={lightPillarAnimation.bottomColor}
                intensity={lightPillarAnimation.intensity}
                rotationSpeed={lightPillarAnimation.rotationSpeed}
                interactive={lightPillarAnimation.interactive}
                glowAmount={lightPillarAnimation.glowAmount}
                pillarWidth={lightPillarAnimation.pillarWidth}
                pillarHeight={lightPillarAnimation.pillarHeight}
                noiseIntensity={lightPillarAnimation.noiseIntensity}
                mixBlendMode={lightPillarAnimation.mixBlendMode}
                pillarRotation={lightPillarAnimation.pillarRotation}
              />
            </motion.div>
          )}
          {!disableBackgroundAnimations && lightningAnimation && (
            <motion.div
              key={lightningAnimation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration:
                  (lightningAnimation.fadeDurationMs ??
                    DEFAULT_LIGHTNING_CONFIG.fadeDurationMs) / 1000,
              }}
              style={{
                ...baseStyle,
                ...buildAreaStyle(
                  lightningAnimation,
                  DEFAULT_LIGHTNING_CONFIG.section,
                  DEFAULT_LIGHTNING_CONFIG.padding
                ),
                zIndex: lightningAnimation.zIndex ?? DEFAULT_Z_INDEX,
              }}
            >
              <Lightning
                hue={lightningAnimation.hue}
                xOffset={
                  lightningAnimation.xOffset ?? DEFAULT_LIGHTNING_CONFIG.xOffset
                }
                speed={
                  lightningAnimation.speed ?? DEFAULT_LIGHTNING_CONFIG.speed
                }
                intensity={lightningAnimation.intensity}
                size={lightningAnimation.size}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ ...contentStyle, height: "100%", width: "100%" }}>
          {children}
        </div>
      </div>
    </BackgroundAnimationContext.Provider>
  );
};
