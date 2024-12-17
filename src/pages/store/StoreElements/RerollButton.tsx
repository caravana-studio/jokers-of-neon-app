import { Box, Button, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../providers/StoreProvider";
import { CashSymbol } from "../../../components/CashSymbol";
import { FiRefreshCw } from "react-icons/fi";
import { useResponsiveValues } from "../../../theme/responsiveSettings";



const RerollButton  = () => {
  const { t } = useTranslation(["store"]);

  const { isSmallScreen } = useResponsiveValues();

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
        fontSize={isSmallScreen ? 8 : [10, 10, 10, 14, 14]}
        w={"100%"}
        minWidth={"90px"}
        height={"100%"}
        p={isSmallScreen ? "4px" : 0}
        size={isSmallScreen ? "xs" : "md"}
        variant={rerollDisabled ? "defaultOutline" : "secondarySolid"}
        isDisabled={rerollDisabled}
        onClick={() => {
          reroll();
        }}
      >
        {isSmallScreen && (
          <Box mr={2}>
            <FiRefreshCw />
          </Box>
        )}
        {t("store.labels.reroll").toUpperCase()}
        {!isSmallScreen && (
          <>
            &nbsp;${rerollInformation.rerollCost} <CashSymbol />
          </>
        )}
      </Button>
    </Tooltip>
  );
};

export default RerollButton;
