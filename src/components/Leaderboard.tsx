import {
  Box,
  Spinner,
  SystemStyleObject,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
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

interface LeaderboardProps {
  lines?: number;
  gameId?: number;
  filterLoggedInPlayers?: boolean;
}
export const Leaderboard = ({ gameId, lines = 11, filterLoggedInPlayers = true }: LeaderboardProps) => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const { data: fullLeaderboard, isLoading } = useGetLeaderboard(gameId, filterLoggedInPlayers);

  const actualPlayer = fullLeaderboard?.find(
    (player) => signedHexToNumber(player.id.toString()) === gameId
  );

  const leaderboard = fullLeaderboard?.slice(0, lines);

  const currentPlayerIsInReducedLeaderboard = leaderboard?.some(
    (leader) => signedHexToNumber(leader.id.toString()) === gameId
  );

  return (
    <Box
      w={isSmallScreen ? "90%" : "60%"}
      overflowY="auto"
      flexGrow={1}
      mx={4}
      my={isSmallScreen ? 8 : "70px"}
      px={[1, 2, 4, 8]}
    >
      {isLoading && <Spinner />}
      {leaderboard && (
        <TableContainer overflowX="hidden" overflowY="auto">
          <Table
            variant="leaderboard"
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0 5px",
              "& td": {
                border: "none",
                padding: 0,
                overflow: "hidden",
              },
            }}
          >
            {/*             <Thead>
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
                <Td>
                  {t(
                    "leaderboard.table-head.round-leaderboard-head"
                  ).toUpperCase()}
                </Td>
              </Tr>
            </Thead> */}
            <Tbody>
              {leaderboard
                .filter((_, index) => {
                  const limit = !currentPlayerIsInReducedLeaderboard
                    ? lines - 1
                    : lines;
                  return index < limit;
                })
                .map((leader) => (
                  <CustomTr
                    key={leader.id}
                    sx={gameId === leader.id ? CURRENT_LEADER_STYLES : {}}
                  >
                    <Td>#{leader.position}</Td>
                    <Td>{leader.player_name}</Td>
                    {/*                     <Td isNumeric>
                      {gameId === leader.id ? (
                        <RollingNumber n={leader.player_score} />
                      ) : (
                        leader.player_score
                      )}
                    </Td> */}
                    <Td>
                      {t("leaderboard.level")}
                      {gameId === leader.id ? (
                        <RollingNumber n={leader.level} />
                      ) : (
                        leader.level
                      )}
                    </Td>
                    <Td>
                      {t("leaderboard.round")}
                      {gameId === leader.id ? (
                        <RollingNumber n={leader.round} />
                      ) : (
                        leader.round
                      )}
                    </Td>
                  </CustomTr>
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
                    <Td>#{actualPlayer.position}</Td>
                    <Td>{actualPlayer.player_name}</Td>
                    {/*                     <Td isNumeric>
                      <RollingNumber n={actualPlayer.player_score} />
                    </Td> */}
                    <Td>
                      {t("leaderboard.level")}
                      <RollingNumber n={actualPlayer.level} />
                    </Td>
                    <Td>
                      {t("leaderboard.round")}
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
