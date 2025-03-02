import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn } = useGameContext();
  const { isSmallScreen, cardScale, isCardScaleCalculated } =
    useResponsiveValues();
  const heightOffset = isSmallScreen ? 20 : 40;

  return (
    <CardContainerWithBorder
      width={"auto"}
      maxWidth={isSmallScreen ? "95%" : "100%"}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
