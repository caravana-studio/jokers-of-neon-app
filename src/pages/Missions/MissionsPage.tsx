import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock } from "../../components/Clock";
import {
  DailyMissionEntry,
  WeeklyMissionEntry,
} from "../../components/DailyMissions/MissionEntries";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";

const MISSION_PANEL_STYLES = {
  background: "rgba(0, 0, 0, 0.4)",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)",
  backdropFilter: "blur(2px)",
};

interface MissionsPageProps {
  inGame?: boolean;
}

export const MissionsPage = ({ inGame = false }: MissionsPageProps) => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { setInformation } = useInformationPopUp();
  const {
    setup: { client },
    account: { account },
  } = useDojo();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) {
      setDailyMissions([]);
      setWeeklyMissions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      getDailyMissions(client, account.address),
      getWeeklyMissions(client, account.address),
    ])
      .then(([daily, weekly]) => {
        if (cancelled) {
          return;
        }

        setDailyMissions([...daily].sort((a, b) => a.xp - b.xp));
        setWeeklyMissions([...weekly].sort((a, b) => a.xp - b.xp));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [account, client]);

  const dailyResetAt = getNextDailyMissionResetDate(new Date());
  const weeklyResetAt = getNextWeeklyMissionResetDate(new Date());

  const infoContent = useMemo(
    () => (
      <VStack align="start" spacing={4}>
        <Heading size="sm" variant="italic">
          {t("learn-more.popup-title")}
        </Heading>
        <Divider borderColor={BLUE} />
        <VStack align="start" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.1")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.2")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.3")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.4")}
          </Text>
        </VStack>
      </VStack>
    ),
    [t]
  );

  return (
    <DelayedLoading ms={100} loading={loading}>
      <MobileDecoration />
      <Flex
        w="100%"
        overflowY="auto"
        overflowX="hidden"
        px={{ base: 4, sm: 7, md: 10 }}
        pt={{ base: "27px", sm: "74px" }}
        position="relative"
        flexGrow={1}
        minH={0}
      >
        <Flex
          w="100%"
          maxW="760px"
          mx="auto"
          flexDir="column"
          justifyContent="space-between"
        >
          <Flex flexDir="column" gap={3}>
            <Heading
              variant="italic"
              fontSize={{ base: "20px", sm: "30px" }}
              px={2}
              zIndex={10}
            >
              {t("title")}
            </Heading>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              px={2}
            >
              <Heading
                variant="italic"
                fontSize={{ base: "15px", sm: "22px" }}
                zIndex={10}
              >
                {t("weekly-short-title")}
              </Heading>
              <Flex w={{ base: "80px", sm: "120px" }} justifyContent="flex-end">
                <Clock
                  date={weeklyResetAt}
                  fontSize={isSmallScreen ? 12 : 16}
                  iconSize={isSmallScreen ? "12px" : "18px"}
                />
              </Flex>
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 3, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 4, sm: 5 }}>
                {weeklyMissions.map((mission) => (
                  <WeeklyMissionEntry
                    key={`weekly-${mission.missionId}`}
                    mission={mission}
                    xpLabel={t("xp-label")}
                  />
                ))}
              </Flex>
            </Box>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              gap={2}
              px={2}
            >
              <Heading variant="italic" fontSize={{ base: "15px", sm: "22px" }}>
                {t("daily-short-title")}
              </Heading>
              <Flex w={{ base: "80px", sm: "120px" }} justifyContent="flex-end">
                <Clock
                  date={dailyResetAt}
                  fontSize={isSmallScreen ? 12 : 16}
                  iconSize={isSmallScreen ? "12px" : "18px"}
                />
              </Flex>
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 4, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 5, sm: 6 }}>
                {dailyMissions.map((mission) => (
                  <DailyMissionEntry
                    key={`daily-${mission.missionId}`}
                    mission={mission}
                    xpLabel={t("xp-label")}
                    completed={mission.completed}
                  />
                ))}
              </Flex>
            </Box>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              mt={1}
              px={2}
            >
              <Flex>
                <Text
                  fontSize={{ base: "15px", sm: "18px" }}
                  textShadow="0 0 8px rgba(255,255,255,0.18)"
                >
                  {t("learn-more.question")}
                </Text>
              </Flex>
              <Flex>
                <Button
                  variant="outlinePrimaryGlow"
                  size="sm"
                  onClick={() => setInformation(infoContent)}
                >
                  {t("learn-more.cta")}
                </Button>
              </Flex>
            </Flex>
          </Flex>

          {inGame && (
            <MobileBottomBar
              firstButton={{
                label: t("bottom-bar.back-to-game"),
                onClick: () => navigate("/redirect"),
                variant: "solid",
                fontSize: { base: "8px", sm: "10px", md: "15px" },
                px: { base: 2, sm: 3, md: 7 },
                h: { base: "32px", sm: "40px" },
              }}
            />
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
