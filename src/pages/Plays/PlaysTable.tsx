import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { PriceBox } from "../../components/PriceBox.tsx";
import { PLAYS } from "../../constants/plays.ts";
import { getPlayerPokerHands } from "../../dojo/getPlayerPokerHands.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { parseHand } from "../../enums/hands.ts";
import { useStore } from "../../providers/StoreProvider";
import { useGameStore } from "../../state/useGameStore.ts";
import { useShopStore } from "../../state/useShopStore.ts";
import { BLUE, GREY_LINE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import theme from "../../theme/theme";
import { LevelPokerHand } from "../../types/LevelPokerHand.ts";

interface PlaysTableProps {
  inStore?: boolean;
}

const { blue, white, purple, violet } = theme.colors;

export const PlaysTable = ({ inStore = false }: PlaysTableProps) => {
  const { id: gameId } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [plays, setPlays] = useState<LevelPokerHand[]>([]);

  const { cash } = useGameStore();
  const { t } = useTranslation(["store"]);

  const { levelUpPlay } = useStore();
  const { pokerHandItems, locked } = useShopStore();
  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: {
      client,
      account: { account },
    },
  } = useDojo();

  useEffect(() => {
    getPlayerPokerHands(client, gameId).then((plays: any) => {
      plays && setPlays(plays);
    });
  }, [client, account, gameId, pokerHandItems]);

  useEffect(() => {
    if (plays.length > 0) {
      setIsLoading(false);
    }
  }, [plays, pokerHandItems]);

  const filteredPlays = !isLoading
    ? plays.filter((play) =>
        pokerHandItems?.find(
          (item) => item.poker_hand === play.poker_hand.toString()
        )
      )
    : plays;

  return (
    <>
      {filteredPlays ? (
        <TableContainer overflow={inStore ? "hidden" : "auto"} width={"100%"}>
          <Table
            sx={{
              borderCollapse: "collapse",
              borderSpacing: 0,
              marginBottom: isMobile ? 0 : 4,
              td: {
                py: { base: 1, sm: 2 },
              },
            }}
            width={"100%"}
            variant={isMobile ? "store-mobile" : "store"}
          >
            <Thead>
              <Tr>
                {inStore ? (
                  <>
                    <Td>{t("store.plays-table.level").toUpperCase()}</Td>
                    <Td textAlign={"center"}>
                      {t("store.plays-table.hand").toUpperCase()}
                    </Td>
                    <Td textAlign={"center"}>
                      {t("store.plays-table.points-multi").toUpperCase()}
                    </Td>
                    <Td textAlign={"center"}>
                      {t("store.plays-table.price").toUpperCase()}
                    </Td>
                    <Td></Td>
                  </>
                ) : (
                  <>
                    <Td>{t("store.plays-table.level").toUpperCase()}</Td>
                    <Td>{t("store.plays-table.hand").toUpperCase()}</Td>
                    <Td>{t("store.plays-table.points-multi").toUpperCase()}</Td>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {!isLoading &&
                filteredPlays.map((play, index) => {
                  const pokerHandString = play.poker_hand.toString();
                  const pokerHandParsed = parseHand(pokerHandString);

                  const storePlay = pokerHandItems?.find(
                    (item) => item.poker_hand == pokerHandString
                  );

                  const purchased =
                    storePlay != undefined ? storePlay.purchased : false;

                  const textColor = storePlay
                    ? purchased
                      ? GREY_LINE
                      : white
                    : purple;

                  const opacitySx = {
                    opacity: inStore && (!storePlay || purchased) ? 0.9 : 1,
                  };

                  const levelTd = (
                    <Td sx={opacitySx} textColor={textColor}>
                      <Flex gap={"20%"}>
                        <Flex opacity={0.5} textDecoration="line-through">
                          {play?.level.toString()}
                        </Flex>
                        <Heading fontSize={isSmallScreen ? "8" : "10"}>
                          {" > "}
                        </Heading>
                        <Flex>{storePlay?.level.toString()}</Flex>
                      </Flex>
                    </Td>
                  );
                  const nameTd = (
                    <Td
                      sx={opacitySx}
                      textAlign={"center"}
                      textColor={textColor}
                      width={"15%"}
                      lineHeight={1.5}
                    >
                      {PLAYS[Number(pokerHandParsed.value)]}
                    </Td>
                  );
                  const pointsMultiTd = (
                    <Td>
                      <Box
                        color={"black"}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                      >
                        <Box
                          backgroundColor={"neonGreen"}
                          borderRadius={10}
                          width={"50px"}
                          mr={1}
                        >
                          {play.points.toString()}
                        </Box>
                        <Heading fontSize={"15"}>x</Heading>
                        <Box
                          backgroundColor={"neonPink"}
                          borderRadius={10}
                          width={"50px"}
                          ml={1}
                        >
                          {play.multi.toString()}
                        </Box>
                      </Box>
                    </Td>
                  );
                  const notEnoughCash =
                    !!storePlay &&
                    (storePlay.discount_cost
                      ? cash < storePlay.discount_cost
                      : cash < storePlay.cost);

                  const buyButton = (
                    <Button
                      onClick={() => {
                        storePlay && levelUpPlay?.(storePlay);
                      }}
                      variant={
                        notEnoughCash || locked ? "defaultOutline" : "solid"
                      }
                      isDisabled={notEnoughCash || locked}
                      size={isMobile ? "xs" : "sm"}
                      px={isMobile ? 2 : 4}
                      boxShadow={`0px 0px 10px 2px ${BLUE}`}
                      fontSize={isMobile ? 6 : 10}
                      borderRadius={isMobile ? 6 : 12}
                      height={isMobile ? 5 : 7}
                      mr={{ base: 0, sm: 2 }}
                    >
                      {t("store.plays-table.level-up")}
                    </Button>
                  );

                  return (
                    <Tr key={index} height={"30px"}>
                      {levelTd}
                      {nameTd}

                      {inStore ? (
                        <>
                          <Td>
                            <Box
                              color={"white"}
                              display={"flex"}
                              flexDirection={isMobile ? "column" : "row"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              textAlign={"center"}
                              sx={{
                                opacity:
                                  inStore && (!storePlay || purchased)
                                    ? 0.5
                                    : 1,
                              }}
                            >
                              {/* Current Play level data */}
                              <Flex>
                                <Box
                                  backgroundColor={`${blue}`}
                                  opacity={0.5}
                                  borderRadius={4}
                                  width={isSmallScreen ? "30px" : "40px"}
                                  mr={1}
                                  boxShadow={`0px 0px 5px 3px ${blue}`}
                                  lineHeight={1.8}
                                  height={isSmallScreen ? "15px" : "20px"}
                                  textDecoration="line-through"
                                >
                                  {Number(play.points)}
                                </Box>
                                <Heading
                                  opacity={0.5}
                                  fontSize={isSmallScreen ? "8" : "10"}
                                >
                                  x
                                </Heading>
                                <Box
                                  opacity={0.5}
                                  backgroundColor={"neonPink"}
                                  borderRadius={4}
                                  width={isSmallScreen ? "30px" : "40px"}
                                  ml={1}
                                  boxShadow={`0px 0px 5px 3px ${violet}`}
                                  lineHeight={1.8}
                                  height={isSmallScreen ? "15px" : "20px"}
                                  textDecoration="line-through"
                                >
                                  {Number(play.multi)}
                                </Box>
                              </Flex>
                              <Heading
                                lineHeight={0.9}
                                mx={{ base: 0, sm: 3 }}
                                fontSize={isSmallScreen ? "5" : "10"}
                              >
                                {isMobile ? " v " : " > "}
                              </Heading>

                              {/* New Play level data */}
                              <Flex>
                                <Box
                                  backgroundColor={`${blue}`}
                                  borderRadius={4}
                                  width={isSmallScreen ? "30px" : "40px"}
                                  mr={1}
                                  boxShadow={`0px 0px 5px 3px ${blue}`}
                                  lineHeight={1.8}
                                  height={isSmallScreen ? "15px" : "20px"}
                                >
                                  {storePlay?.points}
                                </Box>
                                <Heading fontSize={isSmallScreen ? "8" : "10"}>
                                  x
                                </Heading>

                                <Box
                                  backgroundColor={"neonPink"}
                                  borderRadius={4}
                                  width={isSmallScreen ? "30px" : "40px"}
                                  ml={1}
                                  boxShadow={`0px 0px 5px 3px ${violet}`}
                                  lineHeight={1.8}
                                  height={isSmallScreen ? "15px" : "20px"}
                                >
                                  {storePlay?.multi}
                                </Box>
                              </Flex>
                            </Box>
                          </Td>

                          <Td sx={opacitySx} color={textColor}>
                            <Flex
                              justifyContent={"center"}
                              width={["80%", "80px"]}
                              margin={"0 auto"}
                              textAlign={"center"}
                            >
                              <PriceBox
                                price={Number(storePlay?.cost)}
                                purchased={Boolean(storePlay?.purchased)}
                                discountPrice={Number(
                                  storePlay?.discount_cost ?? 0
                                )}
                                absolutePosition={false}
                                fontSize={isSmallScreen ? 10 : 16}
                                discountFontSize={isSmallScreen ? 8 : 12}
                              />
                            </Flex>
                          </Td>
                          <Td textAlign={"center"}>
                            {!!storePlay ? (
                              storePlay.purchased ? (
                                <Heading
                                  color={GREY_LINE}
                                  fontSize={{ base: 7, sm: 12 }}
                                >
                                  {t(
                                    "store.plays-table.purchased"
                                  ).toUpperCase()}
                                </Heading>
                              ) : notEnoughCash ? (
                                <Tooltip label="You don't have enough coins to buy this item">
                                  {buyButton}
                                </Tooltip>
                              ) : (
                                buyButton
                              )
                            ) : (
                              ""
                            )}
                          </Td>
                        </>
                      ) : (
                        pointsMultiTd
                      )}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        "Loading..."
      )}
    </>
  );
};
