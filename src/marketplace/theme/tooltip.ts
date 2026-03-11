import { cssVar, defineStyle, defineStyleConfig } from "@chakra-ui/react";
const $arrowBg = cssVar("popper-arrow-bg");

const baseStyle = {
  width: "150px",
  textAlign: "center" as const,
  p: 2,
  background: "black",
  color: "white",
  boxShadow: `0px 0px 10px 2px white`,
  borderRadius: "10px",
  [$arrowBg.variable]: "colors.transparent",
};

const sizes = {
  sm: defineStyle({
    fontSize: "12px",
    px: "20px !important",
    py: "3px !important",
    maxW: "200px",
    width: "auto",
  }),
};

export const tooltipTheme = defineStyleConfig({ baseStyle, sizes });
