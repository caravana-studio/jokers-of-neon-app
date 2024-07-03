import { NEON_GREEN, NEON_PINK } from "./colors";

export const textTheme = {
  baseStyle: {
    fontFamily: "Oxanium",
    color: "white",
  },
  variants: {
    neonGreen: {
      color: NEON_GREEN,
    },
    neonPink: {
      color: NEON_PINK,
    },
    underlined: {
      textDecoration:"underline",
      textUnderlineOffset:"8px"
    }
  },
  sizes: {
    xl: { fontSize: { base: 14, sm: 20, md: 24, lg: 30 }, fontWeight: 600 },
    l: { fontSize: { base: 10, sm: 16, md: 19, lg: 24 } },
    m: { fontSize: { base: 10, sm: 12, md: 14, lg: 18 } },
    s: { fontSize: { base: 8, sm: 11, md: 15, lg: 17 }},
  },
  defaultProps: {
    size: "m",
  },
};
