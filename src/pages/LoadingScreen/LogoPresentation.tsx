import { Flex, Text, Image } from "@chakra-ui/react";
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
    <Flex
      width={"100%"}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign={"center"}
      gap={4}
    >
      <FadeInOut
        isVisible={visibleElements.logo}
        fadeOut
        fadeOutDelay={1}
        fadeOutDuration={0.5}
      >
        <Image
          style={{ marginTop: "80px" }}
          width={["100%", "100%", "60%"]}
          src="/logos/caravana-logo.png"
          alt="logo"
        />
      </FadeInOut>
      <FadeInOut
        isVisible={visibleElements.text}
        fadeOut
        fadeOutDelay={1}
        fadeOutDuration={0.5}
      >
        <Text fontSize="lg">PRESENTS</Text>
      </FadeInOut>
    </Flex>
  );
};
