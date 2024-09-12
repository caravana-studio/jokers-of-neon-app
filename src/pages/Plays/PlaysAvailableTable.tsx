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
import CustomScrollbar from "../../components/CustomScrollbar/CustomScrollbar";
  
  const { blueLight, blue, violet } = theme.colors;
  
  export const PlaysAvailableTable = () => {
    const { gameId } = useGameContext();
    const { data: apiPlays } = useGetPlaysLevelDetail(gameId);
  
    const store = useStore();
    const { pokerHandItems } = useShopItems();
  
    const plays = apiPlays;

    const TableContent = () => (<Table
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
      <Tbody>
        { plays && plays.map((play, index) => {
          const storePlay = pokerHandItems?.find(
            (item) => item.poker_hand === play.pokerHand.id
          );  
          const textColor = "white";

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
  </Table>);
  
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
            { isMobile  ? (
            <CustomScrollbar><TableContent/></CustomScrollbar>) 
            : <TableContent/>}
          </TableContainer>
        ) : (
          "Loading..."
        )}
      </>
    );
  };
  