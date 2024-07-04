import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'blackAlpha.500',
  },
  dialog: {
    borderRadius: '0',
    color: 'white',
    bg: `black`,
    marginTop: '20vh',
    width: '70%',
    maxWidth: '1100px',
    minWidth: '800px',
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})