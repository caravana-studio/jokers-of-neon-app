import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  tr: {
    "td:first-child": {
      borderTopLeftRadius: "full",
      borderBottomLeftRadius: "full",
    },
    "td:last-child": {
      borderTopRightRadius: "full",
      borderBottomRightRadius: "full",
    },
  },
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
  tfoot: {
    tr: {
      "&:last-of-type": {
        th: { borderBottomWidth: 0 },
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
