import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { BLUE } from "./colors";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  tab: {
    _selected: {
      bg: "blue",
      border: "none",
      boxShadow: `0px 0px 12px 4px ${BLUE}`,
    },
    borderRadius: "7px",
    mx: 2,
    height: "25px",
    textTransform: "uppercase",
  },
  tablist: {
    border: "1px solid white",
    borderRadius: "18px",
    py: 2,
    px: 0.5,
    backgroundColor: "black",
  },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
