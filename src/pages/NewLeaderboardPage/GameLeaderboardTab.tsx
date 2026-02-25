import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { Leaderboard } from "../../components/Leaderboard";
import { useGameIdRange } from "../../queries/useGameIdRange";
import { useSeason } from "../../queries/useSeason";
import type { Prize } from "../../queries/useTournamentSettings";
import {
  addDaysToUtcDateString,
  getCurrentGameLeaderboardPeriods,
} from "../../utils/leaderboardPeriods";
import { SeePrizesSwitcher } from "./SeePrizesSwitcher";

const HIDE_DAILY_WEEKLY_LEADERBOARDS =
  String(import.meta.env.VITE_HIDE_DAILY_WEEKLY_LEADERBOARDS).toLowerCase() ===
  "true";

type SectionProps = {
  title?: string;
  clockDate?: Date;
  showClockLoader?: boolean;
  isSmallScreen: boolean;
  mt?: number;
  children: React.ReactNode;
};

const LeaderboardSection = ({
  title,
  clockDate,
  showClockLoader = false,
  isSmallScreen,
  mt = 4,
  children,
}: SectionProps) => {
  return (
    <Box w="100%" mt={mt}>
      {(title || clockDate) && (
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          px={isSmallScreen ? 2 : 6}
        >
          <Heading variant="italic" fontSize={isSmallScreen ? "sm" : "md"}>
            {title}
          </Heading>
          {clockDate && (
            <Flex alignItems="center" gap={2}>
              {showClockLoader && <Spinner size="xs" />}
              <Clock date={clockDate} />
            </Flex>
          )}
        </Flex>
      )}
      {children}
    </Box>
  );
};

type DailyLeaderboardSectionProps = {
  date: string;
  resetAt: Date;
  isSmallScreen: boolean;
  seePrizes: boolean;
  prizes: Record<number, Prize>;
};

const DailyLeaderboardSection = ({
  date,
  resetAt,
  isSmallScreen,
  seePrizes,
  prizes,
}: DailyLeaderboardSectionProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const dailyRangeQuery = useGameIdRange(date, addDaysToUtcDateString(date, 1));
  const dailyRange = dailyRangeQuery.data;
  const hasDailyRange =
    dailyRange?.startGameId !== null && dailyRange?.endGameId !== null;

  return (
    <LeaderboardSection
      title={t("sections.daily")}
      clockDate={resetAt}
      showClockLoader={dailyRangeQuery.isLoading}
      isSmallScreen={isSmallScreen}
      mt={4}
    >
      <Leaderboard
        lines={3}
        mb="0"
        isTournamentLeaderboard={false}
        startGameId={dailyRange?.startGameId}
        queryEnabled={dailyRangeQuery.isSuccess && hasDailyRange}
        seePrizes={seePrizes}
        prizes={prizes}
        fullWidth
        compactSpacing
      />
    </LeaderboardSection>
  );
};

type WeeklyLeaderboardSectionProps = {
  startDate: string;
  currentDate: string;
  resetAt: Date;
  isSmallScreen: boolean;
  seePrizes: boolean;
  prizes: Record<number, Prize>;
};

const WeeklyLeaderboardSection = ({
  startDate,
  currentDate,
  resetAt,
  isSmallScreen,
  seePrizes,
  prizes,
}: WeeklyLeaderboardSectionProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const weeklyRangeQuery = useGameIdRange(
    startDate,
    addDaysToUtcDateString(currentDate, 1)
  );
  const weeklyRange = weeklyRangeQuery.data;
  const hasWeeklyRange =
    weeklyRange?.startGameId !== null && weeklyRange?.endGameId !== null;

  return (
    <LeaderboardSection
      title={t("sections.weekly")}
      clockDate={resetAt}
      showClockLoader={weeklyRangeQuery.isLoading}
      isSmallScreen={isSmallScreen}
      mt={6}
    >
      <Leaderboard
        lines={5}
        mb="0"
        isTournamentLeaderboard={false}
        startGameId={weeklyRange?.startGameId}
        queryEnabled={weeklyRangeQuery.isSuccess && hasWeeklyRange}
        seePrizes={seePrizes}
        prizes={prizes}
        fullWidth
        compactSpacing
      />
    </LeaderboardSection>
  );
};

