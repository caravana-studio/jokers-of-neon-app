import { buttonTheme } from "./button";
import {
  BLUE,
  CLUBS,
  DIAMONDS,
  HEARTS,
  NEON_GREEN,
  NEON_PINK,
  SPADES,
  VIOLET,
} from "./colors";
import { headingTheme } from "./heading";
import { modalTheme } from "./modal";
import { tableTheme } from "./table";
import { textTheme } from "./text";
import { tooltipTheme } from "./tooltip";
import { inputTheme } from './input'

export default {
  colors: {
    blue: BLUE,
    violet: VIOLET,
    neonGreen: NEON_GREEN,
    opaqueNeonGreen: "#2fcdd7",
    neonPink: VIOLET,
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
    sm: "600px",
    md: "1200px",
    lg: "1600x",
    xl: "2000px",
  },
  components: {
    Table: tableTheme,
    Button: buttonTheme,
    Input: inputTheme,
    Modal: modalTheme,
    Tooltip: tooltipTheme,
    Heading: headingTheme,
    Text: textTheme,
  },
};
