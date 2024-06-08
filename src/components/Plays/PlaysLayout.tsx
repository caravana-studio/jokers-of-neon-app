import { Box, Heading, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react'
import { useGetPlaysLevelDetail } from '../../queries/useGetPlaysLevelDetail'
import { PlaysTable } from './PlaysTable';

export const PlaysLayout = () => {


  return (
    <Box
      backgroundColor={"#04162d"}
      py={4}
      px={8}
    >
      <Heading size="l" color="aqua" textAlign={"center"}>
        AVAILABLE PLAYS
      </Heading>

      <PlaysTable />
    </Box>
  );
};