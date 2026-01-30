import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDojo } from "../../dojo/useDojo";
import { useGameActions } from "../../dojo/useGameActions";
import { useGameContext } from "../../providers/GameProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { getPlayerLives } from "../../queries/getPlayerLives";
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
  const [availableLives, setAvailableLives] = useState(0);
  const [totalSlots, setTotalSlots] = useState(seasonPassUnlocked ? 6 : 3);
  const [nextLiveIn, setNextLiveIn] = useState<Date | undefined>(undefined);

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const { claimLives } = useGameActions();

  const fetchPlayerLives = () => {
    getPlayerLives(client, { playerAddress: account.address }).then(
      (response) => {
        console.log("getPlayerLives response", response);
        if (!response.success || !response.data) return;

        setAvailableLives(response.data.available_lives);
        setTotalSlots(response.data.max_lives);
        response.data.next_live_timestamp &&
          setNextLiveIn(response.data.next_live_timestamp);
      },
    );
  };

  useEffect(() => {
    fetchPlayerLives();

    claimLives()
      .then((response) => {
        console.log("claimLives response", response);
        fetchPlayerLives();
      })
      .catch(() => {});
  }, []);

  const RECHARGE_TIME = seasonPassUnlocked ? 4 : 8;

  const { isSmallScreen } = useResponsiveValues();

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
  };
  const rechargeMs = RECHARGE_TIME * 60 * 60 * 1000;

  const slots = Array.from({ length: totalSlots }, (_, slotIndex) => {
    if (slotIndex < availableLives) {
      return 100;
    }

    if (slotIndex === availableLives) {
      const timeUntilNext = (nextLiveIn?.getTime() ?? 0) - Date.now();
      const progress = 1 - timeUntilNext / rechargeMs;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      return clampedProgress * 100;
    }

    return 0;
  });

  return (
    <Flex flexDir="column" gap={2}>
      <Text textTransform={"uppercase"} textAlign={"center"}>
        {availableLives === 0
          ? t("out-of-lives")
          : availableLives === 1
            ? t("you-have-1-live-left")
            : t("you-have-x-lives-left", { lives: availableLives })}
      </Text>
      <Flex
        w="100%"
        justifyContent={"center"}
        gap={isSmallScreen ? 2 : 6}
      >
        {slots.map((unlockedPercentage, index) => (
          <DailyGame
            key={index}
            seasonPassUnlocked={seasonPassUnlocked}
            unlockedPercentage={unlockedPercentage}
            nextLiveIn={nextLiveIn}
            noLives={availableLives === 0}
          />
        ))}
        {availableLives > 0 ? (
          <Button
            onClick={handleCreateGame}
            width={isSmallScreen ? "100px" : "200px"}
            ml={1}
            fontSize={isSmallScreen ? 10 : 15}
            h={isSmallScreen ? "30px" : "35px"}
            variant={seasonPassUnlocked ? "secondarySolid" : "solid"}
            mt={availableLives < totalSlots ? 1.5 : 0}
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
            {nextLiveIn && (
              <Countdown targetDate={nextLiveIn}>
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
            )}
          </Flex>
        )}
      </Flex>
      {availableLives === 0 && !seasonPassUnlocked && (
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
