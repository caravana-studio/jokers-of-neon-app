import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled.ts";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { VIOLET, VIOLET_LIGHT } from "../theme/colors.tsx";
import { RollingNumber } from "./RollingNumber";
import { signedHexToNumber } from "../utils/signedHexToNumber.ts";

const CURRENT_LEADER_STYLES = {
  position: "relative",
  borderTop: "1px solid white",
  borderBottom: "1px solid white",
  boxShadow: `
    0 -2px 10px 1px rgba(255, 255, 255, 0.5),
    0 2px 10px 1px rgba(255, 255, 255, 0.5),
    inset 0 -15px 5px -10px rgba(255, 255, 255, 0.5),
    inset 0 15px 5px -10px rgba(255, 255, 255, 0.5)
  `,
};

interface LeaderboardProps {
  lines?: number;
  gameId?: number;
  filterLoggedInPlayers?: boolean;
}
export const Leaderboard = ({
  gameId,
  lines = 11,
  filterLoggedInPlayers,
}: LeaderboardProps) => {
  const { t } = useTranslation(["home"]);
  const { data: fullLeaderboard, isLoading } = useGetLeaderboard(gameId);
  const guestNamePattern = /^joker_guest_\d+$/;

  const filteredLeaderboard = filterLoggedInPlayers
    ? fullLeaderboard?.filter(
        (player) => !guestNamePattern.test(player.player_name)
      )
    : fullLeaderboard;

  const actualPlayer = filteredLeaderboard?.find(
    (player) => signedHexToNumber(player.id.toString()) === gameId
  );

  const leaderboard = filteredLeaderboard?.slice(0, lines);

  const currentPlayerIsInReducedLeaderboard = leaderboard?.some(
    (leader) => signedHexToNumber(leader.id.toString()) === gameId
  );

  const tournamentEnabled = useFeatureFlagEnabled(
    "global",
    "tournamentEnabled"
  );

  return (
    <Box
      sx={{
        border: `2px solid ${VIOLET_LIGHT}`,
        boxShadow: `0px 0px 15px 25px ${VIOLET}`,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: "25px",
      }}
      m={4}
      py={4}
      px={[1, 2, 4, 8]}
    >
      {isLoading && <Spinner />}
      {leaderboard && (
        <TableContainer
          maxHeight={{ base: "60vh", sm: "50vh" }}
          overflowX="hidden"
          overflowY="auto"
        >
          <Table variant="leaderboard">
            <Thead>
              <Tr>
                <Td>
                  {t(
                    "leaderboard.table-head.position-leaderboard-head"
                  ).toUpperCase()}
                </Td>
                <Td>
                  {t(
                    "leaderboard.table-head.username-leaderboard-head"
                  ).toUpperCase()}
                </Td>
                <Td>
                  {t(
                    "leaderboard.table-head.score-leaderboard-head"
                  ).toUpperCase()}
                </Td>
                <Td>
                  {t(
                    "leaderboard.table-head.level-leaderboard-head"
                  ).toUpperCase()}
                </Td>

                {tournamentEnabled && (
                  <Td>
                    {t(
                      "tournament.table-head.prize-leaderboard-head"
                    ).toUpperCase()}{" "}
                    {!isMobile && (
                      <Tooltip
                        label={t("tournament.table-head.tournament-tooltip")}
                      >
                        <InfoIcon
                          color="white"
                          ml={1}
                          fontSize={{ base: "10px", md: "15px" }}
                        />
                      </Tooltip>
                    )}
                  </Td>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard
                .filter((_, index) => {
                  const limit = !currentPlayerIsInReducedLeaderboard
                    ? lines - 1
                    : lines;
                  return index < limit;
                })
                .map((leader) => (
                  <Tr
                    key={leader.id}
                    sx={gameId === leader.id ? CURRENT_LEADER_STYLES : {}}
                  >
                    <Td>{leader.position}</Td>
                    <Td>{leader.player_name}</Td>
                    <Td isNumeric>
                      {gameId === leader.id ? (
                        <RollingNumber n={leader.player_score} />
                      ) : (
                        leader.player_score
                      )}
                    </Td>
                    <Td>
                      {gameId === leader.id ? (
                        <RollingNumber n={leader.level} />
                      ) : (
                        leader.level
                      )}
                    </Td>
                    {tournamentEnabled && (
                      <Td>
                        <RollingNumber n={leader.prize} />{" "}
                        <span
                          style={{
                            fontSize: isMobile ? "7px" : "12px",
                            marginRight: "20px",
                          }}
                        >
                          USDC
                        </span>
                      </Td>
                    )}
                  </Tr>
                ))}
              {actualPlayer && !currentPlayerIsInReducedLeaderboard && (
                <>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                  </Tr>
                  <Tr sx={CURRENT_LEADER_STYLES}>
                    <Td>{actualPlayer.position}</Td>
                    <Td>{actualPlayer.player_name}</Td>
                    <Td isNumeric>
                      <RollingNumber n={actualPlayer.player_score} />
                    </Td>
                    <Td>
                      <RollingNumber n={actualPlayer.level} />
                    </Td>
                    {tournamentEnabled && (
                      <Td>
                        <RollingNumber n={actualPlayer.prize} /> USDC
                      </Td>
                    )}
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
