import { Box, Text } from "@chakra-ui/react";

export function FilterLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize={12}
      color="whiteAlpha.600"
      fontFamily="Oxanium"
      textTransform="uppercase"
      letterSpacing="0.12em"
      mb={1.5}
    >
      {children}
    </Text>
  );
}

export const filterSelectStyles = {
  fontFamily: "Orbitron",
  fontSize: 13,
  bg: "transparent",
  color: "white",
  borderColor: "whiteAlpha.300",
  _focus: { borderColor: "neonGreen", boxShadow: "none" },
  size: "md" as const,
};

export const filterInputStyles = {
  fontFamily: "Orbitron",
  fontSize: 13,
  bg: "transparent",
  color: "white",
  borderColor: "whiteAlpha.300",
  _focus: { borderColor: "neonGreen", boxShadow: "none" },
  size: "md" as const,
};

export function FilterBarContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="rgba(0,0,0,0.65)"
      borderRadius="20px"
      border="1px solid rgba(255,255,255,0.1)"
      boxShadow="0 0 14px 2px rgba(255,255,255,0.12)"
      px={{ base: 4, sm: 6 }}
      py={4}
    >
      {children}
    </Box>
  );
}
