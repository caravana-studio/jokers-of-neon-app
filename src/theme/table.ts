import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  td: {
    color: "limeGreen",
    fontFamily: "Sys",
    textAlign: "center",
    fontSize: 18,
  },
  thead: {
    tr: {
      borderBottomWidth: 0,
    },
    td: {
      color: "white",
      borderBottomWidth: 0,
    },
  },
  tbody: {
    tr: {
      "&:nth-of-type(odd)": {
        "th, td": {
          borderBottomWidth: 0,
        },
        td: {},
      },
      "&:nth-of-type(even)": {
        "th, td": {
          borderBottomWidth: 0,
        },
        td: {},
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
