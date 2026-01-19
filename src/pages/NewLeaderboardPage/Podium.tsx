import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { getPrizeText } from "../../components/Leaderboard";
import { useGetLeaderboard } from "../../queries/useGetLeaderboard";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { useGameStore } from "../../state/useGameStore";
import { VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { formatNumber } from "../../utils/formatNumber";
interface PodiumProps {
  seePrizes?: boolean;
}

export const Podium = ({ seePrizes = false }: PodiumProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const { id: gameId } = useGameStore();
  const { tournament } = useTournamentSettings();
  const isTournament = Boolean(tournament?.isActive);

  const { data: fullLeaderboard } = useGetLeaderboard(
    gameId,
    true,
    isTournament
  );
  const leaders = fullLeaderboard?.slice(0, 3);

  return (
    <Flex
      w={isSmallScreen ? "220px" : "440px"}
      mt={6}
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <CachedImage src="/leaderboard/podium.png" />
      {leaders[0] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "75px" : "150px"}
            top={isSmallScreen ? "10px" : "30px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[0].player_name}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "75px" : "150px"}
            top={isSmallScreen ? "120px" : "240px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {seePrizes ? (
              <Text
                textAlign="center"
                fontSize={isSmallScreen ? 8 : 14}
                overflowWrap="break-word"
                wordBreak="normal"
                whiteSpace="normal"
                lineHeight="1.2"
              >
                {getPrizeText(t, tournament?.prizes[1])}
              </Text>
            ) : (
              <Flex
                flexDir="column"
                gap={isSmallScreen ? 0 : 1}
                alignItems={"center"}
              >
                <Flex gap={2}>
                  <Text color="lightViolet">
                    {t("level")}
                    {leaders[0].level}
                  </Text>
                  <Text color="white">
                    {t("round")}
                    {leaders[0].round}
                  </Text>
                </Flex>
                <Text color={VIOLET_LIGHT}>
                  {formatNumber(leaders[0].player_score)} {t("points")}
                </Text>
              </Flex>
            )}
          </Flex>
        </>
      )}
      {leaders[1] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "5px" : "10px"}
            top={isSmallScreen ? "55px" : "120px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[1].player_name}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "5px" : "10px"}
            top={isSmallScreen ? "160px" : "320px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {seePrizes ? (
              <Text
                textAlign="center"
                fontSize={isSmallScreen ? 8 : 14}
                overflowWrap="break-word"
                wordBreak="normal"
                whiteSpace="normal"
                lineHeight="1.2"
              >
                {getPrizeText(t, tournament?.prizes[2])}
              </Text>
            ) : (
              <Flex
                flexDir="column"
                gap={isSmallScreen ? 0 : 1}
                alignItems={"center"}
              >
                <Flex gap={2}>
                  <Text color="lightViolet">
                    {t("level")}
                    {leaders[1].level}
                  </Text>
                  <Text color="white">
                    {t("round")}
                    {leaders[1].round}
                  </Text>
                </Flex>
                <Text color={VIOLET_LIGHT}>
                  {formatNumber(leaders[1].player_score)} {t("points")}
                </Text>
              </Flex>
            )}
          </Flex>
        </>
      )}
      {leaders[2] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "145px" : "295px"}
            top={isSmallScreen ? "84px" : "178px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[2].player_name}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "145px" : "295px"}
            top={isSmallScreen ? "173px" : "346px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {seePrizes ? (
              <Text
                textAlign="center"
                fontSize={isSmallScreen ? 8 : 14}
                overflowWrap="break-word"
                wordBreak="normal"
                whiteSpace="normal"
                lineHeight="1.2"
              >
                {getPrizeText(t, tournament?.prizes[3])}
              </Text>
            ) : (
              <Flex
                flexDir="column"
                gap={isSmallScreen ? 0 : 1}
                alignItems={"center"}
              >
                <Flex gap={2}>
                  <Text color="lightViolet">
                    {t("level")}
                    {leaders[2].level}
                  </Text>
                  <Text color="white">
                    {t("round")}
                    {leaders[2].round}
                  </Text>
                </Flex>
                <Text color={VIOLET_LIGHT}>
                  {formatNumber(leaders[2].player_score)} {t("points")}
                </Text>
              </Flex>
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
};
