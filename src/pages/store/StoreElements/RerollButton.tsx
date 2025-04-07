import { Box, Button, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { useGame } from "../../../dojo/queries/useGame";

const RerollButton = () => {
  const { t } = useTranslation(["store"]);
  const { isSmallScreen } = useResponsiveValues();
  const { locked, reroll } = useStore();
  const game = useGame();
  const rerolled = game?.available_rerolls === 0;
  const rerollDisabled = locked || rerolled;

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
        zIndex={100}
      >
        {isSmallScreen && (
          <Box mr={2}>
            <FiRefreshCw />
          </Box>
        )}
        {t("store.labels.reroll").toUpperCase()}
      </Button>
    </Tooltip>
  );
};

export default RerollButton;
