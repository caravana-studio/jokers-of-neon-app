import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr
} from "@chakra-ui/react";
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

const HARDCODED_LEADERBOARD = [
  {
    player_score: 45129988,
    level: 156,
    player_name: "StarkDegenz",
    id: 118,
    position: 1,
  },
  {
    player_score: 7057511,
    level: 102,
    player_name: "yoyo",
    id: 2,
    position: 2,
  },
  {
    player_score: 1838950,
    level: 53,
    player_name: "VladSDGZ",
    id: 1000,
    position: 3,
  },
  {
    player_score: 1201163,
    level: 41,
    player_name: "0xCris",
    id: 163,
    position: 4,
  },
  {
    player_score: 999243,
    level: 40,
    player_name: "0xCris",
    id: 126,
    position: 5,
  },
  {
    player_score: 901461,
    level: 40,
    player_name: "FerK",
    id: 124,
    position: 6,
  },
  {
    player_score: 796824,
    level: 38,
    player_name: "FerK",
    id: 168,
    position: 7,
  },
  {
    player_score: 892234,
    level: 36,
    player_name: "Koi",
    id: 1001,
    position: 8,
  },
  {
    player_score: 593587,
    level: 34,
    player_name: "0xCris",
    id: 1002,
    position: 9,
  },
  {
    player_score: 359528,
    level: 27,
    player_name: "nicon44",
    id: 1003,
    position: 10,
  },
];

interface LeaderboardProps {
  lines?: number;
  gameId?: number;
}
export const Leaderboard = ({ gameId, lines = 10 }: LeaderboardProps) => {
  const leaderboard = HARDCODED_LEADERBOARD;

  return (
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
      {leaderboard && (
        <TableContainer>
          <Table variant="leaderboard">
            <Thead>
              <Tr>
                <Td>POSITION</Td>
                <Td>USERNAME</Td>
                <Td>SCORE</Td>
                <Td>LEVEL</Td>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard.map((leader) => (
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
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
