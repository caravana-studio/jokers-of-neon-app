import { Flex } from "@chakra-ui/react";
import CachedImage from "../../../../components/CachedImage";
import { DefaultInfo } from "../../../../components/Info/DefaultInfo";
import { useGame } from "../../../../dojo/queries/useGame";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { MobileCoins } from "../../../store/Coins";
import RerollButton from "../../../store/StoreElements/RerollButton";
import { RerollIndicators } from "./RerollIndicators";

interface RerollSectionProps {
  hideReroll?: boolean;
}

export const RerollSection: React.FC<RerollSectionProps> = ({ hideReroll }) => {
  const { isSmallScreen } = useResponsiveValues();
  const game = useGame();
  const availableRerolls = Number(game?.available_rerolls ?? 0);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      {!hideReroll ? (
        <Flex gap={isSmallScreen ? 1 : 4} py={1} alignItems={"center"}>
          <RerollButton />
          <Flex ml={4} columnGap={2}>
            <RerollIndicators rerolls={availableRerolls} />
            <DefaultInfo title="reroll" />
          </Flex>
        </Flex>
      ) : (
        <Flex>
          {!isSmallScreen && (
            <CachedImage
              ml={6}
              src="/logos/logo-variant.svg"
              alt="logo-variant"
              width="200px"
            />
          )}
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
