import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useGameStore } from "../state/useGameStore";
import { useMapNavigationStore } from "../state/useMapNavigationStore";
import { isMockGameApiMode } from "../config/gameMode";
import { useRoguelikeRuntimeStore } from "../state/roguelike/useRoguelikeRuntimeStore";
import { useCustomNavigate } from "./useCustomNavigate";

export const useMapNavigate = () => {
  const customNavigate = useCustomNavigate();
  const { refetchGameStore, id: gameId } = useGameStore();
  const { setNodeTransactionPending, setActiveNodeId } = useMapNavigationStore();
  const {
    setup: { client },
  } = useDojo();

  const navigateToMap = async () => {
    if (!isMockGameApiMode) {
      await refetchGameStore(client, gameId);
    } else {
      const runtime = useRoguelikeRuntimeStore.getState();
      if (runtime.phase === "REWARDS") {
        runtime.continueFromRewardsToMap();
      } else if (runtime.phase === "SHOP") {
        runtime.leaveShopToMap();
      }
    }
    // Reset map navigation state to ensure nodes are clickable
    setNodeTransactionPending(false);
    setActiveNodeId(null);
    customNavigate(GameStateEnum.Map);
  };

  return { navigateToMap };
};
