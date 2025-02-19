import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
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
            <Th key={index} border="none" padding={0} paddingLeft={1}>
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
          <Tr key={rowIndex} border="none" borderBottom="2px solid transparent">
            <Th border="none" p={0} m={0} pr={1}>
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
                  p={1}
                  textAlign="center"
                  backgroundColor={suit ? colors[suit] : "transparent"}
                  border="none"
                  borderRadius={
                    cellIndex === 0
                      ? "15px 0 0 15px"
                      : cellIndex === row.length - 1
                        ? "0 15px 15px 0"
                        : "0"
                  }
                >
                  <Text opacity={cell.quantity > 0 ? 1 : 0.6}>
                    {cell.quantity}
                  </Text>
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
