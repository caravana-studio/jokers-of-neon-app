import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { SKIP_TUTORIAL_STORE } from "../../constants/localStorage.ts";

import { RemoveScroll } from "react-remove-scroll";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const Store = () => {
  const { gameId, setIsRageRound } = useGameContext();
  const game = useGame();
  const state = game?.state;
  const { lockRedirection, loading, setRun, run } = useStore();
  const { isSmallScreen } = useResponsiveValues();

  const location = useLocation();
  const lastTabIndex = location.state?.lastTabIndex ?? 0;

  useEffect(() => {
    setIsRageRound(false);
  }, []);

  useEffect(() => {
    if (!lockRedirection) {
      if (game?.state === "FINISHED") {
        navigate(`/gameover/${gameId}`);
      } else if (game?.state === "IN_GAME") {
        navigate("/demo");
      } else if (game?.state === "OPEN_BLISTER_PACK") {
        navigate("/open-loot-box");
      }
    }
  }, [game?.state, lockRedirection]);

  const navigate = useNavigate();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate(`/gameover/${gameId}`);
    } else if (state === "IN_GAME") {
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
    if (showTutorial) setRun(true);
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

      <DelayedLoading loading={loading}>
        {isSmallScreen ? (
          <StoreContentMobile lastIndexTab={lastTabIndex} />
        ) : (
          <StoreContent />
        )}
      </DelayedLoading>
    </>
  );
};
