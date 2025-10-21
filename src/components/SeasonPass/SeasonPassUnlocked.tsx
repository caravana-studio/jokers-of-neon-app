import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VIOLET, VIOLET_LIGHT } from "../../theme/colors";
import { SeasonPass } from "./SeasonPass";

export const SeasonPassUnlocked = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-pass",
  });
  return (
    <>
      <Flex mb={1} justifyContent="center" w="90%">
        <SeasonPass unlocked />
      </Flex>
      <Flex flexDir="column" textAlign="center" w="90%">
        <Heading
          lineHeight={1}
          mt={1}
          textShadow={`0 0 5px ${VIOLET}`}
          fontSize="sm"
          color={VIOLET_LIGHT}
        >
          {t("season-pass")}
        </Heading>
        <Heading size="xs">{t("unlocked")}</Heading>
      </Flex>
    </>
  );
};
