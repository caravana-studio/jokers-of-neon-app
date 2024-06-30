import { NEON_GREEN } from "./colors";

export default {
  baseStyle: {
    fontFamily: "Sys",
    borderRadius: 0,
    fontSize: { base: 12, md: 17 },
    px: 5,
    py: 1,
    pointerEvents: "all",
    backgroundColor: "neonGreen",
    color: "neonGreen",
  },
  variants: {
    outline: {
      backgroundColor: "rgba(0,0,0,0.5)",
      border: `3px solid ${NEON_GREEN} !important`,
      color: "neonGreen",
      "&:hover": {
        backgroundColor: "black",
        border: `3px solid ${NEON_GREEN}`,
        boxShadow: `0px 0px 5px 0px ${NEON_GREEN}`,
      },
    },
  },
  sizes: {
    m: {
      fontSize: { base: 14, md: 17 },
      px: { base: 3, md: 5 },
      py: { base: 0, md: 1 },
    },
    l: {
      fontSize: 40,
      px: 90,
      py: 2,
      borderRadius: 0,
      filter: "blur(1px)",
      textShadow: `0 0 20px ${NEON_GREEN}`,
      boxShadow: `0px 0px 15px 0px ${NEON_GREEN} `,
    },
  },
};
