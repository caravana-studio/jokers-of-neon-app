import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { Suits } from "../../enums/suits";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { suitColorsMap, useTableData } from "./DeckPreviewTableUtils";
import { PreviewTableColumnHeader } from "./PreviewTableColumnHeader";
import { PreviewTableRowHeader } from "./PreviewTableRowHeader";

export const DeckPreviewTable = () => {
  const tableData = useTableData();
  const columnHeaders = tableData.columnHeaders;
  const rowHeaders = tableData.rowHeaders;
  const rows = tableData.cells;

  const { isSmallScreen } = useResponsiveValues();

  return (
    <Table
      variant="deck"
      size="sm"
      border="none"
      borderWidth={0}
      cellSpacing={isSmallScreen ? "0 1px" : "0 8px"}
    >
      <Thead>
        <Tr>
          <Th border="none" p={0} m={0} paddingLeft={"1px"}>
            <PreviewTableRowHeader
              cardSuit={rowHeaders[rowHeaders.length - 1].cardSuit}
              quantity={rowHeaders[rowHeaders.length - 1].quantity}
            />
          </Th>
          {columnHeaders.map((header, index) => (
            <Th key={index} border="none" padding={0} paddingLeft={"1px"}>
              <PreviewTableColumnHeader
                cardValue={header.cardValue}
                quantity={header.quantity}
              />
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody color={"white"}>
        {rows.slice(0, -1).map((row, rowIndex) => {
          const suit = rowHeaders[rowIndex]?.cardSuit;
          const suitColor = suit ? suitColorsMap.get(suit) : undefined;
          const rowBackgroundColor = suitColor
            ? `${suitColor}80`
            : "rgba(0, 0, 0, 0.5)";

          return (
            <Tr key={rowIndex}>
              <Th border="none" p={0} m={0}>
                <PreviewTableRowHeader
                  cardSuit={rowHeaders[rowIndex].cardSuit}
                  quantity={rowHeaders[rowIndex].quantity}
                />
              </Th>
              {row.map((cell, cellIndex) => (
                <Td
                  visibility={suit != Suits.JOKER ? "visible" : "hidden"}
                  key={`${rowIndex}-${cellIndex}`}
                  p={1}
                  textAlign="center"
                  backgroundColor={rowBackgroundColor}
                  border="none"
                  borderRadius={
                    cellIndex === 0
                      ? "15px 0 0 15px"
                      : cellIndex === row.length - 1
                        ? "0 15px 15px 0"
                        : "0"
                  }
                >
                  <Box opacity={cell.quantity > 0 ? 1 : 0.2}>
                    {cell.quantity}
                  </Box>
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
