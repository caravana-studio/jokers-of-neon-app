import { Flex, Text } from "@chakra-ui/react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { BLUE, BLUE_RGBA, VIOLET, VIOLET_RGBA } from "../../theme/colors";
import { Countdown } from "../Countdown";

interface DailyGameProps {
  seasonPassUnlocked: boolean;
  unlockedPercentage: number;
  nextLiveIn: Date;
  noLives?: boolean;
}

export const DailyGame = ({
  seasonPassUnlocked,
  unlockedPercentage,
  nextLiveIn,
  noLives,
}: DailyGameProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "daily-games",
  });
  return (
    <Flex
      flexDir="column"
      gap={2}
      justifyContent={"flex-start"}
      alignItems={"center"}
      h="100%"
    >
      <Flex
        w="30px"
        h="30px"
        borderRadius="50px"
        p={2}
        backgroundImage={`linear-gradient(90deg, ${seasonPassUnlocked ? VIOLET_RGBA(1) : BLUE_RGBA(1)} 0%, ${seasonPassUnlocked ? VIOLET_RGBA(1) : BLUE_RGBA(1)} ${unlockedPercentage - 10}%, ${seasonPassUnlocked ? VIOLET_RGBA(0) : BLUE_RGBA(0)} ${unlockedPercentage + 10}%);`}
        justifyContent={"center"}
        boxShadow={unlockedPercentage === 100 ? seasonPassUnlocked ? `0 0 7px 3px ${VIOLET}` : `0 0 7px 3px ${BLUE}` : "none"}
        alignItems={"center"}
        border={`1px solid ${seasonPassUnlocked ? VIOLET : BLUE}`}
      >
        <FontAwesomeIcon
          color="white"
          fontSize={18}
          icon={faHeart}
          style={{ opacity: unlockedPercentage < 100 ? 0.5 : 1 }}
        />
      </Flex>
      {!noLives &&unlockedPercentage < 100 && unlockedPercentage > 0 && (
        <Flex flexDir="column" gap={0.5} textAlign={"center"}>
          <Text lineHeight={0.9} textTransform={"lowercase"} w="40px">{t("next-live-in")}</Text>
          <Countdown targetDate={nextLiveIn}>
            {({ formatted }) => <Text fontWeight={"bold"}>{formatted}</Text>}
          </Countdown>
        </Flex>
      )}
    </Flex>
  );
};
