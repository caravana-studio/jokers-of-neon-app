import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  },
  dialogContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  dialog: {
    borderRadius: "15px",
    boxShadow:
      "0px 0px 20px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.5) ",
    color: "white",
    bg: `black`,
    width: "70%",
    maxWidth: "1100px",
  },
});

const fullscreen = definePartsStyle({
  overlay: {
    bg: "rgba(0, 0, 0, .8)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  dialog: {
    w: "100vw",
    maxW: "100vw",
    h: "100vh",
    borderRadius: "0",
    margin: 0,
    bg: "rgba(0, 0, 0, .5)",
  },
  closeButton: {
    border: 0,
    _hover: {
      border: "none",
      outline: "none",
    },
    _focus: {
      border: "none",
      outline: "none",
    },
    _active: {
      border: "none",
    },
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    fullscreen,
  },
});
