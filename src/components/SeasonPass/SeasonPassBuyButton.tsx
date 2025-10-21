import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VIOLET, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SeasonPass } from "./SeasonPass";

export const SeasonPassBuyButton = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-pass",
  });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <>
      <Flex flexDir="column" textAlign="center" w="90%">
        <Heading size="xs">{t("more-rewards-with")}</Heading>
        <Heading
          lineHeight={1}
          mt={1}
          textShadow={`0 0 5px ${VIOLET}`}
          fontSize={isSmallScreen ? "sm" : "xl"}
          color={VIOLET_LIGHT}
        >
          {t("season-pass")}
        </Heading>
      </Flex>
      <Flex mt={isSmallScreen ? 2 : 4} justifyContent="center" w="90%">
        <Button
          w={isSmallScreen ? "130px" : "200px"}
          h={isSmallScreen ? "22px" : "30px"}
          justifyContent={"space-between"}
        >
          <Flex w="60%">
            <Text textAlign={"center"} w="100%">
              {t("buy")}
            </Text>
          </Flex>
          <Box justifyContent="flex-end">
            <SeasonPass w={isSmallScreen ? "50px" : "75px"} rotate="-20deg" />
          </Box>
        </Button>
      </Flex>
    </>
  );
};
