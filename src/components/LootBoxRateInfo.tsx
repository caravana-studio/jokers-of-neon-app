import { useTranslation } from "react-i18next";
import { useInformationPopUp } from "../providers/InformationPopUpProvider";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import theme from "../theme/theme";

interface LootBoxRateInfoProps {
  name: string;
  details?: string;
}

export const LootBoxRateInfo: React.FC<LootBoxRateInfoProps> = ({
  name,
  details,
}) => {
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation(["store"]);
  const { neonGreen } = theme.colors;

  return (
    <Flex
      onClick={(event) => {
        event.stopPropagation();
        setInformation(
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
      }}
    >
      <Text>{t("store.packs.offering-rates")}</Text>
      <IoIosInformationCircleOutline color="white" size={"14px"} />
    </Flex>
  );
};
