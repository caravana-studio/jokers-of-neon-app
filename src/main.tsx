import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";

import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import i18n from "i18next";
import { createRef } from "react";
import { isMobileOnly } from "react-device-detect";
import { I18nextProvider } from "react-i18next";
import { FadeInOut } from "./components/animations/FadeInOut.tsx";
import { SKIP_PRESENTATION } from "./constants/localStorage.ts";
import { APP_VERSION } from "./constants/version";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import { WalletProvider } from "./dojo/WalletContext.tsx";
import { FeatureFlagProvider } from "./featureManagement/FeatureFlagProvider.tsx";
import localI18n from "./i18n.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen/LoadingScreen.tsx";
import { MobileBrowserBlocker } from "./pages/MobileBrowserBlocker.tsx";
import { VersionMismatch } from "./pages/VersionMismatch.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { fetchVersion } from "./queries/fetchVersion.ts";
import customTheme from "./theme/theme";
import {
  LoadingProgress,
  LoadingScreenHandle,
} from "./types/LoadingProgress.ts";
import { preloadImages, preloadVideos } from "./utils/cacheUtils.ts";
import { isNative } from "./utils/capacitorUtils.ts";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";
import { getMajor, getMinor } from "./utils/versionUtils.ts";

const I18N_NAMESPACES = [
  "game",
  "home",
  "store",
  "cards",
  "tutorials",
  "intermediate-screens",
  "plays",
  "achievements",
  "map",
  "docs",
];

const loadingSteps: LoadingProgress[] = [
  { text: "Setting the stage", showAt: 0 },
  { text: "Turning on the neon lights", showAt: 1 },
  { text: "Gathering all the jokers", showAt: 2 },
  { text: "Loading the leaderboard", showAt: 3 },
  { text: "Almost ready, let's play!", showAt: 4 },
];

const progressBarRef = createRef<LoadingScreenHandle>();

const BYPASS_MOBILE_BROWSER_RULE = import.meta.env.BYPASS_MOBILE_BROWSER_RULE;

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement);

  const hasSeenPresentation =
    window.localStorage.getItem(SKIP_PRESENTATION) === "true";
  const isNavigatingFromHome = window.location.pathname === "/";
  const shouldSkipPresentation = hasSeenPresentation && !isNavigatingFromHome;

  let setCanFadeOut: (value: boolean) => void = () => {};

  const theme = extendTheme(customTheme);

  // Block mobile browsers
  if (
    isMobileOnly &&
    !isNative &&
    // window.location.hostname !== "localhost" &&
    !BYPASS_MOBILE_BROWSER_RULE
  ) {
    return root.render(<MobileBrowserBlocker />);
  }

  fetchVersion().then((version) => {
    // If the major or minor version is different, block the app
    if (
      isNative &&
      (Number(getMajor(version)) > Number(getMajor(APP_VERSION)) ||
        Number(getMinor(version)) > Number(getMinor(APP_VERSION)))
    ) {
      console.log("Version mismatch", version, APP_VERSION);
      root.render(<VersionMismatch />);
    }
  });

  const renderApp = (setupResult: any) => {
    const queryClient = new QueryClient();
    root.render(
      <FadeInOut isVisible fadeInDelay={shouldSkipPresentation ? 0.5 : 1.5}>
        <StarknetProvider>
          <QueryClientProvider client={queryClient}>
            <FeatureFlagProvider>
              <WalletProvider value={setupResult}>
                <DojoProvider value={setupResult}>
                  <BrowserRouter>
                    <Toaster />
                    <I18nextProvider i18n={localI18n} defaultNS={undefined}>
                      <App />
                    </I18nextProvider>
                  </BrowserRouter>
                </DojoProvider>
              </WalletProvider>
            </FeatureFlagProvider>
          </QueryClientProvider>
        </StarknetProvider>
      </FadeInOut>
    );
  };

  const presentationPromise = new Promise<void>((resolve) => {
    const updateLoadingScreen = (canFadeOut: boolean) => {
      root.render(
        <ChakraBaseProvider theme={theme}>
          <LoadingScreen
            steps={loadingSteps}
            ref={progressBarRef}
            showPresentation={!shouldSkipPresentation}
            onPresentationEnd={() => {
              window.localStorage.setItem(SKIP_PRESENTATION, "true");
              progressBarRef.current?.nextStep();
              resolve();
            }}
            canFadeOut={canFadeOut}
          />
        </ChakraBaseProvider>
      );
    };

    setCanFadeOut = (value: boolean) => {
      updateLoadingScreen(value);
    };

    updateLoadingScreen(false);
  });

  registerServiceWorker();

  const i18nPromise = i18n.loadNamespaces(I18N_NAMESPACES).then(() => {
    progressBarRef.current?.nextStep();
  });

  const imagesPromise = isNative
    ? Promise.resolve().then(() => {
        progressBarRef.current?.nextStep();
      })
    : Promise.all([
        preloadImages(),
        preloadSpineAnimations(),
        preloadVideos(),
      ]).then(() => {
        progressBarRef.current?.nextStep();
      });

  try {
    const setupPromise = setup(dojoConfig).then((result) => {
      progressBarRef.current?.nextStep();
      return result;
    });

    const [setupResult] = await Promise.all([
      setupPromise,
      i18nPromise,
      imagesPromise,
      presentationPromise,
    ]);

    setCanFadeOut(true);

    setTimeout(
      () => {
        renderApp(setupResult);
      },
      shouldSkipPresentation ? 0 : 1000
    );
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
