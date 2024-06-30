import { NEON_GREEN, NEON_PINK } from "./colors";

export const headingTheme = {
  baseStyle: {
    fontFamily: "Sys",
    color: "white",
  },
  variants: {
    neonGreen: {
      color: NEON_GREEN,
      textShadow: `0 0 3px ${NEON_GREEN}`,
    },
    neonWhite: {
      textShadow: `0 0 20px ${NEON_PINK}`,
    },
    neonPink: {
      color: NEON_PINK,
      textShadow: `0 0 20px ${NEON_PINK}`,
    },
  },
  sizes: {
    xxl: { fontSize: { base: 40, sm: 50, md: 65, lg: 80 } },
    xl: { fontSize: { base: 25, sm: 30, md: 42, lg: 50 } },
    l: { fontSize: { base: 20, sm: 25, md: 32, lg: 40} },
    m: { fontSize: { base: 14, sm: 17, md: 20, lg: 25 } },
    s: { fontSize: { base: 11, sm: 13, md: 15, lg: 17 } },
  },
  defaultProps: {
    size: "m",
  },
};
