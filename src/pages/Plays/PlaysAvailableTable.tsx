import {
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomScrollbar from "../../components/CustomScrollbar/CustomScrollbar";
import { DelayedLoading } from "../../components/DelayedLoading";
import { TiltCard } from "../../components/TiltCard";
import { PLAYS, PLAYS_DATA } from "../../constants/plays";
import { getPlayerPokerHands } from "../../dojo/getPlayerPokerHands";
import { useDojo } from "../../dojo/useDojo";
import { parseHand } from "../../enums/hands";
import { useGameStore } from "../../state/useGameStore";
import { BLUE_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import theme from "../../theme/theme";
import { Card } from "../../types/Card";
import { LevelPokerHand } from "../../types/LevelPokerHand";
import { getPlayerPokerHandTracker } from "../../dojo/getPlayerPokerHandTracker";

const { blueLight, blue, violet } = theme.colors;

type PlayWithCount = LevelPokerHand & {
  count: bigint;
};

const pascalToSnake = (str: string) => {
  if (!str) return "";
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .substring(1);
};

export const PlaysAvailableTable = () => {
  const { id: gameId } = useGameStore();
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);
  const [playsTracker, setPlaysTracker] = useState<PlayWithCount[]>([]);
  const [playsExampleIndex, setPlaysExampleIndex] = useState(0);
  const { t } = useTranslation(["game"]);

  const {
    setup: {
      client,
      account: { account },
    },
  } = useDojo();

  if (client && account && plays.length == 0) {
    getPlayerPokerHands(client, gameId).then((plays: any) => {
      setPlays(plays);
    });
  }

  useEffect(() => {
    if (!plays) {
      console.error("Failed to fetch plays or tracker data.");
      return;
    }

    getPlayerPokerHandTracker(client, gameId).then((playsTracker: any) => {
      const mergedData = plays.map((play) => {
        const trackerKey = pascalToSnake(play.poker_hand as string);
        const count =
          playsTracker[trackerKey as keyof typeof playsTracker] ?? 0n;

        return {
          ...play,
          count: typeof count === "bigint" ? count : BigInt(count),
        };
      });
      setPlaysTracker(mergedData);
    });
  }, [plays]);

  const { isSmallScreen, cardScale } = useResponsiveValues();

  return (
    <>
      {plays ? (
        <TableContainer
          height={"100%"}
          flexGrow={1}
          border={`2px solid ${blueLight}`}
          borderRadius={"25px"}
          boxShadow={`0px 0px 20px 15px ${blue}`}
          backgroundColor="rgba(0, 0, 0, 1)"
          className="game-tutorial-step-table-plays"
          w={["100%", "unset"]}
        >
          <CustomScrollbar>
            <DelayedLoading>
              <Table
                sx={{
                  borderCollapse: "separate",
                  marginBottom: 4,
                  borderSpacing: 0,
                }}
                width={"100%"}
                h="100%"
                variant={isSmallScreen ? "store-mobile" : "store"}
              >
                <Thead
                  sx={{
                    position: "relative",
                    background: "black",
                    border: "10px",
                    borderColor: "transparent",
                    borderRadius: "25px",
                  }}
                >
                  <Tr>
                    <Td
                      colSpan={4}
                      sx={{
                        position: "sticky",
                        top: "0px",
                        backgroundColor: "black",
                      }}
                      p={4}
                      textAlign={"center"}
                    >
                      <Text
                        pt={2}
                        sx={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {PLAYS_DATA[playsExampleIndex].description}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      colSpan={4}
                      sx={{ position: "sticky", backgroundColor: "black" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          padding: {
                            base: "0px 2px 2px 2px",
                            sm: "0px 4px 4px 4px",
                          },
                          flexDirection: "row",
                        }}
                      >
                        <Flex
                          wrap={"nowrap"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          gap={isSmallScreen ? 0 : 4}
                        >
                          {PLAYS_DATA[playsExampleIndex].example.map(
                            (card: Card, index) => {
                              const isImportant = PLAYS_DATA[
                                playsExampleIndex
                              ].importantCards.some(
                                (ic) => ic.card_id === card.card_id
                              );
                              return (
                                <Box
                                  key={`${card.card_id}+"-"+${index}`}
                                  opacity={isImportant ? 1 : 0.5}
                                >
                                  <TiltCard
                                    card={card}
                                    scale={cardScale - (cardScale * 33) / 100}
                                  />
                                </Box>
                              );
                            }
                          )}
                        </Flex>
                      </Box>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize={isSmallScreen ? 10 : 15} textAlign={"center"}>
                      {t("game.plays.table.level-head").toUpperCase()}
                    </Td>
                    <Td fontSize={isSmallScreen ? 10 : 15} textAlign={"center"}>
                      {t("game.plays.table.hand-head").toUpperCase()}
                    </Td>
                    <Td fontSize={isSmallScreen ? 10 : 15} textAlign={"center"}>
                      {t("game.plays.table.points-multi-head").toUpperCase()}
                    </Td>
                    {playsTracker.length > 0 && (
                      <Td
                        fontSize={isSmallScreen ? 10 : 15}
                        textAlign={"center"}
                      >
                        {t("game.plays.table.played").toUpperCase()}
                      </Td>
                    )}
                  </Tr>
                </Thead>

                <Tbody>
                  {plays &&
                    [...plays].map((play, index) => {
                      const textColor =
                        playsExampleIndex === index ? BLUE_LIGHT : "white";
                      const opacitySx = {
                        opacity: 1,
                      };
                      const levelTd = (
                        <Td
                          sx={opacitySx}
                          textColor={textColor}
                          fontSize={isSmallScreen ? 9 : 13}
                          textAlign={"center"}
                        >
                          {play.level.toString()}
                        </Td>
                      );
                      const nameTd = (
                        <Td
                          sx={opacitySx}
                          textAlign={"center"}
                          textColor={textColor}
                          fontSize={isSmallScreen ? 9 : 13}
                        >
                          {play.poker_hand &&
                            PLAYS[parseHand(play.poker_hand.toString()).value]}
                        </Td>
                      );
                      const pointsMultiTd = (
                        <Td textAlign={"center"}>
                          <Box
                            color={"white"}
                            display={"flex"}
                            flexDirection={"row"}
                            justifyContent={"center"}
                          >
                            <Box
                              backgroundColor={`${blue}`}
                              borderRadius={4}
                              width={isSmallScreen ? "35px" : "60px"}
                              mr={1}
                              boxShadow={`0px 0px 10px 6px ${blue}`}
                              fontWeight={"400"}
                            >
                              {play.points.toString()}
                            </Box>
                            <Heading fontSize={isSmallScreen ? "8" : "10"}>
                              x
                            </Heading>
                            <Box
                              backgroundColor={"neonPink"}
                              borderRadius={4}
                              width={isSmallScreen ? "35px" : "60px"}
                              ml={1}
                              boxShadow={`0px 0px 10px 6px ${violet}`}
                              fontWeight={"400"}
                            >
                              {play.multi.toString()}
                            </Box>
                          </Box>
                        </Td>
                      );

                      const handsPlayedTd = (
                        <Td
                          sx={opacitySx}
                          textAlign={"center"}
                          textColor={textColor}
                          fontSize={isSmallScreen ? 9 : 13}
                        >
                          {playsTracker.length > 0 &&
                            playsTracker[index].count.toString()}
                        </Td>
                      );

                      return (
                        <Tr
                          key={index}
                          height={"30px"}
                          onClick={() => setPlaysExampleIndex(index)}
                          sx={{ cursor: "pointer" }}
                          backgroundColor={
                            playsExampleIndex === index ? "#242424" : "none"
                          }
                        >
                          {
                            <>
                              {levelTd}
                              {nameTd}
                            </>
                          }

                          {pointsMultiTd}
                          {playsTracker && handsPlayedTd}
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </DelayedLoading>
          </CustomScrollbar>
        </TableContainer>
      ) : (
        "Loading..."
      )}
    </>
  );
};
