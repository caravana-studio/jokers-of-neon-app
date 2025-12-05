import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VIOLET, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SeasonPass } from "./SeasonPass";

export const SeasonPassUnlocked = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass",
  });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <>
      <Flex mb={1} justifyContent="center" w="90%">
        <SeasonPass unlocked w={isSmallScreen ? "50px" : "75px"} />
      </Flex>
      <Flex
        flexDir="column"
        textAlign="center"
        w="90%"
        gap={isSmallScreen ? 0 : 1}
      >
        <Heading
          lineHeight={1}
          mt={1}
          textShadow={`0 0 5px ${VIOLET}`}
          fontSize={isSmallScreen ? "sm" : "xl"}
          color={VIOLET_LIGHT}
        >
          {t("season-pass")}
        </Heading>
        <Heading size="xs">{t("unlocked")}</Heading>
      </Flex>
    </>
  );
};
