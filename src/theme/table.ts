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
    fontSize: ["sm", "sm", "sm", "lg"],
  },
  thead: {
    tr: {
      borderBottomWidth: 0,
    },
    td: {
      color: "white",
      borderBottomWidth: 0,
      px: [2, 2, 4],
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
          fontSize: ["sm", "sm", "lg"],
          fontWeight: "bold",
          px: [1, 1, 4],
        },
      },
      "&:nth-of-type(even)": {
        "th, td": {
          borderBottomWidth: 0,
        },
        td: {
          color: ROYAL_BLUE,
          fontSize: ["sm", "sm", "lg"],
          fontWeight: "bold",
          px: [1, 1, 4],
        },
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
