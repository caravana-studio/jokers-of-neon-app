import {
  Box,
  Button,
  Flex,
  Spinner,
  SystemStyleObject,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TESTERS } from "../constants/testers.ts";
import { XP_SEASON_LEADERBOARD_PRIZES } from "../constants/xpSeasonLeaderboardPrizes";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { useGetXpLeaderboard } from "../queries/useGetXpLeaderboard";
import { VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { getPrizePackIdsForSeason } from "../utils/prizePackIds";
import { useDojo } from "../dojo/DojoContext";
import { addressKey } from "../utils/starknetAddress";
import { CustomTr, getPrizeText } from "./Leaderboard";
import { SeasonPass } from "./SeasonPass/SeasonPass";

interface XpLeaderboardProps {
  lines?: number;
  mb?: string;
  seasonId: number;
  seePrizes?: boolean;
  fullWidth?: boolean;
  compactSpacing?: boolean;
}

const formatAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

type LeaderPrizeLog = {
  username: string;
  packs: string[];
};

export const XpLeaderboard = ({
  lines = 100,
  mb = "",
  seasonId,
  seePrizes = false,
  fullWidth = false,
  compactSpacing = false,
}: XpLeaderboardProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const { data: leaderboard, isLoading } = useGetXpLeaderboard(seasonId);
  const username = useUsername();
  const {
    account: { account },
  } = useDojo();
  const currentAddress = addressKey(account?.address);
  const currentSeasonNumber = Math.max(1, Math.floor(seasonId));

  const handleLogLeaders = () => {
    const leadersWithPrizes: LeaderPrizeLog[] = leaderboard
      .slice(0, 50)
      .map((entry) => ({
        username: entry.playerName || formatAddress(entry.address),
        packs: getPrizePackIdsForSeason(
          XP_SEASON_LEADERBOARD_PRIZES[entry.position],
          currentSeasonNumber,
        ),
      }));

    console.log(leadersWithPrizes);
  };

  return (
    <Box
      w={fullWidth || isSmallScreen ? "100%" : "60%"}
      overflowY="auto"
      flexGrow={1}
      mt={compactSpacing ? 0 : isSmallScreen ? 2 : "20px"}
      mb={compactSpacing ? 0 : isSmallScreen ? 8 : "70px"}
    >
      {username && TESTERS.includes(username) && (
        <Flex zIndex={999} position={"absolute"} top={isSmallScreen ? "85px" : "150px"} left={isSmallScreen ? "30px" : "90px"}>
          <Button
            size="xs"
            fontSize={[8, 12]}
            m={2}
            onClick={handleLogLeaders}
          >
            Log leaders
          </Button>
        </Flex>
      )}
      {isLoading && <Spinner />}
      {leaderboard && (
        <TableContainer overflowX="hidden" overflowY="auto" mb={mb}>
          <Table
            w="100%"
            variant="leaderboard"
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0 5px",
              tableLayout: "fixed",
              "& td": {
                border: "none",
                padding: 0,
                overflow: "hidden",
              },
            }}
          >
            <Tbody>
              {leaderboard.slice(0, lines).map((entry) => {
                const isCurrentUser =
                  addressKey(entry.address) === currentAddress;
                const textColor = isCurrentUser ? "white !important" : VIOLET_LIGHT;
                return (
                  <CustomTr key={entry.address} highlighted={isCurrentUser}>
                    <Td
                      w={isSmallScreen ? "50px" : "70px"}
                      color={isCurrentUser ? "white !important" : VIOLET_LIGHT}
                    >
                      #{entry.position}
                    </Td>
                    <Td color={"white !important"}>
                      <Flex alignItems="center" gap={2}>
                        <Text color={"white"}>
                          {entry.playerName || formatAddress(entry.address)}
                        </Text>
                        {entry.hasSeasonPass && (
                          <SeasonPass
                            w={isSmallScreen ? "14px" : "25px"}
                            rotate="0deg"
                            unlocked={false}
                            seasonNumber={seasonId}
                          />
                        )}
                      </Flex>
                    </Td>
{/*                     <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                      <Text
                        color={textColor}
                        overflowWrap="break-word"
                        wordBreak="normal"
                        whiteSpace="normal"
                      >
                        {t("level")}
                        {entry.level}
                      </Text>
                    </Td> */}
                    {seePrizes ? (
                      <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                        <Text
                          color="white"
                          fontSize={isSmallScreen ? 10 : 12}
                          overflowWrap="break-word"
                          wordBreak="normal"
                          whiteSpace="normal"
                          lineHeight="1.2"
                        >
                          {getPrizeText(
                            t,
                            XP_SEASON_LEADERBOARD_PRIZES[entry.position],
                          )}
                        </Text>
                      </Td>
                    ) : (
                      <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                        <Text
                          color={textColor}
                          overflowWrap="break-word"
                          wordBreak="normal"
                          whiteSpace="normal"
                        >
                          {entry.seasonXp} {t("xp")}
                        </Text>
                      </Td>
                    )}
                  </CustomTr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
