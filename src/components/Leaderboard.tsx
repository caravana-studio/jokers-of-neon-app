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
} from "@chakra-ui/react";
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { BLUE } from "../theme/colors.tsx";
import { RollingNumber } from "./RollingNumber";

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
}
export const Leaderboard = ({ gameId, lines = 10 }: LeaderboardProps) => {
  const { data: fullLeaderboard, isLoading } = useGetLeaderboard();
  const leaderboard = fullLeaderboard?.filter((_, index) => index < lines);
  const currentLeader = fullLeaderboard?.find((leader) => leader.id === gameId);
  const currentLeaderIsInReducedLeaderboard = !!leaderboard?.find(
    (leader) => leader.id === gameId
  );
  return (
    <Box>
      <Heading size="l" variant="italic" textAlign={"center"} mb={12}>
        LEADERBOARD
      </Heading>
      <Box
        sx={{
          border: `2px solid #20C4EBFF`,
          boxShadow: `0px 0px 10px 20px ${BLUE}`,
          filter: "blur(0.5px)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "10px",
        }}
        m={4}
        py={4}
        px={[1, 2, 4, 8]}
      >
        {isLoading && <Spinner />}
        {leaderboard && (
          <TableContainer>
            <Table>
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
    </Box>
  );
};
