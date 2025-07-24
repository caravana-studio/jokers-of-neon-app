import { Box, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

const RerollButton = () => {
  const { t } = useTranslation(["store"]);
  const { isSmallScreen } = useResponsiveValues();
  const { locked, reroll } = useStore();
  const { availableRerolls } = useGameStore();
  const rerolled = availableRerolls === 0;
  const rerollDisabled = locked || rerolled;

  return (
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
  );
};

export default RerollButton;
