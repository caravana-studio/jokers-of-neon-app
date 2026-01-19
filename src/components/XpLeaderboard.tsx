import {
  Box,
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
import { useGetXpLeaderboard } from "../queries/useGetXpLeaderboard";
import { VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { SeasonPass } from "./SeasonPass/SeasonPass";
import { useDojo } from "../dojo/DojoContext";
import { CustomTr } from "./Leaderboard";

interface XpLeaderboardProps {
  lines?: number;
  mb?: string;
}

const formatAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const XpLeaderboard = ({ lines = 100, mb = "" }: XpLeaderboardProps) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const { data: leaderboard, isLoading } = useGetXpLeaderboard();
  const {
    account: { account },
  } = useDojo();
  const currentAddress = account?.address?.toLowerCase?.();

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
                  entry.address?.toLowerCase?.() === currentAddress;
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
                        />
                      )}
                      </Flex>
                    </Td>
                    <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                      <Text
                        color={textColor}
                        overflowWrap="break-word"
                        wordBreak="normal"
                        whiteSpace="normal"
                      >
                        {t("level")}
                        {entry.level}
                      </Text>
                    </Td>
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