import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { TFunction } from "i18next";
import { CustomTr } from "../../components/Leaderboard";
import { ApiLeaderboardEntry } from "../../queries/useGetApiLeaderboard";
import { VIOLET_LIGHT } from "../../theme/colors";
import { formatNumber } from "../../utils/formatNumber";
import { normalizeGameId } from "../../utils/normalizeGameId";
import { addressKey } from "../../utils/starknetAddress";
import { MiniAppTournamentPrize } from "./useMiniAppTournamentSettings";

const CURRENT_LEADER_STYLES = {
  position: "relative",
  borderTop: "1px solid white",
  borderBottom: "1px solid white",
  backgroundColor: "black",
  color: "white !important",
};

type MiniAppLeaderboardTableProps = {
  entries: ApiLeaderboardEntry[];
  currentUserAddress?: string;
  currentGameId?: string | number;
  lines?: number;
  isSmallScreen: boolean;
  t: TFunction;
  px?: number | { base?: number; sm?: number; md?: number };
  width?: string | { base?: string; sm?: string; md?: string };
  showPrizeColumn?: boolean;
  prizes?: Record<number, MiniAppTournamentPrize>;
};

const getPrizeText = (prize?: MiniAppTournamentPrize) => {
  if (!prize?.token) {
    return "-";
  }

  return `${prize.token.amount} ${prize.token.type}`;
};

export const MiniAppLeaderboardTable = ({
  entries,
  currentUserAddress = "",
  currentGameId,
  lines = 4,
  isSmallScreen,
  t,
  px = 0,
  width = "100%",
  showPrizeColumn = false,
  prizes,
}: MiniAppLeaderboardTableProps) => {
  const visibleEntries = entries.slice(0, lines);
  const currentGameEntry =
    currentGameId === undefined
      ? undefined
      : entries.find(
          (entry) =>
            normalizeGameId(entry.id) === normalizeGameId(currentGameId)
        );

  const currentGameIsVisible = visibleEntries.some(
    (entry) => normalizeGameId(entry.id) === normalizeGameId(currentGameId)
  );

  return (
    <Box w={width} px={px}>
      {!entries.length ? (
        <Flex justifyContent="center" pt={6}>
          <Text color="white">{t("title")}</Text>
        </Flex>
      ) : (
        <TableContainer overflowX="hidden" overflowY="auto">
          <Table
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
              {visibleEntries.map((entry) => {
                const isCurrentUser =
                  Boolean(currentUserAddress) &&
                  addressKey(entry.owner) === currentUserAddress;
                const isCurrentGame =
                  currentGameId !== undefined &&
                  normalizeGameId(entry.id) === normalizeGameId(currentGameId);

                return (
                  <CustomTr
                    key={entry.id}
                    highlighted={isCurrentUser || isCurrentGame}
                    sx={isCurrentGame ? CURRENT_LEADER_STYLES : {}}
                  >
                    <Td w={isSmallScreen ? "50px" : "70px"}>
                      #{entry.position}
                    </Td>
                    <Td color="white !important">
                      <Text>{entry.displayName}</Text>
                    </Td>
                    <Td
                      maxW={showPrizeColumn ? "120px" : "150px"}
                      p={showPrizeColumn ? "12px 8px" : "12px 20px"}
                      whiteSpace="normal"
                    >
                      <Text
                        color={
                          isCurrentUser || isCurrentGame
                            ? "white !important"
                            : VIOLET_LIGHT
                        }
                        fontSize={isSmallScreen ? 10 : 14}
                        overflowWrap="break-word"
                        wordBreak="normal"
                        whiteSpace="normal"
                        lineHeight="1.2"
                      >
                        {t("level")}
                        {entry.level}
                        {" - "}
                        {t("round")}
                        {entry.round}
                        <br />
                        {formatNumber(entry.playerScore)} {t("points")}
                      </Text>
                    </Td>
                    {showPrizeColumn && (
                      <Td
                        w={isSmallScreen ? "76px" : "96px"}
                        p="12px 8px"
                        whiteSpace="normal"
                      >
                        <Text
                          color={
                            isCurrentUser || isCurrentGame
                              ? "white !important"
                              : VIOLET_LIGHT
                          }
                          fontSize={isSmallScreen ? 10 : 14}
                          textAlign="right"
                          overflowWrap="break-word"
                          wordBreak="break-word"
                          whiteSpace="normal"
                          lineHeight="1.2"
                        >
                          {getPrizeText(prizes?.[entry.position])}
                        </Text>
                      </Td>
                    )}
                  </CustomTr>
                );
              })}
              {currentGameEntry && !currentGameIsVisible && (
                <>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    {showPrizeColumn && <Td>...</Td>}
                  </Tr>
                  <CustomTr highlighted key={`current-game-${currentGameEntry.id}`}>
                    <Td>#{currentGameEntry.position}</Td>
                    <Td>{currentGameEntry.displayName}</Td>
                    <Td
                      maxW={showPrizeColumn ? "120px" : "150px"}
                      p={showPrizeColumn ? "12px 8px" : "12px 20px"}
                      whiteSpace="normal"
                    >
                      <Text
                        color="white !important"
                        fontSize={isSmallScreen ? 10 : 14}
                        overflowWrap="break-word"
                        wordBreak="normal"
                        whiteSpace="normal"
                        lineHeight="1.2"
                      >
                        {t("level")}
                        {currentGameEntry.level}
                        {" - "}
                        {t("round")}
                        {currentGameEntry.round}
                        <br />
                        {formatNumber(currentGameEntry.playerScore)} {t("points")}
                      </Text>
                    </Td>
                    {showPrizeColumn && (
                      <Td
                        w={isSmallScreen ? "76px" : "96px"}
                        p="12px 8px"
                        whiteSpace="normal"
                      >
                        <Text
                          color="white !important"
                          fontSize={isSmallScreen ? 10 : 14}
                          textAlign="right"
                          overflowWrap="break-word"
                          wordBreak="break-word"
                          whiteSpace="normal"
                          lineHeight="1.2"
                        >
                          {getPrizeText(prizes?.[currentGameEntry.position])}
                        </Text>
                      </Td>
                    )}
                  </CustomTr>
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
