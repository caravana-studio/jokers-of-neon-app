import { GameProvider } from "../../providers/GameProvider";
import { GameContent } from "./GameContent";

export const GamePage = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};
