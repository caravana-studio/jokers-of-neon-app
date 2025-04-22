import { useTranslation } from "react-i18next";
import { BaseLockedSlot } from "./BaseLockedSlot.tsx";
import { LockedSlotProps } from "./LockedSlot.tsx";

export const GameLockedSlot = (props: LockedSlotProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.special-cards" });

  return <BaseLockedSlot {...props} tooltipText={t("locked-slot")} />;
};
