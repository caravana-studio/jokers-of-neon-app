import { Flex, SystemStyleObject } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CashSymbol } from "./CashSymbol";

interface IPriceBoxProps {
  price: number;
  purchased: boolean;
  discountPrice?: number;
  isPowerUp?: boolean;
  absolutePosition?: boolean;
  fontSize?: number | string | string[];
  discountFontSize?: number | string | string[];
  bottomOffset?: string | number;
  containerSx?: SystemStyleObject;
}

export const PriceBox = ({
  price,
  purchased,
  discountPrice = 0,
  isPowerUp = false,
  absolutePosition = true,
  fontSize,
  discountFontSize,
  bottomOffset,
  containerSx,
}: IPriceBoxProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const finalFontSize = fontSize ?? (isMobile ? 15 : 20);
  const finalDiscountFontSize = discountFontSize ?? (isMobile ? 12 : 15);
  const powerUpBottom = isSmallScreen ? 40 : 20;

  return (
    <Flex
      sx={{
        position: absolutePosition ? "absolute" : "default",
        bottom:
          bottomOffset ?? `-${isPowerUp ? powerUpBottom : 8}%`,
        left: "50%",
        transform: absolutePosition ? "translateX(-50%)" : "translateX(0)",
        zIndex: 10,
        backgroundColor: "black",
        borderRadius: ["3px", "3px", "4px"],
        boxShadow: "0px 0px 10px 2px white",
        color: "white",
        px: isSmallScreen ? 2 : 3,
        py: "1px",
        opacity: purchased ? 0.5 : 1,
        pointerEvents: "none",
        fontWeight: 400,
        ...containerSx,
      }}
      flexDir="column"
      gap={isSmallScreen ? 1 : 1.5}
    >
      <Flex
        sx={{
          textDecoration: discountPrice > 0 ? "line-through" : "none",
          fontSize: discountPrice ? finalDiscountFontSize : finalFontSize,
          lineHeight: discountPrice > 0 ? 0.5 : 1,
          mt: discountPrice > 0 ? 0.5 : 0,
          opacity: discountPrice > 0 ? 0.7 : 1,
        }}
        gap={1}
        justifyContent="center"
        alignItems="center"
      >
        {!discountPrice && <CashSymbol />}
        {price}
      </Flex>

      {discountPrice > 0 && (
        <Flex
          justifyContent="center"
          alignItems="center"
          gap={1}
          sx={{ fontSize: finalFontSize, lineHeight: 0.8 }}
        >
          <CashSymbol />
          {discountPrice}
        </Flex>
      )}
    </Flex>
  );
};
