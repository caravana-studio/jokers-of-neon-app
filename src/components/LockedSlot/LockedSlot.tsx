import { useGame } from "../../dojo/queries/useGame.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { GameLockedSlot } from "./GameLockedSlot.tsx";
import { StoreLockedSlot } from "./StoreLockedSlot.tsx";

export interface LockedSlotProps {
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
}

export const LockedSlot = (props: LockedSlotProps) => {
  const game = useGame();

  return game?.state === GameStateEnum.Round || game?.state === GameStateEnum.Rage ? (
    <GameLockedSlot {...props} />
  ) : (
    <StoreLockedSlot {...props} />
  );
};
