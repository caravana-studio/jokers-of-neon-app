import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../state/useGameStore.ts";
import { useShopStore } from "../../state/useShopStore.ts";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";

export const StoreLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const navigate = useNavigate();
  const { specialSlotItem, locked } = useShopStore();
  const price = specialSlotItem?.cost ?? 0;

  const { cash } = useGameStore();

  const notEnoughCash =
    !price ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(price));

  const canBuy = !notEnoughCash && !locked;

  return (
    <BaseLockedSlot
      {...props}
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
