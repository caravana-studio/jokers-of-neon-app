import { Flex, Text } from "@chakra-ui/react";
import { FadeInOut } from "../../components/animations/FadeInOut";

interface LogoPresentationProps {
  visibleElements?: {
    logo?: boolean;
    text?: boolean;
  };
}

export const LogoPresentation: React.FC<LogoPresentationProps> = ({
  visibleElements = { text: false, logo: false },
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      <FadeInOut isVisible={visibleElements.logo} fadeOut>
        <img
          style={{ marginTop: "80px" }}
          width="60%"
          src="logos/logo.png"
          alt="logo"
        />
      </FadeInOut>
      <FadeInOut isVisible={visibleElements.text} fadeOut fadeInDelay={0.5}>
        <Text fontSize="lg">PRESENTS</Text>
      </FadeInOut>
    </Flex>
  );
};
