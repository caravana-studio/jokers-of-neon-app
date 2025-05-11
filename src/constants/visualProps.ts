import { isMobile } from "react-device-detect";
import { GlarePosition } from "react-parallax-tilt";

export const CARD_WIDTH = 115;
export const CARD_WIDTH_PX = `${CARD_WIDTH}px`;
export const CARD_HEIGHT = CARD_WIDTH * 1.52;
export const CARD_HEIGHT_PX = `${CARD_HEIGHT}px`;
export const MODIFIERS_OFFSET_X = isMobile? [-8, -16] : [-14];
export const MODIFIERS_OFFSET_Y = isMobile? [-8, -12] : [-8];
export const TILT_OPTIONS = {
  scale: 1.05,
  tiltReverse: true,
  glareEnable: true,
  glareMaxOpacity: 0.5,
  glareColor: "#ffffff",
  glarePosition: "all" as GlarePosition,
  glareBorderRadius: "10px",
  glareReverse: true
};