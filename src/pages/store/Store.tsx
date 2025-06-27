import { useEffect } from "react";
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
import { useGameStore } from "../../state/useGameStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const Store = () => {
  const { state, resetRage, id: gameId } = useGameStore();
  const { lockRedirection, loading, setRun, run } = useStore();
  const { isSmallScreen } = useResponsiveValues();

  const lastTabIndex =
    Number(sessionStorage.getItem(STORE_LAST_TAB_INDEX)) ?? 0;

  useEffect(() => {
    resetRage();
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
