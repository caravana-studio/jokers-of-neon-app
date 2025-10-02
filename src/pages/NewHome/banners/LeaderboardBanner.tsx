import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../../components/CachedImage";
import { Clock } from "../../../components/Clock";
import { useGetLeaderboard } from "../../../queries/useGetLeaderboard";
import { useGameStore } from "../../../state/useGameStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

export const LeaderboardBanner = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.leaderboard-banner",
  });
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { id: gameId } = useGameStore();
  const { data: fullLeaderboard } = useGetLeaderboard(gameId);

  const leaders = fullLeaderboard
    ?.slice(0, 3)
    .map((player) => player.player_name);
  return (
    <Flex
      w="100%"
      position="relative"
      overflow="hidden"
      h={isSmallScreen ? "140px" : "300px"}
      backgroundImage={"url('/banners/leaderboard-tile-bg.png')"}
      backgroundSize={"cover"}
      backgroundPosition={"center"}
      borderRadius={"15px"}
      p={4}
      flexDir={"column"}
    >
      <CachedImage
        position="absolute"
        bottom={isSmallScreen ? "-30px" : "-60px"}
        height={isSmallScreen ? "170px" : "350px"}
        src="/leaderboard/podium.png"
      />
      {leaders[0] && (
        <Text
          position="absolute"
          left={isSmallScreen ? "68px" : "125px"}
          top={isSmallScreen ? "7px" : "35px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[0]}
        </Text>
      )}
      {leaders[1] && (
        <Text
          position="absolute"
          left={isSmallScreen ? "10px" : "8px"}
          top={isSmallScreen ? "44px" : "112px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[1]}
        </Text>
      )}
      {leaders[2] && (
        <Text
          position="absolute"
          left={isSmallScreen ? "125px" : "245px"}
          top={isSmallScreen ? "63px" : "160px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[2]}
        </Text>
      )}
      <Flex w="100%" h="100%" flexDir="column" justifyContent="space-between">
        <Flex flexDir="column">
          <Heading
            fontSize={isSmallScreen ? "xs" : "lg"}
            mb={1}
            variant="italic"
            textAlign="right"
          >
            {t("title")}
          </Heading>
          <Flex justifyContent={"flex-end"}>
            <Clock date={new Date("2025-10-20T00:00:00")} />
          </Flex>
        </Flex>
        <Flex justifyContent={"flex-end"}>
          <Button
            size={isSmallScreen ? "sm" : "md"}
            height={isSmallScreen ? "20px" : "unset"}
            variant="secondarySolid"
            onClick={() => navigate("/leaderboard")}
          >
            {t("button")}{" "}
            <FontAwesomeIcon
              style={{ marginLeft: "5px", marginTop: "2px" }}
              color="white"
              fontSize={isSmallScreen ? 7 : 15}
              icon={faArrowRight}
            />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
