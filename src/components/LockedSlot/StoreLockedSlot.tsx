import { useTranslation } from "react-i18next";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../providers/StoreProvider.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";

export const StoreLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const navigate = useNavigate();
  const { specialSlotItem, locked } = useStore();
  const price = specialSlotItem?.cost ?? 0;
  const game = useGame();
  const cash = game?.cash ?? 0;

  const notEnoughCash =
    !price ||
    (specialSlotItem?.discount_cost
      ? cash < Number(specialSlotItem?.discount_cost ?? 0)
      : cash < Number(price));

  const canBuy = !notEnoughCash && !locked && !specialSlotItem.purchased;

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
