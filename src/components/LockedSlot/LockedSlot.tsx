import { useGame } from "../../dojo/queries/useGame.tsx";
import { GameLockedSlot } from "./GameLockedSlot.tsx";
import { StoreLockedSlot } from "./StoreLockedSlot.tsx";

export interface LockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
}

export const LockedSlot = (props: LockedSlotProps) => {
  const game = useGame();

  return game?.state === "IN_GAME" ? (
    <GameLockedSlot {...props} />
  ) : (
    <StoreLockedSlot {...props} />
  );
};
