import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { BLUE, BLUE_LIGHT, NEON_GREEN } from './colors'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    // Styles for the container
  },
  thumb: {
    bg: BLUE,
    _checked: {
      bg: BLUE_LIGHT,
    },
  },
  track: {
    bg: 'rgba(0,0,0,0.5)',
    border: `2px solid ${BLUE}`,
    boxShadow: `0px 0px 8px 2px ${BLUE}`,
    _checked: {
      bg: 'rgba(0,0,0,0.5)',
      border: `2px solid ${NEON_GREEN}`,
      boxShadow: `0px 0px 8px 2px ${NEON_GREEN}`,
    },
  },
})

export const switchTheme = defineMultiStyleConfig({
  baseStyle,
//   sizes,
  defaultProps: {
    size: 'md',
    colorScheme: 'blue',
  },
})