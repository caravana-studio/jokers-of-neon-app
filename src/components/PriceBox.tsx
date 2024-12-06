import { Box } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { CashSymbol } from "./CashSymbol";

interface IPriceBoxProps {
  price: number;
  purchased: boolean;
  discountPrice?: number;
  absolutePosition?: boolean;
  fontSize?: number | string;
}

export const PriceBox = ({
  price,
  purchased,
  discountPrice = 0,
  absolutePosition = true,
  fontSize = isMobile ? 15 : 1,
}: IPriceBoxProps) => {
  return (
    <Box
      sx={{
        position: absolutePosition ? "absolute" : "default",
        bottom: "-8%",
        left: "50%",
        transform: absolutePosition ? "translateX(-50%)" : "translateX(0)",
        zIndex: 10,
        backgroundColor: "black",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px 2px white",
        color: "white",
        fontSize: fontSize,
        px: 2,
        pt: "1px",
        opacity: purchased ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          textDecoration: discountPrice > 0 ? "line-through" : "none",
          fontSize: isMobile ? 15 : discountPrice > 0 ? 10 : 18,
        }}
      >
        {price}
        <CashSymbol />
      </Box>

      {discountPrice > 0 && (
        <Box>
          {discountPrice}
          <CashSymbol />
        </Box>
      )}
    </Box>
  );
};
