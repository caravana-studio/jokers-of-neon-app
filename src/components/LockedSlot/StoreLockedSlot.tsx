import { useTranslation } from "react-i18next";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";
import { useNavigate } from "react-router-dom";

export const StoreLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const navigate = useNavigate();

  return (
    <BaseLockedSlot
      {...props}
      tooltipText={t("locked-slot")}
      hoverEffect={{
        transform: "scale(1.1)",
        cursor: "pointer",
      }}
      onClick={() => navigate("/preview/slot")}
      hoverBgImage="/store/unlocking-slot-2.png"
    />
  );
};
