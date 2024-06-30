import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import button from "./button";
import {
  CLUBS,
  DIAMONDS,
  HEARTS,
  NEON_GREEN,
  NEON_PINK,
  SPADES,
} from "./colors";
import { headingTheme } from "./heading";
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
    // suits - accessible through colors[Suits.CLUBS]
    1: CLUBS,
    2: DIAMONDS,
    3: HEARTS,
    4: SPADES,
    // suits - accessible through colors['CLUBS'] or 'CLUBS'
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
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
  breakpoints: {
    base: "0px",
    sm: "1000px",
    md: "1200px",
    lg: "1400x",
    xl: "1800px",
  },
  components: {
    Table: tableTheme,
    Button: button,
    Input: inputTheme,
    Modal: modalTheme,
    Tooltip: tooltipTheme,
    Heading: headingTheme,
  },
};
