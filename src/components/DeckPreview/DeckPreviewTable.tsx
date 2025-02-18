import { Table, Thead, Tbody, Tr, Th, Td, Flex } from "@chakra-ui/react";
import { getTableHeader } from "./DeckPreviewTableUtils";
import { PreviewTableColumnHeader } from "./PreviewTableColumnHeader";
import { PreviewTableRowHeader } from "./PreviewTableRowHeader";

export const DeckPreviewTable = () => {
  const tableHeader = getTableHeader();
  const columnHeaders = tableHeader.columnHeaders;
  const rowHeaders = tableHeader.rowHeaders;
  const rows = tableHeader.cells;

  return (
    <Flex flexDirection={"column"} position={"absolute"} zIndex={100}>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            {columnHeaders.map((header, index) => (
              <Th key={index}>
                <PreviewTableColumnHeader
                  cardValue={header.cardValue}
                  quantity={header.quantity}
                />
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody color={"white"}>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              <Th>
                <PreviewTableRowHeader
                  cardSuit={rowHeaders[rowIndex].cardSuit}
                  quantity={rowHeaders[rowIndex].quantity}
                />
              </Th>
              {row.map((cell, cellIndex) => (
                <Td key={`${rowIndex}-${cellIndex}`}>{cell.quantity}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
