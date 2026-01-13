import { useNavigate as useRouterNavigate } from "react-router-dom";
import { stateToPageMap } from "../constants/redirectConfig";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useCardData } from "../providers/CardDataProvider";
import { useGameStore } from "../state/useGameStore";
import { useShopStore } from "../state/useShopStore";

export const useCustomNavigate = () => {
  const navigate = useRouterNavigate();
  const {
    setState,
    resetRage,
    refetchSpecialCards,
    id: gameId,
    modId,
  } = useGameStore();
  const {
    setup: { client },
  } = useDojo();

  const customNavigate = (state: GameStateEnum) => {
    setState(state);
    if (state !== GameStateEnum.Rage) {
      resetRage();
    }
    const targetPath = stateToPageMap[state];
    if (targetPath === "/store") {
      refetchSpecialCards(client, gameId);
    }
    navigate(targetPath);
  };

  return customNavigate;
};
