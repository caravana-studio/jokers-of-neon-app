import { Button } from "@chakra-ui/react";
import { Card } from "../../types/Card";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useTranslation } from "react-i18next";
import { PowerUp } from "../../types/Powerup/PowerUp";

interface SellButtonProps {
  preselectedCard: Card | PowerUp | undefined;
  onClick?: Function;
  price: number;
}

export const SellButton: React.FC<SellButtonProps> = ({
  preselectedCard,
  onClick,
  price,
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
      {price
        ? t("special-cards.sell-for", { price: price })
        : t("special-cards.sell")}
    </Button>
  );
};
