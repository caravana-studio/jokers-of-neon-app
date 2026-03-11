import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { BLUE, NEON_PINK } from "./colors";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const boxShadow = `0px 0px 8px 2px ${BLUE}`;
const boxShadowMenuItem = `0px 0px 10px 2px ${BLUE}, inset 0px 0px 10px 2px ${BLUE}`;
const border = `3px solid ${BLUE}`;
const borderThin = `2px solid ${BLUE}`;
const boxShadowThick = `0px 0px 15px 7px ${BLUE}`;
const borderDisabled = `1px solid rgb(255,255,255)`;

const baseStyle = definePartsStyle({
  button: {
    bg: "rgba(0,0,0,0.5)",
    color: "white",
    borderRadius: "xl",
    fontSize: [20, 20, 25],
    height: ["40px", "40px", "40px", "50px"],
    width: ["40px", "40px", "40px", "50px"],
    outline: "none",
    border: "none !important",
    _hover: { border: "none", outline: "none" },
    _focus: { border: "none", outline: "none" },
    _active: { border: "none" },
  },
  list: {
    borderRadius: "2xl",
    border: border,
    boxShadow: boxShadow,
    bg: "black",
    p: 0,
  },
  item: {
    color: "white",
    bg: "black",
    borderRadius: "xl",
    border: "2px solid rgba(0,0,0,0)",
    _hover: { color: "white", border: borderThin, boxShadow: boxShadowMenuItem, outline: "none" },
    _focus: { color: "white", border: borderThin, boxShadow: boxShadowMenuItem, outline: "none" },
  },
});

const menuGameOutline = definePartsStyle({
  button: {
    border: borderDisabled,
    _hover: { bg: `${BLUE}`, border: border, boxShadow: boxShadowThick },
    _focus: { bg: `${BLUE}`, border: border, boxShadow: boxShadowThick, outline: "none" },
    _active: { bg: `${BLUE}`, border: border, boxShadow: boxShadowThick },
  },
});

const menuSettingsOutline = definePartsStyle({
  button: {
    bg: "greyMedium",
    color: "rgb(255,255,255)",
    fontSize: "sm",
    padding: "0.5rem",
    height: "2rem",
    _hover: { bg: "greyMedium", border: 0, boxShadow: 0 },
    _active: { bg: "greyMedium", border: 0, boxShadow: 0 },
    _focus: { bg: "greyMedium", border: 0, boxShadow: 0 },
  },
  list: {
    borderRadius: "0.3rem",
    border: `1px solid white`,
    boxShadow: 0,
    bg: "black",
    p: 0,
  },
  item: {
    bg: "grayMedium",
    _focus: { bg: "black", boxShadow: "none", borderRadius: 0, borderColor: "transparent", outline: "none" },
    _hover: { color: "white", bg: NEON_PINK, boxShadow: 0, borderRadius: 0, borderColor: "white", outline: "none" },
  },
});

export const menuTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { menuSettingsOutline, menuGameOutline },
});
