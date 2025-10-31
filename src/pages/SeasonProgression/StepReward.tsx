import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { RewardStatus } from "../../enums/rewardStatus";
import { VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Packs } from "./Packs";
import { IReward } from "./types";

interface StepRewardProps {
  reward?: IReward;
  type: "free" | "premium";
  level: number;
}

export const StepReward = ({ reward, type, level }: StepRewardProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const { isSmallScreen } = useResponsiveValues();
  const pack = reward?.packs?.[0];
  const navigate = useNavigate();

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
            <Flex position={"absolute"} bottom={2.5} zIndex={4}>
              <Button
                size="xs"
                h={isSmallScreen ? 5 : 8}
                fontSize={isSmallScreen ? 10 : 12}
                boxShadow={`0 0 5px 2px ${VIOLET}`}
                variant="secondarySolid"
                onClick={() => {
                  navigate(`/claim-season-pack/${level}/${type}`);
                }}
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
