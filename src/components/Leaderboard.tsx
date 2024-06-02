import {
    Box,
    Heading,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    useTheme,
} from "@chakra-ui/react";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { RollingNumber } from "./RollingNumber";

const CURRENT_LEADER_STYLES = {
  border: `2px solid white`,
  boxShadow: `inset 0px 0px 10px 0px white `,
  td: {
    color: "white ",
    fontSize: 22,
  },
};

interface LeaderboardProps {
  lines?: number;
}
export const Leaderboard = ({ lines = 10 }: LeaderboardProps) => {
  const { colors } = useTheme();
  const gameId = getLSGameId();
  const { data: fullLeaderboard, isLoading } = useGetLeaderboard();
  const leaderboard = fullLeaderboard?.filter((_, index) => index < lines);
  const currentLeader = fullLeaderboard?.find((leader) => leader.id === gameId);
  const currentLeaderIsInReducedLeaderboard = !!leaderboard?.find(
    (leader) => leader.id === gameId
  );
  return (
    <Box
      sx={{
        width: "700px",
        border: `2px solid ${colors.limeGreen}`,
        boxShadow: `0px 0px 10px 0px ${colors.limeGreen} `,
        filter: "blur(0.5px)",
      }}
      m={4}
      py={4}
      px={8}
    >
      <Heading size="l" color="limeGreen" textAlign={"center"}>
        LEADERBOARD
      </Heading>
      {isLoading && <Spinner />}
      {leaderboard && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Td>POSITION</Td>
                <Td>USERNAME</Td>
                <Td>SCORE</Td>
                <Td>LEVEL</Td>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard
                .filter((_, index) => {
                  const limit = !currentLeaderIsInReducedLeaderboard
                    ? lines - 1
                    : lines;
                  return index < limit;
                })
                .map((leader) => (
                  <Tr sx={gameId === leader.id ? CURRENT_LEADER_STYLES : {}}>
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
                  </Tr>
                ))}
              {currentLeader && !currentLeaderIsInReducedLeaderboard && (
                <>
                  <Tr>
                    <Td>...</Td>
                  </Tr>
                  <Tr sx={CURRENT_LEADER_STYLES}>
                    <Td>{currentLeader.position}</Td>
                    <Td>{currentLeader.player_name}</Td>
                    <Td isNumeric>
                      <RollingNumber n={currentLeader.player_score} />
                    </Td>
                    <Td>
                      <RollingNumber n={currentLeader.level} />
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
