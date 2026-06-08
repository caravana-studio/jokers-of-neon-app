import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { MissionsPanels } from "../../components/Missions/MissionsPanels";
import { useMissionsData } from "../../hooks/useMissionsData";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";

interface MissionsPageProps {
  inGame?: boolean;
}

export const MissionsPage = ({ inGame = false }: MissionsPageProps) => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const { dailyMissions, weeklyMissions, loading } = useMissionsData({
    inGame,
  });

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
    <DelayedLoading ms={0} loading={loading}>
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
          maxW={{ base: "760px", md: "1120px", lg: "1400px" }}
          mx="auto"
          flexDir="column"
          minH={{ base: "auto", md: "calc(100dvh - 74px)" }}
          gap={{ base: 3, md: 0 }}
        >
          <Heading
            variant="italic"
            fontSize={{ base: "20px", sm: "30px" }}
            px={2}
            zIndex={10}
          >
            {t("title")}
          </Heading>
          <Flex
            flex={{ base: "0 0 auto", md: 1 }}
            alignItems={{ base: "stretch", md: "center" }}
            justifyContent={{ base: "flex-start", md: "center" }}
            py={{ base: 0, md: 6 }}
          >
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
              gap={{ base: 3, md: 6 }}
              alignItems="start"
              w="100%"
            >
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <MissionsPanels
                  dailyMissions={dailyMissions}
                  weeklyMissions={weeklyMissions}
                  dailyResetAt={dailyResetAt}
                  weeklyResetAt={weeklyResetAt}
                  showProgress={inGame}
                />
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
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
              </GridItem>
            </Grid>
          </Flex>

          {inGame && !isSmallScreen &&(
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
