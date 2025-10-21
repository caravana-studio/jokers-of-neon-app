import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VIOLET, VIOLET_LIGHT } from "../../theme/colors";
import { SeasonPass } from "./SeasonPass";

export const SeasonPassBuyButton = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-pass",
  });
  return (
    <>
      <Flex flexDir="column" textAlign="center" w="90%">
        <Heading size="xs">{t("more-rewards-with")}</Heading>
        <Heading
          lineHeight={1}
          mt={1}
          textShadow={`0 0 5px ${VIOLET}`}
          fontSize="sm"
          color={VIOLET_LIGHT}
        >
          {t("season-pass")}
        </Heading>
      </Flex>
      <Flex mt={2} justifyContent="center" w="90%">
        <Button w="130px" h="22px" justifyContent={"space-between"}>
          <Flex w="60%">
            <Text textAlign={"center"} w="100%">
              {t("buy")}
            </Text>
          </Flex>
          <Box justifyContent="flex-end">
            <SeasonPass rotate="-20deg" />
          </Box>
        </Button>
      </Flex>
    </>
  );
};
