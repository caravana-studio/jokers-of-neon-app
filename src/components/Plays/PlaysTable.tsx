import {
  Box,
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGame } from "../../dojo/queries/useGame";
import { useGetPlaysLevelDetail } from "../../queries/useGetPlaysLevelDetail";
import { useGetShopItems } from "../../queries/useGetShopItems";
interface PlaysTableProps {
  inStore?: boolean;
  onBuyPlayLevelUp?: (playIdx: number, price: number) => void;
}

export const PlaysTable = ({
  inStore = false,
  onBuyPlayLevelUp,
}: PlaysTableProps) => {
  const { data: plays } = useGetPlaysLevelDetail();
  const game = useGame();
  const id = game?.id;
  const round = game?.round;
  const { data: shopItems } = useGetShopItems(id, round, inStore);

  return (
    <>
      {plays ? (
        <TableContainer>
          <Table
            variant="simple"
            sx={{ borderCollapse: "separate", borderSpacing: "0 .3em" }}
          >
            <Thead>
              <Tr>
                {inStore ? (
                  <>
                    <Td textAlign={"left"}>HAND</Td>
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
                const storePlay = shopItems?.pokerHandItems?.find(
                  (item) => item.poker_hand === play.pokerHand.id
                );
                const opacitySx = {
                  opacity:
                    inStore && (!storePlay || storePlay.purchased) ? 0.4 : 1,
                };
                const levelTd = (
                  <Td sx={opacitySx} color={"aqua"}>
                    {play.level}
                  </Td>
                );
                const nameTd = (
                  <Td sx={opacitySx} textAlign={"start"} color={"white"}>
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

                return (
                  <Tr
                    key={index}
                    backgroundColor={
                      !storePlay || storePlay.purchased
                        ? "gray.900"
                        : "gray.700"
                    }
                    height={"30px"}
                  >
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
                        <Td sx={opacitySx} color="neonPink">
                          {storePlay?.cost ? `${storePlay.cost}ȼ` : ""}
                        </Td>
                        <Td>
                          {!!storePlay ? (
                            storePlay?.purchased ? (
                              <Heading variant="neonWhite" size="s">
                                PURCHASED
                              </Heading>
                            ) : (
                              <Button
                                onClick={() => {
                                  onBuyPlayLevelUp?.(
                                    storePlay.idx,
                                    storePlay.cost
                                  );
                                }}
                                disabled={!!storePlay}
                                variant="outline"
                              >
                                level up
                              </Button>
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
