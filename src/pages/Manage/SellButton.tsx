import { Button } from "@chakra-ui/react";
import { Card } from "../../types/Card";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useTranslation } from "react-i18next";

interface SellButtonProps {
  preselectedCard: Card | undefined;
  onClick?: Function;
}

export const SellButton: React.FC<SellButtonProps> = ({
  preselectedCard,
  onClick,
}) => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens");

  return (
    <Button
      isDisabled={!preselectedCard}
      variant={!preselectedCard ? "defaultOutline" : "secondarySolid"}
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      lineHeight={1.6}
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
    >
      {preselectedCard?.selling_price
        ? t("special-cards.sell-for", { price: preselectedCard.selling_price })
        : t("special-cards.sell")}
    </Button>
  );
};
