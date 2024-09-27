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
import { useGetLeaderboard } from "../queries/useGetLeaderboard";
import { VIOLET, VIOLET_LIGHT } from "../theme/colors.tsx";
import { RollingNumber } from "./RollingNumber";
import { isMobile } from "react-device-detect";
import { InfoIcon } from "@chakra-ui/icons";

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
export const Leaderboard = ({ gameId, lines = 11 }: LeaderboardProps) => {
  const { data: fullLeaderboard, isLoading } = useGetLeaderboard();
  const leaderboard = fullLeaderboard?.filter((_, index) => index < lines);
  const currentLeader = fullLeaderboard?.find((leader) => leader.id === gameId);
  const currentLeaderIsInReducedLeaderboard = !!leaderboard?.find(
    (leader) => leader.id === gameId
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
              <Td>POSITION</Td>
              <Td>USERNAME</Td>
              <Td>SCORE</Td>
              <Td>LEVEL</Td>
              <Td>
                PRIZE{" "}
                {!isMobile && (
                  <Tooltip label="Prizes will be distributed to the top 10 players at the end of the tournament">
                    <InfoIcon
                      color="white"
                      ml={1}
                      fontSize={{ base: "10px", md: "15px" }}
                    />
                  </Tooltip>
                )}
              </Td>
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
                </Tr>
              ))}
            {currentLeader && !currentLeaderIsInReducedLeaderboard && (
              <>
                <Tr>
                  <Td>...</Td>
                  <Td>...</Td>
                  <Td>...</Td>
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
                  <Td>
                    <RollingNumber n={currentLeader.prize} /> USDC
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
