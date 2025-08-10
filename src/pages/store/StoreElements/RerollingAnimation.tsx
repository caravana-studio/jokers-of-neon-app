import { PropsWithChildren } from "react";
import { MotionBox } from "../../../components/MotionBox";
import { useShopStore } from "../../../state/useShopStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

export const RerollingAnimation = ({ children }: PropsWithChildren) => {
  const { rerolling } = useShopStore();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <MotionBox
      w="100%"
      h="100%"
      initial={{ opacity: 1, rotate: 0 }}
      animate={{
        opacity: rerolling ? 0 : 1,
        translateY: rerolling ? (isSmallScreen ? -40 : -100) : 0,
      }}
      transition={{
        opacity: { duration: 0.2, ease: "easeInOut" },
        translateY: rerolling
          ? { duration: 0.2, ease: "easeInOut" }
          : { type: "spring", stiffness: 500, damping: 20 },
      }}
    >
      {children}
    </MotionBox>
  );
};
