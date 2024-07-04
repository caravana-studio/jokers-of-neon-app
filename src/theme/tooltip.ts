import { background, defineStyleConfig } from "@chakra-ui/react";

// define the base component styles
const baseStyle = {
  width: '150px',
  textAlign: 'center',
  p: 2
};

// export the component theme
export const tooltipTheme = defineStyleConfig({ baseStyle });
