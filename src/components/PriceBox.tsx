import { Box } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { CashSymbol } from "./CashSymbol";

interface IPriceBoxProps {
  price: number;
  purchased: boolean;
  originalPrice?: number;
}

export const PriceBox = ({
  price,
  purchased,
  originalPrice = 0,
}: IPriceBoxProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "-8%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        backgroundColor: "black",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px 2px white",
        color: "white",
        fontSize: isMobile ? 15 : 18,
        px: 2,
        pt: "1px",
        opacity: purchased ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          textDecoration: originalPrice > 0 ? "line-through" : "none",
          fontSize: isMobile ? 15 : originalPrice > 0 ? 10 : 18,
        }}
      >
        {originalPrice > 0 ? originalPrice : price}
        <CashSymbol />
      </Box>

      {originalPrice > 0 && (
        <Box>
          {price}
          <CashSymbol />
        </Box>
      )}
    </Box>
  );
};
