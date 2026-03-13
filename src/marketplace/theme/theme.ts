import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "../../theme/button";
import {
  BACKGROUND_BLUE,
  BLUE,
  BLUE_LIGHT,
  CLUBS,
  DIAMONDS,
  GREY_LINE,
  GREY_MEDIUM,
  HEARTS,
  NEON,
  NEON_GREEN,
  PASTEL_PINK,
  SPADES,
  VIOLET,
  VIOLET_LIGHT,
} from "../../theme/colors";
import { drawerTheme } from "../../theme/drawer";
import { headingTheme } from "../../theme/heading";
import { inputTheme } from "../../theme/input";
import { menuTheme } from "../../theme/menu";
import { modalTheme } from "../../theme/modal";
import { tableTheme } from "../../theme/table";
import { switchTheme } from "../../theme/switch";
import { tabsTheme } from "../../theme/tabs";
import { textTheme } from "../../theme/text";
import { tooltipTheme } from "../../theme/tooltip";

const theme = extendTheme({
  colors: {
    blue: BLUE,
    blueLight: BLUE_LIGHT,
    greyLine: GREY_LINE,
    violet: VIOLET,
    neonGreen: NEON_GREEN,
    opaqueNeonGreen: "#2fcdd7",
    neonPink: VIOLET,
    lightViolet: VIOLET_LIGHT,
    limeGreen: "lime",
    darkGrey: "#04162d",
    greyMedium: GREY_MEDIUM,
    purple: "#9940aa",
    white: "white",
    pastelPink: PASTEL_PINK,
    backgroundBlue: BACKGROUND_BLUE,
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
    NEON,
  },
  styles: {
    global: {
      body: {
        background: "#000 none repeat scroll 0 0",
        margin: 0,
        overflow: "auto",
        minHeight: "100vh",
        width: "100%",
      },
    },
  },
  breakpoints: {
    base: "0em",
    sm: "42em",
    md: "78em",
    lg: "90em",
    xl: "125em",
  },
  components: {
    Table: tableTheme,
    Button: buttonTheme,
    Input: inputTheme,
    Modal: modalTheme,
    Tooltip: tooltipTheme,
    Heading: headingTheme,
    Text: textTheme,
    Menu: menuTheme,
    Tabs: tabsTheme,
    Drawer: drawerTheme,
    Switch: switchTheme,
  },
});

export default theme;
