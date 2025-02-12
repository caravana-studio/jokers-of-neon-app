import { Flex, Image, Text } from "@chakra-ui/react";
import { FadeInOut } from "../../components/animations/FadeInOut";

interface PoweredByPresentationProps {
  fadeInDelay?: number;
  visibleElements?: {
    text?: boolean;
    logo1?: boolean;
    logo2?: boolean;
    logo3?: boolean;
  };
}

export const PoweredByPresentation: React.FC<PoweredByPresentationProps> = ({
  visibleElements = { text: true, logo1: true, logo2: true, logo3: true },
  fadeInDelay = 0.5,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      <FadeInOut isVisible={visibleElements.text} fadeOut>
        <Text fontSize="lg">POWERED BY</Text>
      </FadeInOut>
      <Flex gap={2}>
        <FadeInOut
          isVisible={visibleElements.logo1}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image src="/logos/starknet-logo.png" alt="Starknet" />
        </FadeInOut>

        <FadeInOut
          isVisible={visibleElements.logo2}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image src="/logos/dojo-logo.png" alt="Dojo" />
        </FadeInOut>

        <FadeInOut
          isVisible={visibleElements.logo3}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image src="/logos/cartridge-logo.png" alt="Cartridge" />
        </FadeInOut>
      </Flex>
    </Flex>
  );
};
