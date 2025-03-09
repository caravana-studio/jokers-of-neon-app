import { useTranslation } from "react-i18next";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";

export const StoreLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  return (
    <BaseLockedSlot
      {...props}
      tooltipText={t("locked-slot")}
      hoverEffect={{
        transform: "scale(1.1)",
        cursor: "pointer",
      }}
    />
  );
};
