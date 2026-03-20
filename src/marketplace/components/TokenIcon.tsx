import { Box, Text } from "@chakra-ui/react";

const TOKEN_ICON: Record<string, string> = {
  STRK: "/strk.png",
  ETH:  "/eth.png",
  USDC: "/usdc.png",
};

interface TokenIconProps {
  symbol: string;
  size?: string;
}

export function TokenIcon({ symbol, size = "20px" }: TokenIconProps) {
  const src = TOKEN_ICON[symbol];
  if (src) {
    return (
      <Box
        as="img"
        src={src}
        alt={symbol}
        w={size}
        h={size}
        borderRadius="full"
        flexShrink={0}
        display="inline-block"
      />
    );
  }
  return (
    <Text fontFamily="Orbitron" fontSize="0.75em" color="whiteAlpha.700" lineHeight={1}>
      {symbol}
    </Text>
  );
}
