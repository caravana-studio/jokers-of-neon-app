import { cssVar, defineStyleConfig } from "@chakra-ui/react";
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
  [$arrowBg.variable]: "colors.black",
};


// export the component theme
export const tooltipTheme = defineStyleConfig({ baseStyle });