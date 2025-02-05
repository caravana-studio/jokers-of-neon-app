import { Flex, Text } from "@chakra-ui/react";
import { InformationIcon } from "./InformationIcon";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const DefaultInfo = ({ title }: { title: string }) => {
  const { t } = useTranslation("store", { keyPrefix: "information" });
  const { isSmallScreen } = useResponsiveValues();

  const infoContent = !isSmallScreen ? undefined : (
    <Flex
      p={4}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor="rgba(0,0,0,0.5)"
    >
      <Text w="60%" fontWeight={"400"} fontSize={"sm"}>
        {t(title)}
      </Text>
    </Flex>
  );

  return <InformationIcon title={title} informationContent={infoContent} />;
};
