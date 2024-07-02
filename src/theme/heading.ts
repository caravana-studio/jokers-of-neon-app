import { NEON_GREEN, NEON_PINK } from "./colors";

export const headingTheme = {
  baseStyle: {
    fontFamily: "Orbitron",
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
    xl: {
      fontSize: { base: 20, sm: 25, md: 35, lg: 40 },
      fontFamily: "Oxanium",
      fontWeight: 400,
      letterSpacing: '0.25em',
    },
    l: { fontSize: { base: 20, sm: 25, md: 38, lg: 45 } },
    m: { fontSize: { base: 14, sm: 17, md: 20, lg: 25 } },
    s: { fontSize: { base: 11, sm: 13, md: 15, lg: 17 }, 
    letterSpacing: '0.15em', },
  },
  defaultProps: {
    size: "m",
  },
};
