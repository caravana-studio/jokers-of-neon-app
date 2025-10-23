import { Flex, Text, Image } from "@chakra-ui/react";
import { FadeInOut } from "../../components/animations/FadeInOut";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

interface LogoPresentationProps {
  visibleElements?: {
    logo?: boolean;
    text?: boolean;
  };
}

export const LogoPresentation: React.FC<LogoPresentationProps> = ({
  visibleElements = { text: false, logo: false },
}) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "loading-screen",
  });
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
          width={"60%"}
          margin={"0 auto"}
          mb={4}
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
        <Text color="white" fontSize={isMobile ? "1.2rem" : "2.2rem"}>
          {t("presents")}
        </Text>
      </FadeInOut>
    </Flex>
  );
};
