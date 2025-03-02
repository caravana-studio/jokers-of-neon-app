import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn } = useGameContext();

  return (
    <CardContainerWithBorder
      width="auto"
      minWidth="auto"
      maxWidth={"95%"}
      height={`100%`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
