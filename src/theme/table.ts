import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { ROYAL_BLUE } from './colors.tsx'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  td: {
    color: "white",
    fontFamily: "Orbitron",
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
        td: {
          color: ROYAL_BLUE,
          fontSize: "xl",
          fontWeight: "bold",
        },
      },
      "&:nth-of-type(even)": {
        "th, td": {
          borderBottomWidth: 0,
        },
        td: {
          color: ROYAL_BLUE,
          fontSize: "xl",
          fontWeight: "bold",
        },
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
