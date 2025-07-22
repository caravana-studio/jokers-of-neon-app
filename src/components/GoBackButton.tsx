import { Button, ButtonProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface GoBackButtonProps extends ButtonProps {
  text?: string;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  text,
  ...buttonProps
}) => {
  const { t } = useTranslation("intermediate-screens");
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();

  return (
    <Button
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      onClick={() => {
        navigate(-1);
      }}
      {...buttonProps}
    >
      {text ?? t("common.go-back-btn")}
    </Button>
  );
};
