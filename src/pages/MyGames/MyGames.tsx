import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DailyGames } from "../../components/DailyGames/DailyGames.tsx";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { logEvent } from "../../utils/analytics.ts";
import { GamesListBox } from "./GamesListBox.tsx";

export interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
  currentNodeId?: number;
  round?: number;
  isTournament?: boolean;
}

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });
  useEffect(() => {
    logEvent("open_my_games_page");
  }, []);

  const { isSmallScreen } = useResponsiveValues();

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        direction="column"
        justifyContent={isSmallScreen ? "space-between" : "center"}
        alignItems="center"
        height="100%"
        width="100%"
        pt={[8, 16]}
        pb={[0, 4]}
      >
        <Flex
          flexDirection={"column"}
          height={isSmallScreen ? "75%" : "70%"}
          // bgColor="red"
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Heading
            mb={8}
            zIndex={2}
            variant="italic"
            size={isSmallScreen ? "sm" : "md"}
          >
            {t("title")}
          </Heading>
          <GamesListBox isTournament={false} />
        </Flex>
        <Flex
          w="100%"
          // bgColor="blue"
          h={isSmallScreen ? "25%" : "30%"}
          justifyContent={"center"}
          alignItems={"center"}
          pb={4}
        >
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="center"
            gap={isSmallScreen ? 4 : 6}
          >
            <DailyGames />
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
