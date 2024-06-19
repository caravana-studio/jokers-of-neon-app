import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import button from "./button";
import { NEON_GREEN, NEON_PINK } from "./colors";
import { modalTheme } from "./modal";
import { tableTheme } from "./table";
import { tooltipTheme } from "./tooltip";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    color: "#555",
    fontSize: 30,
    borderRadius: 0,
    py: 7,
    px: 7,
  },
});

const inputTheme = defineMultiStyleConfig({ baseStyle });

export default {
  colors: {
    neonGreen: NEON_GREEN,
    opaqueNeonGreen: "#2fcdd7",
    neonPink: NEON_PINK,
    limeGreen: "lime",
    darkGrey: "#04162d",
    // suits
    1: "#278757",
    2: "#346090",
    3: "#b8202b",
    4: "#7e3073",
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
    Table: tableTheme,
    Button: button,
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
        neonPink: {
          color: NEON_PINK,
          textShadow: `0 0 20px ${NEON_PINK}`,
        },
      },
      sizes: {
        s: {
          fontSize: 17,
        },
        m: {
          fontSize: 25,
        },
        l: {
          fontSize: 40,
          filter: "blur(1px)",
        },
        xl: {
          fontSize: 50,
          filter: "blur(1px)",
        },
        xxl: {
          fontSize: 80,
          filter: "blur(1px)",
        },
      },
    },
    Input: inputTheme,
    Modal: modalTheme,
    Tooltip: tooltipTheme,
  },
};
