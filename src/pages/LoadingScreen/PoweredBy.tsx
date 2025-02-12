import { Flex, Image, Text } from "@chakra-ui/react";

interface PoweredByPresentationProps {
  visibleElements: {
    text: boolean;
    logo1: boolean;
    logo2: boolean;
    logo3: boolean;
  };
}

export const PoweredByPresentation: React.FC<PoweredByPresentationProps> = ({
  visibleElements,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      {visibleElements.text && <Text fontSize="lg">POWERED BY</Text>}
      <Flex gap={2}>
        {visibleElements.logo1 && (
          <Image src="/logos/starknet-logo.png" alt="Starknet" />
        )}
        {visibleElements.logo2 && (
          <Image src="/logos/dojo-logo.png" alt="Dojo" />
        )}
        {visibleElements.logo3 && (
          <Image src="/logos/cartridge-logo.png" alt="Cartridge" />
        )}
      </Flex>
    </Flex>
  );
};
