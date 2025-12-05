import { DIAMONDS } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";

interface CashSymbolProps {
  size?: string | number;
}
export const CashSymbol = ({ size: providedSize }: CashSymbolProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const size = providedSize ? providedSize : isSmallScreen ? "12px" : "16px";
  return (
    <CachedImage
      boxShadow={`0 0 10px ${DIAMONDS}`}
      borderRadius={"full"}
      src="/coin.png"
      w={size}
      h={size}
      display={"inline-flex"}
    />
  );
};
