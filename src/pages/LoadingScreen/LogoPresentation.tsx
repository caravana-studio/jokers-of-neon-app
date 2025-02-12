import { Flex, Text } from "@chakra-ui/react";

interface LogoPresentationProps {
  visibleElements: {
    logo: boolean;
    text: boolean;
  };
}

export const LogoPresentation: React.FC<LogoPresentationProps> = ({
  visibleElements,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      {visibleElements.logo && (
        <img
          style={{ marginTop: "80px" }}
          width="60%"
          src="logos/logo.png"
          alt="logo"
        />
      )}
      {visibleElements.text && <Text fontSize="lg">PRESENTS</Text>}
    </Flex>
  );
};
