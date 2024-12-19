import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useInformationPopUp } from "../providers/InformationPopUpProvider";

export const InformationIcon = ({ title }: { title: string }) => {
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation("store", { keyPrefix: "information" });

  return (
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
  );
};
