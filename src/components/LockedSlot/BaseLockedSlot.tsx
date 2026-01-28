import { Box, Tooltip } from "@chakra-ui/react";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import CachedImage from "../CachedImage.tsx";
import { useState } from "react";
import { PriceBox } from "../PriceBox";

interface IBaseLockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
  tooltipText: string;
  hoverEffect?: object;
  onClick?: Function;
  hoverBgImage?: string;
  price?: number;
  discountPrice?: number;
  showPrice?: boolean;
}

export const BaseLockedSlot = ({
  scale = 1,
  backgroundColor,
  borderRadius,
  tooltipText,
  hoverEffect = {},
  onClick,
  hoverBgImage,
  price,
  discountPrice,
  showPrice = true,
}: IBaseLockedSlotProps) => {
  const defaultBg = "/store/locked-slot.png";
  const [bgImage, setBgImage] = useState(defaultBg);
  const finalPrice =
    discountPrice && discountPrice > 0 ? discountPrice : price ?? 0;

  return (
    <Tooltip label={tooltipText}>
      <Box position="relative">
        <Box
          _hover={hoverEffect}
          onClick={() => onClick?.()}
          onMouseEnter={() => hoverBgImage && setBgImage(hoverBgImage)}
          onMouseLeave={() => setBgImage(defaultBg)}
        >
          <CachedImage
            src={bgImage}
            alt="slot-icon"
            width={`${CARD_WIDTH * scale}`}
            height={`${CARD_HEIGHT * scale}`}
            minWidth={`${CARD_WIDTH * scale}`}
            backgroundColor={backgroundColor ?? "transparent"}
            borderRadius={borderRadius ?? "0px"}
          />
        </Box>
        {showPrice && finalPrice > 0 && (
          <PriceBox
            price={Number(price ?? 0)}
            discountPrice={Number(discountPrice ?? 0)}
            purchased={false}
            absolutePosition
            fontSize={scale > 1 ? "14px" : "12px"}
            discountFontSize={scale > 1 ? "12px" : "10px"}
            bottomOffset={scale > 1 ? "-18%" : "-16%"}
            containerSx={{
              backgroundColor: "black",
              borderRadius: "20px",
              boxShadow: "0 0 10px 3px rgba(255, 255, 255, 0.2)",
              px: 2,
              py: 0.5,
              minW: "56px",
              justifyContent: "center",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};
