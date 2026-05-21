import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock } from "../../../components/Clock";
import { DailyMissions } from "../../../components/DailyMissions/DailyMissions";
import { WeeklyMissions } from "../../../components/DailyMissions/WeeklyMissions";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../../../dojo/queries/getDailyMissions";
import { useDojo } from "../../../dojo/useDojo";
import { BLUE } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { DailyMission } from "../../../types/DailyMissions";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../../utils/missionsTimers";
import { RegularBanner } from "./RegularBanner";

export const DailyMissionsBanner = () => {
  const navigate = useNavigate();
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });
  const { t: tMissions } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    if (!account) {
      setDailyMissions([]);
      setWeeklyMissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      getDailyMissions(client, account.address),
      getWeeklyMissions(client, account.address),
    ])
      .then(([daily, weekly]) => {
        setDailyMissions(daily);
        setWeeklyMissions(weekly);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, client]);

  const { isSmallScreen } = useResponsiveValues();
  const date = useMemo(
    () =>
      activeTab === "daily"
        ? getNextDailyMissionResetDate()
        : getNextWeeklyMissionResetDate(),
    [activeTab],
  );

  return (
    <RegularBanner
      title={t("missions")}
      headerContent={
        <Flex
          w="100%"
          flexDir="column"
          gap={2}
          mb={2}
          pt={isSmallScreen ? 2 : 1}
        >
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
          >
            <Heading fontSize={isSmallScreen ? 12 : 16} variant="italic">
              {t("missions")}
            </Heading>
            <Clock date={date} fontSize={isSmallScreen ? 10 : 12} />
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
            mb={isSmallScreen ? 1 : 1.5}
          >
            <Tabs
              index={activeTab === "daily" ? 0 : 1}
              onChange={(index) =>
                setActiveTab(index === 0 ? "daily" : "weekly")
              }
              isFitted
              color="white"
              variant="secondary"
              flex="1"
              minW={0}
            >
              <TabList
                w={isSmallScreen ? "164px" : "206px"}
                minW={isSmallScreen ? "164px" : "206px"}
                maxW={isSmallScreen ? "164px" : "206px"}
                h={isSmallScreen ? "21px" : "28px"}
                py={isSmallScreen ? 0.5 : 1}
                px={isSmallScreen ? "2px" : "4px"}
              >
                <Tab
                  h={isSmallScreen ? "15px" : "18px !important"}
                  minH="unset"
                  fontSize={isSmallScreen ? "10px" : "12px"}
                  px={0}
                  py={0}
                  mx={0}
                  whiteSpace="nowrap"
                >
                  {tMissions("daily-short-title")}
                </Tab>
                <Tab
                  h={isSmallScreen ? "15px" : "18px !important"}
                  minH="unset"
                  fontSize={isSmallScreen ? "10px" : "12px"}
                  px={0}
                  py={0}
                  mx={0}
                  whiteSpace="nowrap"
                >
                  {tMissions("weekly-short-title")}
                </Tab>
              </TabList>
            </Tabs>
            <Button
              h={isSmallScreen ? "22px" : "14px"}
              px={isSmallScreen ? 3 : 4}
              borderRadius="full"
              border={`1px solid ${BLUE}`}
              background="transparent"
              color="white"
              fontSize={isSmallScreen ? "10px" : "12px"}
              textTransform="uppercase"
              flexShrink={0}
              boxShadow={`0 0 4px 2px ${BLUE}`}
              onClick={() => navigate("/missions")}
            >
              {t("seeMore")}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <Box display="grid" w="100%">
        <Box
          gridArea="1 / 1"
          opacity={activeTab === "daily" ? 1 : 0}
          pointerEvents={activeTab === "daily" ? "auto" : "none"}
          transition="opacity 0.2s ease"
        >
          <DailyMissions
            showTitle={false}
            compacted
            missions={dailyMissions}
            loading={loading}
          />
        </Box>
        <Box
          gridArea="1 / 1"
          opacity={activeTab === "weekly" ? 1 : 0}
          pointerEvents={activeTab === "weekly" ? "auto" : "none"}
          transition="opacity 0.2s ease"
        >
          <WeeklyMissions
            showTitle={false}
            compacted
            missions={weeklyMissions}
            loading={loading}
          />
        </Box>
      </Box>
      <Flex h={2} />
    </RegularBanner>
  );
};
