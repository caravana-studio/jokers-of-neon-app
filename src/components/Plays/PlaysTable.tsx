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
import { useGetPlaysLevelDetail } from "../../queries/useGetPlaysLevelDetail";
interface PlaysTableProps {
  inStore?: boolean;
}

export const PlaysTable = ({ inStore = false }: PlaysTableProps) => {
  const { data: plays } = useGetPlaysLevelDetail();

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
                const levelTd = <Td color={"aqua"}>{play.level}</Td>;
                const nameTd = (
                  <Td textAlign={"start"} color={"white"}>
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
                  <Tr key={index} backgroundColor={"gray.700"} height={"30px"}>
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

                    {inStore ? <>
                    <Td color='neonPink'>
                        300ȼ
                    </Td>
                                        <Td>
                        <Button variant='ghost'>level up</Button>
                    </Td> 
                    </>
                    : pointsMultiTd}
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
