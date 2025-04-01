import { Box, Text } from "@chakra-ui/react";
import { BarMenuBtn, BarMenuBtnProps } from "./BarMenuBtn";

interface BarMenuComingSoonBtnProps extends Omit<BarMenuBtnProps, "disabled"> {
  mtText?: string | number;
  fontSizeText?: string | number;
}
export const BarMenuComingSoonBtn: React.FC<BarMenuComingSoonBtnProps> = ({
  mtText = "14px",
  fontSizeText = "7px",
  ...props
}) => {
  return (
    <Box position="relative" display="inline-block" mb={2}>
      <BarMenuBtn {...props} disabled />

      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="white"
        borderRadius="md"
        fontSize="sm"
        fontWeight="bold"
        pointerEvents="none"
        mt={mtText}
      >
        <Text fontSize={fontSizeText} textAlign="center" lineHeight="1">
          Coming Soon
        </Text>
      </Box>
    </Box>
  );
};
