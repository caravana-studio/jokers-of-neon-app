import { Flex, Icon, Image, Text } from "@chakra-ui/react";
import type { ElementType } from "react";

interface AuthButtonProps {
  iconSrc?: string;
  iconComponent?: ElementType;
  iconAlt?: string;
  label: string;
  bg: string;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const AuthButton = ({
  iconSrc,
  iconComponent,
  iconAlt,
  label,
  bg,
  color,
  onClick,
  disabled,
}: AuthButtonProps) => (
  <Flex
    as="button"
    type="button"
    onClick={onClick}
    disabled={disabled}
    h={{ base: "35px", sm: "40px" }}
    w="100%"
    borderRadius="9999px"
    bg={bg}
    color={color}
    alignItems="center"
    justifyContent="center"
    gap={3}
    px={4}
    fontFamily="Oxanium"
    fontWeight={500}
    lineHeight={1}
    textTransform="none"
    letterSpacing={0}
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.55 : 1}
  >
    {iconSrc && (
      <Image
        src={iconSrc}
        alt={iconAlt ?? ""}
        w={{ base: "16px", sm: "20px" }}
        h={{ base: "16px", sm: "20px" }}
      />
    )}
    {iconComponent && (
      <Icon
        as={iconComponent}
        color={color}
        boxSize={{ base: "16px", sm: "20px" }}
        display="block"
      />
    )}
    <Text lineHeight={1} fontSize={{ base: "14px", sm: "17px" }} color={color}>
      {label}
    </Text>
  </Flex>
);
