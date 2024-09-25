import {
    Box,
    Flex,
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
  import CustomScrollbar from "../../components/CustomScrollbar/CustomScrollbar";
import { TiltCard } from "../../components/TiltCard";
import { PLAYS_DATA } from "../../constants/plays";
import { Text } from "@chakra-ui/react";
import { useState } from "react";
import { BLUE_LIGHT } from "../../theme/colors";
  
  const { blueLight, blue, violet } = theme.colors;
  
  interface PlaysAvailableTableProps {
    maxHeight?: {
      base?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
  }

  export const PlaysAvailableTable: React.FC<PlaysAvailableTableProps> = ({ maxHeight }) => {
    const { gameId } = useGameContext();
    const { data: apiPlays } = useGetPlaysLevelDetail(gameId);
  
    const store = useStore();
    const { pokerHandItems } = useShopItems();
  
    const plays = apiPlays;

    const [ playsExampleIndex, setPlaysExampleIndex ]= useState(0);
  
    return (
      <>
        {plays ? (
          <TableContainer 
            maxHeight={maxHeight}
            border={`2px solid ${blueLight}`}
            borderRadius={"25px"}
            boxShadow={`0px 0px 20px 15px ${blue}`}
            backgroundColor="rgba(0, 0, 0, 1)"
          >
            <CustomScrollbar>
              <Table
                sx={{
                  borderCollapse: "separate",
                  marginBottom: 4,
                  borderSpacing:0
                }}
                width={"100%"}
                variant={isMobile ? "store-mobile" : "store"}
              >
                <Thead
                  sx={{
                    position: "relative",
                    background: "black",
                    border: "10px",
                    borderColor: "transparent",
                    borderRadius: "25px",        
                    _before: {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: {base: "2.5%", sm: "5%"},
                      width: {base: "95%", sm: "90%"},
                      height: {base: "1px", sm: "2px"},               
                      backgroundColor: "white",
                      boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  <Tr>
                    {(
                      <>
                        <Td fontSize={isMobile ? 12 : 17}>LEVEL</Td>
                        <Td fontSize={isMobile ? 12 : 17}>HAND</Td>
                        <Td fontSize={isMobile ? 12 : 17}>POINTS/MULTI</Td>
                      </>
                    )}
                  </Tr>
                </Thead>
                <Tr>
                  <Td colSpan={3} sx={{ position: "sticky", top: "36px", backgroundColor: "black" }} p={4}>
                    <Text color={"white"}>{PLAYS_DATA[playsExampleIndex].description}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={3} sx={{ position: "sticky", top: 20, backgroundColor: "black" }} p={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center", 
                        padding: "0px 4px 4px 4px",   
                        flexDirection: "row",
                      }}
                    >
                      <Flex
                        wrap={"nowrap"}
                        width={"fit-content"} 
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={4}
                      >
                        <TiltCard card={PLAYS_DATA[playsExampleIndex].example[0]} scale={0.65} />
                        <TiltCard card={PLAYS_DATA[playsExampleIndex].example[1]} scale={0.65} />
                        <TiltCard card={PLAYS_DATA[playsExampleIndex].example[2]} scale={0.65} />
                        <TiltCard card={PLAYS_DATA[playsExampleIndex].example[3]} scale={0.65} />
                        <TiltCard card={PLAYS_DATA[playsExampleIndex].example[4]} scale={0.65} />
                      </Flex>
                    </Box>
                  </Td>
                </Tr>
                  <Tbody>
                    { plays && plays.map((play, index) => {
                      const storePlay = pokerHandItems?.find(
                        (item) => item.poker_hand === play.pokerHand.id
                      );  

                      const textColor = playsExampleIndex === index ? BLUE_LIGHT : "white";

                      const opacitySx = {
                        opacity: 1,
                      };

                      const levelTd = (
                        <Td sx={opacitySx} textColor={textColor} fontSize={isMobile ? 9 : 13}>
                          {play.level}
                        </Td>
                      );
                      const nameTd = (
                        <Td sx={opacitySx} textAlign={"center"} textColor={textColor} fontSize={isMobile ? 9 : 13}>
                          {play.pokerHand.name}
                        </Td>
                      );
                      const pointsMultiTd = (
                        <Td>
                          <Box
                            color={"white"}
                            display={"flex"}
                            flexDirection={"row"}
                            justifyContent={"center"}
                          >
                            <Box
                              backgroundColor={`${blue}`}
                              borderRadius={4}
                              width={isMobile ? "40px" : "60px"} 
                              mr={1}
                              boxShadow={`0px 0px 10px 6px ${blue}`}
                              fontWeight={"400"}
                            >
                              {play.points}
                            </Box>
                            <Heading fontSize={isMobile ? "8" : "10"}>x</Heading>
                            <Box
                              backgroundColor={"neonPink"}
                              borderRadius={4}
                              width={isMobile ? "40px" : "60px"} 
                              ml={1}
                              boxShadow={`0px 0px 10px 6px ${violet}`}
                              fontWeight={"400"}
                            >
                              {play.multi}
                            </Box>
                          </Box>
                        </Td>
                      );

                      return (
                        <Tr key={index} height={"30px"} onClick={() => setPlaysExampleIndex(index)} sx={{ cursor: "pointer"}}>
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
            </CustomScrollbar> 
          </TableContainer>
        ) : (
          "Loading..."
        )}
      </>
    );
  };
  