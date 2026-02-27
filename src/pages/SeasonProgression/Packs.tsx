import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { RewardStatus } from "../../enums/rewardStatus";
import { BLUE_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { STEP_HEIGHT } from "./Step";
import { IReward } from "./types";

interface PacksProps {
  reward: IReward;
  claiming?: boolean;
}

const getRotation = (index: number, amountOfPacks: number) => {
  if (amountOfPacks === 2) {
    return index === 0 ? "-10" : "10";
  } else if (amountOfPacks === 3) {
    return index === 0 ? "-15" : index === 1 ? "0" : "15";
  }
  return 0;
};
const getTranslation = (index: number, amountOfPacks: number) => {
  if (amountOfPacks === 2) {
    return index === 0 ? "-15" : "15";
  } else if (amountOfPacks === 3) {
    return index === 0 ? "-20" : index === 1 ? "0" : "20";
  }
  return 0;
};

export const Packs = ({ reward, claiming }: PacksProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const { isSmallScreen } = useResponsiveValues();
  const amountOfPacks = reward.packs.length;
  const tournamentEntrySize = STEP_HEIGHT * 0.5;
  const xOffset = isSmallScreen ? 5 : 10;
  const yOffset = isSmallScreen ? 3 : 7;

  return reward.tournamentEntries > 0 ? (
    <Flex flexDir="column" gap={2}>
      {claiming ? (
        <Text size="s" textTransform={"uppercase"}>
          {t("claiming-in-progress")}
        </Text>
      ) : (
        <Text size="s" textTransform={"uppercase"}>
          {t("tournament-entry")}{" "}
          {reward.tournamentEntries > 1 && `x ${reward.tournamentEntries}`}
        </Text>
      )}
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        w="100%"
        h={tournamentEntrySize}
      >
        {Array.from({ length: reward.tournamentEntries }).map((_, index) => (
          <CachedImage
            key={`tournament-entry-${index}`}
            zIndex={3}
            transform={`translateX(${xOffset * index}px) translateY(${yOffset * index}px)`}
            position="absolute"
            src={`tournament-entry.png`}
            h={`${tournamentEntrySize}px`}
          />
        ))}
        <Flex
          position="absolute"
          w={`${tournamentEntrySize * 1}px`}
          h={`${tournamentEntrySize * 1}px`}
          borderRadius={"full"}
          boxShadow={
            reward.status === RewardStatus.UNCLAIMED
              ? `0 0 15px 2px ${BLUE_LIGHT}`
              : "0 0 10px 0px rgba(255,255,255,0.5)"
          }
        />
      </Flex>
    </Flex>
  ) : (
    reward.packs.map((pack, index) => (
      <CachedImage
        zIndex={3}
        position="absolute"
        transform={`rotate(${getRotation(index, amountOfPacks)}deg) translateX(${getTranslation(index, amountOfPacks)}px)`}
        boxShadow={
          reward.status === RewardStatus.UNCLAIMED
            ? `0 0 15px 2px ${BLUE_LIGHT}, inset 0 0 10px 0px ${BLUE_LIGHT}`
            : "0 0 10px 0px rgba(255,255,255,0.5)"
        }
        src={`/packs/${pack}.png`}
        h={`${STEP_HEIGHT * 0.78}px`}
      />
    ))
  );
};
