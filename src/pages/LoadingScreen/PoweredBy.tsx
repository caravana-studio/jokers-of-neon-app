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
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      textAlign={"center"}
      gap={4}
      width={"100%"}
    >
      <FadeInOut isVisible={visibleElements.text} fadeOut>
        <Text fontSize="lg">POWERED BY</Text>
      </FadeInOut>
      <Flex
        gap={40}
        width={"100%"}
        px={4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <FadeInOut
          isVisible={visibleElements.logo1}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image src="/logos/starknet-logo.png" alt="Starknet" width={"5vw"} />
        </FadeInOut>

        <FadeInOut
          isVisible={visibleElements.logo2}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image src="/logos/dojo-logo.png" alt="Dojo" width={"5vw"} />
        </FadeInOut>

        <FadeInOut
          isVisible={visibleElements.logo3}
          fadeOut
          fadeInDelay={fadeInDelay}
        >
          <Image
            src="/logos/cartridge-logo.png"
            alt="Cartridge"
            width={"5vw"}
          />
        </FadeInOut>
      </Flex>
    </Flex>
  );
};
