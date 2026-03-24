import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "./CachedImage";
import { CardContainerSwitcher } from "./CardContainerWithBorder";
import { useGameStore } from "../state/useGameStore";

export const SpecialRageSwitcher = () => {
  const { t } = useTranslation(["game"]);

  const { specialSwitcherOn, toggleSpecialSwitcher, isRageRound } = useGameStore();
  const isShowingSpecialCards = !isRageRound || specialSwitcherOn;

  return (
    <CardContainerSwitcher onClick={() => isRageRound && toggleSpecialSwitcher()}>
      <Tooltip
        placement="right"
        label={t("specials-box.specials-tooltip", { defaultValue: "Special cards" })}
      >
        <Box pointerEvents="auto">
          <CachedImage
            cursor="pointer"
            src={`specials-box/special-icon-${isShowingSpecialCards ? "on" : "off"}.png`}
            height={{ base: 5, sm: 8, md: 10 }}
          />
        </Box>
      </Tooltip>
      {isRageRound && (
        <Tooltip
          placement="right"
          label={t("specials-box.rage-tooltip", { defaultValue: "Rage cards" })}
        >
          <Box pointerEvents="auto">
            <CachedImage
              cursor="pointer"
              src={`specials-box/rage-icon-${isShowingSpecialCards ? "off" : "on"}.png`}
              height={{ base: 5, sm: 8, md: 10 }}
            />
          </Box>
        </Tooltip>
      )}
    </CardContainerSwitcher>
  );
};
