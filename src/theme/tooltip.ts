import { cssVar, defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
const $arrowBg = cssVar("popper-arrow-bg");

// define the base component styles
const baseStyle = {
  width: '150px',
  textAlign: 'center',
  p: 2,
  background: 'black',
  color: 'white',
  boxShadow: `0px 0px 10px 2px white`,
  borderRadius: '10px',
  [$arrowBg.variable]: "colors.transparent",
  ...(isMobile ? { display: "none" } : {}),
};

const sizes = {
  sm: defineStyle({
    fontSize: '12px',
    px: '20px !important',
    py: '3px !important',
    maxW: '200px',
    width: 'auto'
  }),
}

// export the component theme
export const tooltipTheme = defineStyleConfig({ baseStyle, sizes });
