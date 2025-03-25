import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { propagateChanged } from "mobx/dist/internal";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const InformationIcon = ({
  title,
  informationContent,
}: {
  title: string;
  informationContent?: JSX.Element;
}) => {
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation("store", { keyPrefix: "information" });
  const { isSmallScreen } = useResponsiveValues();
  return informationContent ? (
    <IoIosInformationCircleOutline
      color="white"
      size={isSmallScreen ? "14px" : "18px"}
      onClick={(event) => {
        event.stopPropagation();
        setInformation(informationContent);
      }}
      cursor="pointer"
    />
  ) : (
    <Tooltip label={t(title)}>
      <Box position={"relative"}>
        <IoIosInformationCircleOutline color="white" size={isSmallScreen ? "14px" : "18px"} />
      </Box>
    </Tooltip>
  );
};
