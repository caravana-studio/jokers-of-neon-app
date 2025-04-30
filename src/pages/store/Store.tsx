import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { StoreContent } from "./StoreContent";
import { StoreContentMobile } from "./StoreContent.mobile";

import Joyride, { CallBackProps } from "react-joyride";
import {
  JOYRIDE_LOCALES,
  STORE_TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial.ts";
import {
  SKIP_TUTORIAL_STORE,
  STORE_LAST_TAB_INDEX,
} from "../../constants/localStorage.ts";

import { RemoveScroll } from "react-remove-scroll";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const Store = () => {
  const { gameId, setIsRageRound } = useGameContext();
  const game = useGame();
  const state = game?.state;
  const { lockRedirection, loading, setRun, run } = useStore();
  const { isSmallScreen } = useResponsiveValues();

  const lastTabIndex =
    Number(sessionStorage.getItem(STORE_LAST_TAB_INDEX)) ?? 0;

  useEffect(() => {
    setIsRageRound(false);
  }, []);

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === GameStateEnum.GameOver) {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === GameStateEnum.Round || game?.state === GameStateEnum.Rage) {
        navigate("/demo");
      } else if (game?.state === GameStateEnum.Lootbox) {
        navigate("/open-loot-box");
      }
    }
  }, [game?.state, lockRedirection]);

  const navigate = useNavigate();

  useEffect(() => {
    if (state ===GameStateEnum.GameOver) {
      navigate(`/gameover/${gameId}`);
    } else if (state === GameStateEnum.Round || state === GameStateEnum.Rage) {
      navigate("/demo");
    }
  }, [state]);

  useEffect(() => {
    if (!game) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_STORE);
    setTimeout(() => {
      if (showTutorial) setRun(true);
    }, 1000);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === "tour:end") {
      window.localStorage.setItem(SKIP_TUTORIAL_STORE, "true");
      setRun(false);
    }
  };

  return (
    <>
      <RemoveScroll>
        <></>
      </RemoveScroll>

      <DelayedLoading loading={loading}>
        <Joyride
          steps={STORE_TUTORIAL_STEPS}
          run={run}
          continuous
          showSkipButton
          styles={TUTORIAL_STYLE}
          showProgress
          callback={handleJoyrideCallback}
          locale={JOYRIDE_LOCALES}
        />
        {isSmallScreen ? (
          <StoreContentMobile lastIndexTab={lastTabIndex} />
        ) : (
          <StoreContent />
        )}
      </DelayedLoading>
    </>
  );
};
