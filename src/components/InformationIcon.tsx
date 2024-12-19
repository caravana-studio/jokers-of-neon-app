import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useInformationPopUp } from "../providers/InformationPopUpProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const InformationIcon = ({ title }: { title: string }) => {
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation("store", { keyPrefix: "information" });
  const { isSmallScreen } = useResponsiveValues();

  return isSmallScreen ? (
    <IoIosInformationCircleOutline
      color="white"
      size={"18px"}
      onClick={() =>
        setInformation(
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
        )
      }
    />
  ) : (
    <Tooltip label={t(title)}>
      <Box position={"relative"}>
        <IoIosInformationCircleOutline color="white" size={"18px"} />
      </Box>
    </Tooltip>
  );
};
