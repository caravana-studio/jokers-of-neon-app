const NEON_GREEN = "#33effa";
const NEON_PINK = "#fd4bad";

export default {
  colors: {
    neonGreen: NEON_GREEN,
    opaqueNeonGreen: "#2fcdd7",
    neonPink: NEON_PINK,
  },
  styles: {
    global: {
      body: {
        background: "#1b2838 none repeat scroll 0 0",
        margin: 0,
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "Sys",
        borderRadius: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "neonGreen",
        fontSize: 17,
        border: `3px solid ${NEON_GREEN}`,
        px: 5,
        py: 1,
        pointerEvents: "all",
        "&:hover": {
          backgroundColor: "black",
          border: `3px solid ${NEON_GREEN}`,
          boxShadow: `0px 0px 5px 0px ${NEON_GREEN}`,
        },
      },
      sizes: {
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
    },
    Heading: {
      baseStyle: {
        fontFamily: "Sys",
        filter: "blur(0.5px)",
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
      },
      sizes: {
        m: {
          fontSize: 25,
        },
        l: {
          fontSize: 40,
        },
        xl: {
          fontSize: 50,
          filter: "blur(1px)",
        },
      },
    },
  },
};
