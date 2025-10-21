import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { RewardStatus } from "../../enums/rewardStatus";
import { VIOLET } from "../../theme/colors";
import { Packs } from "./Packs";
import { IReward } from "./types";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface StepRewardProps {
  reward?: IReward;
}

export const StepReward = ({ reward }: StepRewardProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const { isSmallScreen } = useResponsiveValues();
  const pack = reward?.packs?.[0];

  return (
    <Flex
      w="50%"
      justifyContent="center"
      alignItems="center"
      position="relative"
      opacity={reward?.status === RewardStatus.UNCLAIMED ? 1 : 0.5}
    >
      {pack && reward && (
        <>
          <Packs reward={reward} />

          {reward.status === RewardStatus.UNCLAIMED && (
            <Flex position={"absolute"} bottom={2} zIndex={4}>
              <Button
                size="xs"
                h={isSmallScreen ? 4 : 8}
                fontSize={isSmallScreen ? 6 : 10}
                boxShadow={`0 0 5px 2px ${VIOLET}`}
                variant="secondarySolid"
              >
                {t("claim")}
              </Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
