import { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { motion } from "motion/react";
import { NEON } from "../theme/colors";

export type GlowBadgeIntensity = "low" | "medium" | "high" | "max" | "ultra";

type GlowBadgeProps = {
  label: string;
  background: string;
  glowColor: string;
  intensity?: GlowBadgeIntensity;
  reduceMotion?: boolean;
  style?: CSSProperties;
  textTransform?: CSSProperties["textTransform"];
};

const INTENSITY_STYLES: Record<GlowBadgeIntensity, {
  baseBlur: number;
  baseSpread: number;
  baseAlpha: number;
  pulseBlur: number;
  pulseSpread: number;
  pulseAlpha: number;
}> = {
  low: { baseBlur: 5, baseSpread: 1, baseAlpha: 0.4, pulseBlur: 3, pulseSpread: 1, pulseAlpha: 0.2 },
  medium: { baseBlur: 8, baseSpread: 4, baseAlpha: 0.85, pulseBlur: 4, pulseSpread: 2, pulseAlpha: 0.35 },
  high: { baseBlur: 12, baseSpread: 6, baseAlpha: 0.8, pulseBlur: 6, pulseSpread: 3, pulseAlpha: 0.45 },
  max: { baseBlur: 16, baseSpread: 8, baseAlpha: 0.9, pulseBlur: 8, pulseSpread: 4, pulseAlpha: 0.55 },
  ultra: { baseBlur: 20, baseSpread: 10, baseAlpha: 0.95, pulseBlur: 10, pulseSpread: 5, pulseAlpha: 0.65 },
};

const clampAlpha = (alpha: number) => Math.max(0, Math.min(1, alpha));

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) {
    return `rgba(0, 0, 0, ${clampAlpha(alpha)})`;
  }
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${clampAlpha(alpha)})`;
};

export const GlowBadge = ({
  label,
  background,
  glowColor,
  intensity = "medium",
  reduceMotion,
  style,
  textTransform = "capitalize",
}: GlowBadgeProps) => {
  const prefersReducedMotion = useReducedMotion();
  const resolvedReduceMotion = reduceMotion ?? prefersReducedMotion ?? false;
  const { baseBlur, baseSpread, baseAlpha, pulseBlur, pulseSpread, pulseAlpha } =
    INTENSITY_STYLES[intensity];
  const baseShadow = `0 0 ${baseBlur}px ${baseSpread}px ${hexToRgba(
    glowColor,
    baseAlpha
  )}`;
  const pulseShadow = `0 0 ${pulseBlur}px ${pulseSpread}px ${hexToRgba(
    glowColor,
    pulseAlpha
  )}`;

  return (
    <motion.div
      style={{
        padding: "4px 12px",
        background,
        color: NEON,
        fontSize: 12,
        letterSpacing: 0.6,
        fontWeight: 700,
        textTransform,
        borderRadius: 999,
        boxShadow: baseShadow,
        pointerEvents: "none",
        fontFamily: "'Sonara', sans-serif",
        lineHeight: 1.2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      animate={
        resolvedReduceMotion
          ? undefined
          : {
              boxShadow: [baseShadow, pulseShadow, baseShadow],
            }
      }
      transition={
        resolvedReduceMotion
          ? undefined
          : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      {label}
    </motion.div>
  );
};
