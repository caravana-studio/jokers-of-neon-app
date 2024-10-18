import { Box } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useCardScale } from "../hooks/useCardScale";
import { CashSymbol } from "./CashSymbol";

interface IPriceBoxProps {
  price: number;
  purchased: boolean;
  scale: number;
}

export const PriceBox = ({ price, purchased, scale = 1 }: IPriceBoxProps) => {
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
        fontSize: isMobile ? 15 * scale : 18 * scale,
        px: 2,
        pt: "1px",
        opacity: purchased ? 0.5 : 1,
      }}
    >
      {price}
      <CashSymbol />
    </Box>
  );
};
