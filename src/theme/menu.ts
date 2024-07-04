import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { PASTEL_PINK, PASTEL_PINK_DARK } from "../theme/colors";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const boxShadow = `0px 0px 15px 7px ${PASTEL_PINK_DARK}`;
const border = `3px solid ${PASTEL_PINK}`;

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  button: {
    // this will style the MenuButton component
    bg: PASTEL_PINK,
    color: 'white',
    borderRadius: 'xl',
    border: "3px solid pink",
    boxShadow: boxShadow,
    fontSize: [20, 20, 25],
    height: ["40px", "40px", "40px", "50px"],
    width: ["40px", "40px", "40px", "50px"],
    outline: "none",
    _hover: {
      border: border,
      boxShadow: boxShadow,
      outline: "none",
    },
    _focus: {
      border: border,
      boxShadow: boxShadow,
      outline: "none",
    },
    _active: {
      border: border,
      bg: PASTEL_PINK_DARK
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
    _hover: {
      color: "pink",
      border: `2px solid white`,
      boxShadow: `0px 0px 10px 2px white, inset 0px 0px 10px 2px white`,
      outline: "none",
    },
    _focus: {
      color: "pink",
      border: `2px solid white`,
      boxShadow: `0px 0px 10px 2px white, inset 0px 0px 10px 2px white`,
      outline: "none",
    },
  },
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })