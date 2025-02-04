import { Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../providers/GameProvider";
import CachedImage from "./CachedImage";
import { CardContainerSwitcher } from "./CardContainerWithBorder";

export const SpecialRageSwitcher = () => {
  const { t } = useTranslation(["game"]);

  const { specialSwitcherOn, toggleSpecialSwitcher } = useGameContext();
  return (
    <CardContainerSwitcher onClick={() => toggleSpecialSwitcher()}>
      <Tooltip placement="right" label={t("specials-box.specials-tooltip")}>
        <CachedImage
          cursor="pointer"
          src={`specials-box/special-icon-${specialSwitcherOn ? "on" : "off"}.png`}
          height={{ base: 5, sm: 8, md: 10 }}
        />
      </Tooltip>
      <Tooltip placement="right" label={t("specials-box.rage-tooltip")}>
        <CachedImage
          cursor="pointer"
          src={`specials-box/rage-icon-${specialSwitcherOn ? "off" : "on"}.png`}
          height={{ base: 5, sm: 8, md: 10 }}
        />
      </Tooltip>
    </CardContainerSwitcher>
  );
};
