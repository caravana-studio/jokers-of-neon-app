import {
  Box,
  Spinner,
  SystemStyleObject,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import {
  Prize,
  useTournamentSettings,
} from "../queries/useTournamentSettings.ts";
import { VIOLET_LIGHT } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { formatNumber } from "../utils/formatNumber.ts";
import { signedHexToNumber } from "../utils/signedHexToNumber.ts";
import { RollingNumber } from "./RollingNumber";

const CURRENT_LEADER_STYLES = {
  position: "relative",
  borderTop: "1px solid white",
  borderBottom: "1px solid white",
  backgroundColor: "black",
  color: "white !important",
  boxShadow: `
    0 -2px 10px 1px rgba(255, 255, 255, 0.5),
    0 2px 10px 1px rgba(255, 255, 255, 0.5),
    inset 0 -15px 5px -10px rgba(255, 255, 255, 0.5),
    inset 0 15px 5px -10px rgba(255, 255, 255, 0.5)
  `,
};

export const getPrizeText = (t: TFunction, prize: Prize | undefined) => {
  if (!prize) {
    return "";
  }
  const prizeArray = [];
  prize.packs.collectorXL &&
    prizeArray.push(
      t(`prizes.collectorXL`, {
        count: prize.packs.collectorXL,
      })
    );
  prize.packs.collector &&
    prizeArray.push(
      t(`prizes.collector`, {
        count: prize.packs.collector,
      })
    );
  prize.packs.epic &&
    prizeArray.push(t(`prizes.epic`, { count: prize.packs.epic }));
  prize.packs.legendary &&
    prizeArray.push(
      t(`prizes.legendary`, {
        count: prize.packs.legendary,
      })
    );
  prize.packs.advanced &&
    prizeArray.push(t(`prizes.advanced`, { count: prize.packs.advanced }));
  prize.packs.base &&
    prizeArray.push(t(`prizes.base`, { count: prize.packs.base }));
  prize.seasonPass && prizeArray.push(t(`prizes.seasonPass`));

  return prizeArray.join(" + ");
};

interface LeaderboardProps {
  seePrizes?: boolean;
  lines?: number;
  gameId?: number;
  filterLoggedInPlayers?: boolean;
  hidePodium?: boolean;
  mb?: string;
}
export const Leaderboard = ({
  gameId,
  lines = 11,
  filterLoggedInPlayers = true,
  hidePodium = false,
  mb = "",
  seePrizes = false,
}: LeaderboardProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const { tournament } = useTournamentSettings();
  const { startCountingAtGameId, stopCountingAtGameId } = tournament || {
    startCountingAtGameId: 0,
    stopCountingAtGameId: 1000000,
  };

  const { data: fullLeaderboard, isLoading } = useGetLeaderboard(
    gameId,
    filterLoggedInPlayers,
    startCountingAtGameId,
    stopCountingAtGameId
  );

  const actualPlayer = fullLeaderboard?.find(
    (player) => signedHexToNumber(player.id.toString()) === gameId
  );

  const username = useUsername();

  const leaderboard = fullLeaderboard?.slice(hidePodium ? 3 : 0, lines);

  const currentPlayerIsInReducedLeaderboard = leaderboard?.some(
    (leader) => signedHexToNumber(leader.id.toString()) === gameId
  );

  return (
    <Box
      w={isSmallScreen ? "100%" : "60%"}
      overflowY="auto"
      flexGrow={1}
      mt={isSmallScreen ? 2 : "20px"}
      mb={isSmallScreen ? 8 : "70px"}
      px={[1, 2, 4, 8]}
    >
      {isLoading && <Spinner />}
      {leaderboard && (
        <TableContainer overflowX="hidden" overflowY="auto" mb={mb}>
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
              {leaderboard
                .filter((_, index) => {
                  const limit = !currentPlayerIsInReducedLeaderboard
                    ? lines - 1
                    : lines;
                  return index < limit;
                })
                .map((leader) => {
                  const isCurrentPlayer = username === leader.player_name;
                  return (
                    <CustomTr
                      key={leader.id}
                      sx={gameId === leader.id ? CURRENT_LEADER_STYLES : {}}
                    >
                      <Td
                        w={isSmallScreen ? "50px" : "70px"}
                        color={isCurrentPlayer ? "white !important" : ""}
                      >
                        #{leader.position}
                      </Td>
                      <Td color={isCurrentPlayer ? "white !important" : ""}>
                        {leader.player_name}
                      </Td>
                      {seePrizes ? (
                        <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                          <Text
                            fontSize={isSmallScreen ? 10 : 14}
                            overflowWrap="break-word"
                            wordBreak="normal"
                            whiteSpace="normal"
                            lineHeight="1.2"
                          >
                            {getPrizeText(
                              t,
                              tournament?.prizes[leader.position]
                            )}
                          </Text>
                        </Td>
                      ) : (
                        <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                          <Text
                            color={
                              isCurrentPlayer
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
                            {gameId === leader.id ? (
                              <RollingNumber n={leader.level} />
                            ) : (
                              leader.level
                            )}
                            {" - "}
                            {t("round")}
                            {gameId === leader.id ? (
                              <RollingNumber n={leader.round} />
                            ) : (
                              leader.round
                            )}
                            <br />
                            {formatNumber(leader.player_score)} {t("points")}
                          </Text>
                        </Td>
                      )}
                    </CustomTr>
                  );
                })}
              {actualPlayer && !currentPlayerIsInReducedLeaderboard && (
                <>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                  </Tr>
                  <Tr sx={CURRENT_LEADER_STYLES}>
                    <Td>#{actualPlayer.position}</Td>
                    <Td>{actualPlayer.player_name}</Td>
                    {/*                     <Td isNumeric>
                      <RollingNumber n={actualPlayer.player_score} />
                    </Td> */}
                    <Td>
                      {t("level")}
                      <RollingNumber n={actualPlayer.level} />
                    </Td>
                    <Td>
                      {t("round")}
                      <RollingNumber n={actualPlayer.round} />
                    </Td>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

const CustomTr = ({
  children,
  key,
  sx,
}: {
  children: React.ReactNode;
  key: number | string;
  sx: SystemStyleObject;
}) => {
  return (
    <Tr
      key={key}
      sx={{
        ...sx,
        td: {
          position: "relative",
          padding: "12px 20px",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "black",
            zIndex: -1,
          },
          "&:first-of-type::before": {
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
          "&:last-of-type::before": {
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          },
        },
      }}
    >
      {children}
    </Tr>
  );
};
