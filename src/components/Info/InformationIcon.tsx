import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { propagateChanged } from "mobx/dist/internal";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const InformationIcon = ({
  title,
  informationContent,
  unstyledPopup = false,
}: {
  title: string;
  informationContent?: JSX.Element;
  unstyledPopup?: boolean;
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
        setInformation(informationContent, { unstyled: unstyledPopup });
      }}
      cursor="pointer"
      style={{
        zIndex: 10
      }}
    />
  ) : (
    <Tooltip label={t(title)}>
      <Box zIndex={10} position={"relative"}>
        <IoIosInformationCircleOutline color="white" size={isSmallScreen ? "14px" : "18px"} />
      </Box>
    </Tooltip>
  );
};
