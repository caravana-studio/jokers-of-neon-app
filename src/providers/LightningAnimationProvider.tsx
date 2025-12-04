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
import Lightning from "../components/animations/Lightning/Lightning";
import { Intensity } from "../types/intensity";

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

interface LightningAnimationState extends LightningAnimationConfig {
  id: number;
  targetRect?: TargetRect;
  hue: number;
  intensity: number;
  size: number;
  color: LightningColor;
  intensityLevel: Intensity;
}

interface LightningAnimationContextValue {
  showLightningAnimation: (config?: LightningAnimationConfig) => void;
}

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const LightningAnimationContext = createContext<LightningAnimationContextValue>(
  {
    showLightningAnimation: () => {},
  }
);

export const useLightningAnimation = () =>
  useContext(LightningAnimationContext);

const DEFAULT_CONFIG: {
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

const DEFAULT_Z_INDEX = 0;

const INTENSITY_PRESETS: Record<Intensity, { intensity: number; size: number }> =
  {
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
  zIndex: 0,
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const buildAreaStyle = (state: LightningAnimationState): CSSProperties => {
  if (state.targetRect) {
    const padding = state.padding ?? DEFAULT_CONFIG.padding;
    return {
      top: Math.max(0, state.targetRect.top - padding),
      left: Math.max(0, state.targetRect.left - padding),
      width: state.targetRect.width + padding * 2,
      height: state.targetRect.height + padding * 2,
    };
  }

  const section = state.section ?? DEFAULT_CONFIG.section;
  return { ...SECTION_STYLES[section], ...(state.areaStyle ?? {}) };
};

const getDerivedLightningValues = (
  color: LightningColor,
  intensityLevel: Intensity
) => {
  const hue = COLOR_HUES[color] ?? COLOR_HUES.blue;
  const preset =
    INTENSITY_PRESETS[intensityLevel] ??
    INTENSITY_PRESETS[Intensity.MEDIUM];

  return { hue, intensity: preset.intensity, size: preset.size };
};

export const LightningAnimationProvider = ({ children }: PropsWithChildren) => {
  const [animation, setAnimation] = useState<LightningAnimationState | null>(
    null
  );
  const timeoutRef = useRef<number | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const showLightningAnimation = useCallback(
    (config: LightningAnimationConfig = {}) => {
      clearExistingTimeout();

      const rect = config.target?.getBoundingClientRect();
      const color = config.color ?? DEFAULT_CONFIG.color;
      const intensityLevel = config.intensityLevel ?? DEFAULT_CONFIG.intensityLevel;
      const derived = getDerivedLightningValues(color, intensityLevel);

      const nextState: LightningAnimationState = {
        ...DEFAULT_CONFIG,
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

      setAnimation(nextState);

      timeoutRef.current = window.setTimeout(() => {
        setAnimation((current) =>
          current?.id === nextState.id ? null : current
        );
        timeoutRef.current = null;
      }, nextState.durationMs ?? DEFAULT_CONFIG.durationMs);
    },
    []
  );

  useEffect(
    () => () => {
      clearExistingTimeout();
    },
    []
  );

  const value = useMemo(
    () => ({
      showLightningAnimation,
    }),
    [showLightningAnimation]
  );

  return (
    <LightningAnimationContext.Provider value={value}>
      <div style={containerStyle}>
        <AnimatePresence>
          {animation && (
            <motion.div
              key={animation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration:
                  (animation.fadeDurationMs ?? DEFAULT_CONFIG.fadeDurationMs) /
                  1000,
              }}
              style={{
                ...baseStyle,
                ...buildAreaStyle(animation),
                zIndex: animation.zIndex ?? DEFAULT_Z_INDEX,
              }}
            >
              <Lightning
                hue={animation.hue}
                xOffset={animation.xOffset ?? DEFAULT_CONFIG.xOffset}
                speed={animation.speed ?? DEFAULT_CONFIG.speed}
                intensity={animation.intensity}
                size={animation.size}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={contentStyle}>{children}</div>
      </div>
    </LightningAnimationContext.Provider>
  );
};
