import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useGameStore } from "../../state/useGameStore.ts";
import { GameLockedSlot } from "./GameLockedSlot.tsx";
import { StoreLockedSlot } from "./StoreLockedSlot.tsx";

export interface LockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
  price?: number;
  discountPrice?: number;
  showPrice?: boolean;
}

export const LockedSlot = (props: LockedSlotProps) => {
  const { state } = useGameStore();

  return state === GameStateEnum.Round || state === GameStateEnum.Rage ? (
    <GameLockedSlot {...props} />
  ) : (
    <StoreLockedSlot {...props} />
  );
};
