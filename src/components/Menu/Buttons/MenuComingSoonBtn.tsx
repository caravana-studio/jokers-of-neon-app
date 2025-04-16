import { Box, Flex, Text } from "@chakra-ui/react";
import { MenuBtn, MenuBtnProps } from "./MenuBtn";

export interface MenuComingSoonBtnProps extends Omit<MenuBtnProps, "disabled"> {
  mtText?: string | number;
  fontSizeText?: string | number;
}
export const MenuComingSoonBtn: React.FC<MenuComingSoonBtnProps> = ({
  mtText = "14px",
  fontSizeText = "7px",
  label,
  ...props
}) => {
  const comingSoonTxt = (
    <Text fontSize={fontSizeText} textAlign="center" lineHeight="1">
      Coming Soon
    </Text>
  );

  const menuBtn = <MenuBtn {...props} disabled label={label} />;
  return (
    <>
      {!label ? (
        <Box position="relative" display="inline-block" mb={2}>
          {menuBtn}
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
            {comingSoonTxt}
          </Box>
        </Box>
      ) : (
        <Flex gap={4} alignItems={"center"}>
          {menuBtn}
          {comingSoonTxt}
        </Flex>
      )}
    </>
  );
};
