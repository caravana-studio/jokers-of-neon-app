import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../../state/useShopStore.ts";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";

export const StoreLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const navigate = useNavigate();
  const { locked, specialSlotItem } = useShopStore();

  const canBuy = !locked;

  return (
    <BaseLockedSlot
      {...props}
      price={Number(specialSlotItem?.cost ?? 0)}
      discountPrice={Number(specialSlotItem?.discount_cost ?? 0)}
      tooltipText={canBuy ? t("locked-slot") : ""}
      hoverEffect={
        canBuy
          ? {
              transform: "scale(1.1)",
              cursor: "pointer",
              transition:
                "background-image 0.6s ease-in-out, transform 0.6s ease",
            }
          : {}
      }
      onClick={canBuy ? () => navigate("/preview/slot") : undefined}
      hoverBgImage={canBuy ? "/store/unlocking-slot.png" : undefined}
    />
  );
};
