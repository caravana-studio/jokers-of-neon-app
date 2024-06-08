import { Box, Heading, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react'
import { useGetPlaysLevelDetail } from '../queries/useGetPlaysLevelDetail'

export const PlaysLayout = () => {

  const { data: plays } = useGetPlaysLevelDetail();

  return (
    <Box
      backgroundColor={"#04162d"}
      py={4}
      px={8}
    >
      <Heading size="l" color="aqua" textAlign={"center"}>
        AVAILABLE PLAYS
      </Heading>

      {plays ? (
        <TableContainer>
          <Table variant="simple" sx={{borderCollapse:"separate", borderSpacing:"0 .3em"}}>
            <Thead>
              <Tr>
                <Td>LEVEL</Td>
                <Td>HAND</Td>
                <Td>POINTS/MULTI</Td>
              </Tr>
            </Thead>
            <Tbody>
              {plays.map((play, index) => (
                <Tr
                  key={index}
                  backgroundColor={"gray.700"}
                  height={"30px"}
                >
                  <Td color={"aqua"}>
                    {play.level}
                  </Td>

                  <Td textAlign={"start"} color={"white"}>
                    {play.pokerHand.name}
                  </Td>
                  <Td>
                    <Box
                      color={"black"}
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                    >
                      <Box backgroundColor={"neonGreen"} borderRadius={10} width={"50px"} mr={1}>
                        {play.points}
                      </Box>
                      <Heading fontSize={"15"}>x</Heading>
                      <Box backgroundColor={"neonPink"} borderRadius={10} width={"50px"} ml={1}>
                        {play.multi}
                      </Box>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : ("Loading...")}
    </Box>
  );
};