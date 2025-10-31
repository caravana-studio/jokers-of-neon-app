import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../providers/GameProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Countdown } from "../Countdown";
import { DailyGame } from "./DailyGame";

export const DailyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "daily-games",
  });
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const navigate = useNavigate();
  const { seasonPassUnlocked } = useSeasonPass();

  const TOTAL_SLOTS = seasonPassUnlocked ? 4 : 2;
  const AVAILABLE_LIVES: number = 2;
  const NEXT_LIVE_IN = new Date(Date.now() + 1000 * 60 * 60 * 2);
  const RECHARGE_TIME = seasonPassUnlocked ? 4 : 12;

  const { isSmallScreen } = useResponsiveValues();

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
  };
  const rechargeMs = RECHARGE_TIME * 60 * 60 * 1000;

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, slotIndex) => {
    if (slotIndex < AVAILABLE_LIVES) {
      return 100;
    }

    if (slotIndex === AVAILABLE_LIVES) {
      const timeUntilNext = NEXT_LIVE_IN.getTime() - Date.now();
      const progress = 1 - timeUntilNext / rechargeMs;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      return clampedProgress * 100;
    }

    return 0;
  });

  return (
    <Flex flexDir="column" gap={2}>
      <Text textTransform={"uppercase"} textAlign={"center"}>
        {AVAILABLE_LIVES === 0
          ? t("out-of-lives")
          : AVAILABLE_LIVES === 1
            ? t("you-have-1-live-left")
            : t("you-have-x-lives-left", { lives: AVAILABLE_LIVES })}
      </Text>
      <Flex w="100%" justifyContent={"center"} gap={isSmallScreen ? 2 : 6}>
        {slots.map((unlockedPercentage, index) => (
          <DailyGame
            key={index}
            seasonPassUnlocked={seasonPassUnlocked}
            unlockedPercentage={unlockedPercentage}
            nextLiveIn={NEXT_LIVE_IN}
            noLives={AVAILABLE_LIVES === 0}
          />
        ))}
        {AVAILABLE_LIVES > 0 ? (
          <Button
            onClick={handleCreateGame}
            width={isSmallScreen ? "100px" : "200px"}
            ml={1}
            fontSize={isSmallScreen ? 10 : 15}
            h={isSmallScreen ? "30px" : "50px"}
            variant="solid"
          >
            {t("new-game")}
          </Button>
        ) : (
          <Flex
            width={isSmallScreen ? "100px" : "200px"}
            ml={1}
            fontSize={isSmallScreen ? 9 : 15}
            h={isSmallScreen ? "30px" : "50px"}
            border={`1px solid ${BLUE}`}
            borderRadius={"full"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDir={"column"}
            textAlign={"center"}
          >
            <Text
              fontSize={isSmallScreen ? 9 : 15}
              lineHeight={0.9}
              textTransform={"lowercase"}
              w="100%"
            >
              {t("next-live-in")}
            </Text>
            <Countdown targetDate={NEXT_LIVE_IN}>
              {({ formatted }) => (
                <Text
                  fontSize={isSmallScreen ? 9 : 15}
                  fontWeight={"bold"}
                  lineHeight={1}
                >
                  {formatted}
                </Text>
              )}
            </Countdown>
          </Flex>
        )}
      </Flex>
      {AVAILABLE_LIVES === 0 && !seasonPassUnlocked && (
        <Flex
          gap={1}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => navigate("/shop")}
        >
          <Text fontSize={isSmallScreen ? 9 : 15} textTransform={"uppercase"}>
            {t("get-more-lives")}
          </Text>{" "}
          <Text
            fontSize={isSmallScreen ? 9 : 15}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color="lightViolet"
          >
            {t("season-pass")}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
