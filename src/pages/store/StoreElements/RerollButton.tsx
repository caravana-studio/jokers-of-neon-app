import { Button, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CashSymbol } from "../../../components/CashSymbol";
import { useStore } from "../../../providers/StoreProvider";

interface RerollButtonProps {
  isSmallScreen: boolean;
}

const RerollButton: React.FC<RerollButtonProps> = ({ isSmallScreen }) => {
  const { t } = useTranslation(["store"]);

  const { cash, locked, reroll, rerollInformation } = useStore();

  const notEnoughCash = cash < rerollInformation.rerollCost;

  const rerolled = rerollInformation.rerollExecuted;
  const rerollDisabled = rerolled || locked || notEnoughCash;

  return (
    <Tooltip
      placement={isSmallScreen ? "top" : "right"}
      label={
        rerolled
          ? t("store.tooltip.rerolled")
          : t("store.tooltip.reroll-default")
      }
    >
      <Button
        className="game-tutorial-step-6"
        fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
        w={
          isSmallScreen ? "unset" : ["unset", "unset", "unset", "100%", "100%"]
        }
        variant={rerollDisabled ? "defaultOutline" : "solid"}
        isDisabled={rerollDisabled}
        onClick={() => {
          reroll();
        }}
      >
        {t("store.labels.reroll").toUpperCase()}
        {isSmallScreen && <br />} {rerollInformation.rerollCost}
        <CashSymbol />
      </Button>
    </Tooltip>
  );
};

export default RerollButton;
