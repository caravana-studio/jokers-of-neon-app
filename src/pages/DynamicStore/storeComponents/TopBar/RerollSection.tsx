import { Flex } from "@chakra-ui/react";
import RerollButton from "../../../store/StoreElements/RerollButton";
import { DefaultInfo } from "../../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../../store/Coins";
import { RerollIndicators } from "./RerollIndicators";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { useGame } from "../../../../dojo/queries/useGame";

interface RerollSectionProps {
  hideReroll?: boolean;
}

export const RerollSection: React.FC<RerollSectionProps> = ({ hideReroll }) => {
  const { isSmallScreen } = useResponsiveValues();
  const game = useGame();
  const availableRerolls = Number(game?.available_rerolls ?? 0);

  return (
    <Flex
      justifyContent={!hideReroll ? "space-between" : "flex-end"}
      alignItems={"center"}
    >
      {!hideReroll && (
        <Flex gap={isSmallScreen ? 1 : 4} py={1} alignItems={"center"}>
          <RerollButton />
          <Flex ml={4} columnGap={2}>
            <RerollIndicators rerolls={availableRerolls} />
            <DefaultInfo title="reroll" />
          </Flex>
        </Flex>
      )}
      <Flex>
        <MobileCoins
          fontSize={isSmallScreen ? "12px" : undefined}
          iconSize={isSmallScreen ? 20 : undefined}
        />
      </Flex>
    </Flex>
  );
};
