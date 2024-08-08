import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { NEON_GREEN} from "../theme/colors";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const boxShadow = `0px 0px 8px 4px ${NEON_GREEN}`;
const boxShadowThick = `0px 0px 15px 7px ${NEON_GREEN}`;
const boxShadowMenuItem = `0px 0px 10px 2px ${NEON_GREEN}, inset 0px 0px 10px 2px ${NEON_GREEN}`;
const border = `3px solid ${NEON_GREEN}`;
const borderThin = `2px solid ${NEON_GREEN}`;

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  button: {
    // this will style the MenuButton component
    bg: `${NEON_GREEN}`,
    color: "white",
    borderRadius: 'xl',
    border: border,
    boxShadow: boxShadow,
    fontSize: [20, 20, 25],
    height: ["40px", "40px", "40px", "50px"],
    width: ["40px", "40px", "40px", "50px"],
    outline: "none",
    _hover: {
      border: border,
      boxShadow: boxShadowThick,
      outline: "none",
    },
    _focus: {
      border: border,
      boxShadow: boxShadowThick,
      outline: "none",
    },
    _active: {
      border: border,
      boxShadow: boxShadowThick,
    }
  },
  list: {
    borderRadius: '2xl',
    border: border,
    boxShadow: boxShadow,
    bg: 'black',
    p: 0,
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    color: "white",
    bg: "black",
    borderRadius: 'xl',
    border: '2px solid rgba(0,0,0,0)',
    _hover: {
      color: "white",
      border: borderThin,
      boxShadow: boxShadowMenuItem,
      outline: "none",
    },
    _focus: {
      color: "white",
      border: borderThin,
      boxShadow: boxShadowMenuItem,
      outline: "none",
    },
  },
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })