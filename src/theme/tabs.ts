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
    borderRadius: "10px",
    mx: 2,
  },
  tablist: {
    border: "1px solid white",
    borderRadius: "18px",
    py: 3,
    px: 1
  },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
