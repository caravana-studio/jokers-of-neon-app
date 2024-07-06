import {
  Box,
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useStore } from "../../providers/StoreProvider";
import { useGetPlaysLevelDetail } from "../../queries/useGetPlaysLevelDetail";
import theme from "../../theme/theme";

interface PlaysTableProps {
  inStore?: boolean;
}

const { blue, white, purple } = theme.colors;

export const PlaysTable = ({ inStore = false }: PlaysTableProps) => {
  const { data: apiPlays } = useGetPlaysLevelDetail();

  const store = useStore();
  const levelUpPlay = store?.levelUpPlay;
  const cash = store?.cash ?? 0;
  const pokerHandItems = store?.shopItems?.pokerHandItems;

  const plays =
    inStore && isMobile
      ? apiPlays?.filter(
          (p) =>
            !!pokerHandItems.find((item) => item.poker_hand === p.pokerHand.id)
        )
      : apiPlays;

  return (
    <>
      {plays ? (
        <TableContainer>
          <Table
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0 .3em",
              marginBottom: 4,
            }}
            width={"100%"}
            variant={isMobile ? "store-mobile" : "store"}
          >
            <Thead
              sx={{
                position: "relative",
                _after: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background:
                    "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                },
                _before: {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background:
                    "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)",
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              <Tr>
                {inStore ? (
                  <>
                    <Td textAlign={"left"} fontSize={isMobile ? 12 : undefined}>
                      HAND
                    </Td>
                    <Td>LEVEL</Td>
                    <Td>PRICE</Td>
                    <Td></Td>
                  </>
                ) : (
                  <>
                    <Td>LEVEL</Td>
                    <Td>HAND</Td>
                    <Td>POINTS/MULTI</Td>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {plays.map((play, index) => {
                const storePlay = pokerHandItems?.find(
                  (item) => item.poker_hand === play.pokerHand.id
                );
                const purchased = storePlay?.purchased || false;

                const textColor = storePlay
                  ? purchased
                    ? blue
                    : white
                  : purple;

                const opacitySx = {
                  opacity: inStore && (!storePlay || purchased) ? 0.9 : 1,
                };

                const levelTd = (
                  <Td sx={opacitySx} textColor={textColor}>
                    {play.level}
                  </Td>
                );
                const nameTd = (
                  <Td sx={opacitySx} textAlign={"start"} textColor={textColor}>
                    {play.pokerHand.name}
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
                        {play.points}
                      </Box>
                      <Heading fontSize={"15"}>x</Heading>
                      <Box
                        backgroundColor={"neonPink"}
                        borderRadius={10}
                        width={"50px"}
                        ml={1}
                      >
                        {play.multi}
                      </Box>
                    </Box>
                  </Td>
                );

                const notEnoughCash = !!storePlay && cash < storePlay.cost;

                const buyButton = (
                  <Button
                    onClick={() => {
                      levelUpPlay?.(storePlay?.idx ?? 0, storePlay?.cost ?? 0);
                    }}
                    isDisabled={notEnoughCash}
                    size="sm"
                    px={isMobile ? 2 : 4}
                  >
                    level up
                  </Button>
                );

                return (
                  <Tr key={index} height={"30px"}>
                    {inStore ? (
                      <>
                        {nameTd}
                        {levelTd}
                      </>
                    ) : (
                      <>
                        {levelTd}
                        {nameTd}
                      </>
                    )}

                    {inStore ? (
                      <>
                        <Td sx={opacitySx} color={textColor}>
                          {storePlay?.cost ? `${storePlay.cost}ȼ` : ""}
                        </Td>
                        <Td>
                          {!!storePlay ? (
                            storePlay?.purchased ? (
                              <Heading
                                color="blue"
                                size={isMobile ? "base" : "xs"}
                              >
                                PURCHASED
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
