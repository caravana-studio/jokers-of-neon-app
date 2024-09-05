import {
    Box,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
  } from "@chakra-ui/react";
  import { isMobile } from "react-device-detect";
  import { useShopItems } from "../../dojo/queries/useShopItems";
  import { useGameContext } from "../../providers/GameProvider";
  import { useStore } from "../../providers/StoreProvider";
  import { useGetPlaysLevelDetail } from "../../queries/useGetPlaysLevelDetail";
  import theme from "../../theme/theme";
  
  const { blueLight, blue } = theme.colors;
  
  export const PlaysAvailableTable = () => {
    const { gameId } = useGameContext();
    const { data: apiPlays } = useGetPlaysLevelDetail(gameId);
  
    const store = useStore();
    const { pokerHandItems } = useShopItems();
  
    const plays = apiPlays;
  
    return (
      <>
        {plays ? (
          <TableContainer 
            border={`2px solid ${blueLight}`}
            borderRadius={"25px"}
            boxShadow={`0px 0px 20px 15px ${blue}`}
            filter="blur(0.5px)"
            backgroundColor="rgba(0, 0, 0, 1)"
          >
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
                  {(
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
                  const textColor = blueLight;
  
                  const opacitySx = {
                    opacity: 1,
                  };
  
                  const levelTd = (
                    <Td sx={opacitySx} textColor={textColor}>
                      {play.level}
                    </Td>
                  );
                  const nameTd = (
                    <Td sx={opacitySx} textAlign={"center"} textColor={textColor}>
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
                    <Tr key={index} height={"30px"}>
                      {(
                        <>
                          {levelTd}
                          {nameTd}
                        </>
                      )}
  
                      {(
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
  