type SeasonLeaderboardSectionProps = {
  finishDate: Date | null;
  isSmallScreen: boolean;
  seePrizes: boolean;
  prizes: Record<number, Prize>;
};

const SeasonLeaderboardSection = ({
  finishDate,
  isSmallScreen,
  seePrizes,
  prizes,
}: SeasonLeaderboardSectionProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });

  return (
    <LeaderboardSection
      title={
        HIDE_DAILY_WEEKLY_LEADERBOARDS ? undefined : t("sections.season")
      }
      clockDate={finishDate ?? undefined}
      isSmallScreen={isSmallScreen}
      mt={HIDE_DAILY_WEEKLY_LEADERBOARDS ? 0 : 6}
    >
      <Leaderboard
        lines={50}
        mb="0"
        isTournamentLeaderboard={false}
        seePrizes={seePrizes}
        prizes={prizes}
        fullWidth
        compactSpacing
      />
    </LeaderboardSection>
  );
};

type GameLeaderboardTabProps = {
  isSmallScreen?: boolean;
};

export const GameLeaderboardTab = ({ isSmallScreen }: GameLeaderboardTabProps) => {
  const [now, setNow] = useState(() => new Date());
  const [seePrizes, setSeePrizes] = useState(false);
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);
  const { season } = useSeason();
  const isSmallScreenLayout = Boolean(isSmallScreen);
  const dailyPrizes = season?.dailyPrizes ?? {};
  const weeklyPrizes = season?.weeklyPrizes ?? {};
  const seasonPrizes = season?.seasonPrizes ?? {};

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Flex w="100%" h="100%" flexDir="column" alignItems="center">
      <Flex
        w="70%"
        h="100%"
        flexDir="column"
        minH={0}
      >
        <Flex
          justifyContent="flex-end"
          px={isSmallScreenLayout ? 2 : 6}
          pt={4}
          pb={2}
        >
          <SeePrizesSwitcher
            id="global-see-prizes"
            value={seePrizes}
            onChange={setSeePrizes}
          />
        </Flex>
        <Flex
          flexDir={
            isSmallScreenLayout || HIDE_DAILY_WEEKLY_LEADERBOARDS
              ? "column"
              : "row"
          }
          flexGrow={1}
          minH={0}
          gap={isSmallScreenLayout ? 0 : 4}
          overflowY={isSmallScreenLayout ? "auto" : "hidden"}
          pb={isSmallScreenLayout ? "100px" : "200px"}
        >
          {!HIDE_DAILY_WEEKLY_LEADERBOARDS && (
            <Flex
              w={isSmallScreenLayout ? "100%" : "50%"}
              h={isSmallScreenLayout ? "auto" : "100%"}
              overflowY={isSmallScreenLayout ? "visible" : "auto"}
            >
              <Flex w="100%" flexDir="column">
                <DailyLeaderboardSection
                  date={periods.daily.date}
                  resetAt={periods.daily.resetAt}
                  isSmallScreen={isSmallScreenLayout}
                  seePrizes={seePrizes}
                  prizes={dailyPrizes}
                />
                <WeeklyLeaderboardSection
                  startDate={periods.weekly.startDate}
                  currentDate={periods.weekly.currentDate}
                  resetAt={periods.weekly.resetAt}
                  isSmallScreen={isSmallScreenLayout}
                  seePrizes={seePrizes}
                  prizes={weeklyPrizes}
                />
              </Flex>
            </Flex>
          )}
          <Flex
            w={
              isSmallScreenLayout || HIDE_DAILY_WEEKLY_LEADERBOARDS
                ? "100%"
                : "50%"
            }
            h={isSmallScreenLayout ? "auto" : "100%"}
            overflowY={isSmallScreenLayout ? "visible" : "auto"}
          >
            <Flex w="100%" flexDir="column">
              <SeasonLeaderboardSection
                finishDate={season?.finishDate ?? null}
                isSmallScreen={isSmallScreenLayout}
                seePrizes={seePrizes}
                prizes={seasonPrizes}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
