import { Intensity } from "../../../types/intensity";

interface GalaxyIntensityConfig {
  density: number;
  glowIntensity: number;
  saturation: number;
  hueShift: number;
  twinkleIntensity: number;
  rotationSpeed: number;
  repulsionStrength: number;
  autoCenterRepulsion: number;
  starSpeed: number;
}

export const galaxyIntensityConfigs: Record<Intensity, GalaxyIntensityConfig> = {
  [Intensity.LOW]: {
    density: 0.5,
    glowIntensity: 0.3,
    saturation: 0.3,
    hueShift: 160,
    twinkleIntensity: 0,
    rotationSpeed: 0.1,
    repulsionStrength: 0,
    autoCenterRepulsion: 0,
    starSpeed: 0.6
  },
  [Intensity.MEDIUM]: {
    density: 1,
    glowIntensity: 0.4,
    saturation: 0.6,
    hueShift: 160,
    twinkleIntensity: 0,
    rotationSpeed: 0.1,
    repulsionStrength: 0,
    autoCenterRepulsion: 0,
    starSpeed: 0.8
  },
  [Intensity.HIGH]: {
    density: 1.2,
    glowIntensity: 0.8,
    saturation: 0.8,
    hueShift: 160,
    twinkleIntensity: 0,
    rotationSpeed: 0.2,
    repulsionStrength: 0,
    autoCenterRepulsion: 0,
    starSpeed: 1
  },
  [Intensity.MAX]: {
    density: 1.8,
    glowIntensity: 1.2,
    saturation: 1,
    hueShift: 160,
    twinkleIntensity: 0,
    rotationSpeed: 0.2,
    repulsionStrength: 0,
    autoCenterRepulsion: 0,
    starSpeed: 1.5
  }
};