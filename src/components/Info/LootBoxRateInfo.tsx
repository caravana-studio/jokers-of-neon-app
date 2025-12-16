import { useTranslation } from "react-i18next";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import theme from "../../theme/theme";
import { InformationIcon } from "./InformationIcon";

interface LootBoxRateInfoProps {
  name: string;
  details?: string;
}

export const LootBoxRateInfo: React.FC<LootBoxRateInfoProps> = ({
  name,
  details,
}) => {
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;
  const infoContent = (
    <Box>
      <Heading mb={4} fontWeight={"400"} fontSize={"sm"}>
        {name}
      </Heading>
      <Text color={neonGreen} fontSize={"sm"}>
        {t("store.packs.offering-rates")}: <br />
        {details?.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Text>
    </Box>
  );

  return (
    <Flex gap={2} alignItems={"center"}>
      <Text>{t("store.packs.offering-rates")}</Text>
      <InformationIcon
        title="Offering rates"
        informationContent={infoContent}
      />
    </Flex>
  );
};
