import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useTheme,
} from "@chakra-ui/react";
import { getTableData } from "./DeckPreviewTableUtils";
import { PreviewTableColumnHeader } from "./PreviewTableColumnHeader";
import { PreviewTableRowHeader } from "./PreviewTableRowHeader";

export const DeckPreviewTable = () => {
  const tableData = getTableData();
  const columnHeaders = tableData.columnHeaders;
  const rowHeaders = tableData.rowHeaders;
  const rows = tableData.cells;
  const { colors } = useTheme();

  return (
    <Flex flexDirection={"column"} position={"absolute"} zIndex={100}>
      <Table
        variant="simple"
        size="sm"
        border="none"
        borderWidth={0}
        cellSpacing={"0 8px"}
      >
        <Thead>
          <Tr>
            <Th border="none"></Th>
            {columnHeaders.map((header, index) => (
              <Th key={index} border="none">
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
            <Tr
              key={rowIndex}
              border="none"
              borderBottom="2px solid transparent"
            >
              <Th border="none" p={0} m={0} pr={2}>
                <PreviewTableRowHeader
                  cardSuit={rowHeaders[rowIndex].cardSuit}
                  quantity={rowHeaders[rowIndex].quantity}
                />
              </Th>
              {row.map((cell, cellIndex) => {
                const suit = rowHeaders[rowIndex]?.cardSuit;
                return (
                  <Td
                    key={`${rowIndex}-${cellIndex}`}
                    p={2}
                    textAlign="center"
                    backgroundColor={suit ? colors[suit] : "transparent"}
                    opacity={0.8}
                    border="none"
                    borderRadius={
                      cellIndex === 0
                        ? "15px 0 0 15px"
                        : cellIndex === row.length - 1
                          ? "0 15px 15px 0"
                          : "0"
                    }
                  >
                    {cell.quantity}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
