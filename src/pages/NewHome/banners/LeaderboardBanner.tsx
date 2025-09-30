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
  console.log("fullLeaderboard", fullLeaderboard);

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
        bottom="-30px"
        height={isSmallScreen ? "170px" : "250px"}
        src="/leaderboard/podium.png"
      />
      {leaders[0] && (
        <Text
          position="absolute"
          left="68px"
          top="7px"
          width="70px"
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[0]}
        </Text>
      )}
      {leaders[1] && (
        <Text
          position="absolute"
          left="10px"
          top="44px"
          width="70px"
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[1]}
        </Text>
      )}
      {leaders[2] && (
        <Text
          position="absolute"
          left="125px"
          top="63px"
          width="70px"
          textAlign="center"
          lineHeight={0.9}
        >
          {leaders[2]}
        </Text>
      )}
      <Flex w="100%" h="100%" flexDir="column" justifyContent="space-between">
        <Flex flexDir="column">
          <Heading
            fontSize={isSmallScreen ? "xs" : "md"}
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
            size="sm"
            height="20px"
            variant="secondarySolid"
            onClick={() => navigate("/leaderboard")}
          >
            {t("button")}{" "}
            <FontAwesomeIcon
              style={{ marginLeft: "5px", marginTop: "2px" }}
              color="white"
              fontSize={7}
              icon={faArrowRight}
            />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
