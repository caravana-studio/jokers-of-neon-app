import { Box } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CashSymbol } from "./CashSymbol";

interface IPriceBoxProps {
  price: number;
  purchased: boolean;
  discountPrice?: number;
  isPowerUp?: boolean;
}

export const PriceBox = ({
  price,
  purchased,
  discountPrice = 0,
  isPowerUp = false,
}: IPriceBoxProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const powerUpBottom = isSmallScreen ? 40 : 20;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: `-${isPowerUp ? powerUpBottom : 8}%`,
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
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          textDecoration: discountPrice > 0 ? "line-through" : "none",
          fontSize: isMobile ? 15 : discountPrice > 0 ? 10 : 18,
          lineHeight: discountPrice > 0 ? 0.5 : 1,
          mt: discountPrice > 0 ? 0.5 : 0,
          opacity: discountPrice > 0 ? 0.7 : 1,
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
