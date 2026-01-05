import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../../dojoConfig.ts";
import App from "./App.tsx";

import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import i18n from "i18next";
import { createRef } from "react";
import { I18nextProvider } from "react-i18next";
import { FadeInOut } from "../components/animations/FadeInOut.tsx";
import { PositionedVersion } from "../components/version/PositionedVersion.tsx";
import { SKIP_PRESENTATION } from "../constants/localStorage.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx";
import { setup } from "../dojo/setup.ts";
import { WalletProvider } from "../dojo/WalletContext.tsx";
import { FeatureFlagProvider } from "../featureManagement/FeatureFlagProvider.tsx";
import localI18n from "../i18n.ts";
import "../index.css";
import { initDatadogRum } from "../monitoring/datadogRum.ts";
import { DatadogUserContext } from "../monitoring/DatadogUserContext.tsx";
import { LoadingScreen } from "../pages/LoadingScreen/LoadingScreen.tsx";
import {
  AppContextProvider,
  AppType,
} from "../providers/AppContextProvider.tsx";
import { SettingsProvider } from "../providers/SettingsProvider.tsx";
import { StarknetProvider } from "../providers/StarknetProvider.tsx";
import customTheme from "../theme/theme";
import { LoadingScreenHandle } from "../types/LoadingProgress.ts";
import { preloadImages, preloadVideos } from "../utils/cacheUtils.ts";
import { isNative } from "../utils/capacitorUtils.ts";
import { registerAppUrlOpenListener } from "../utils/registerAppUrlOpenListener.ts";
import { registerServiceWorker } from "../utils/registerServiceWorker.ts";

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

const progressBarRef = createRef<LoadingScreenHandle>();

initDatadogRum();
registerAppUrlOpenListener();

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

  const renderApp = (setupResult: any) => {
    const queryClient = new QueryClient();
    root.render(
      <FadeInOut isVisible fadeInDelay={shouldSkipPresentation ? 0.5 : 1.5}>
        <AppContextProvider appType={AppType.SHOP}>
          <StarknetProvider>
            <I18nextProvider i18n={localI18n} defaultNS={undefined}>
              <QueryClientProvider client={queryClient}>
                <ChakraBaseProvider theme={theme}>
                  <FeatureFlagProvider>
                    <WalletProvider value={setupResult}>
                      <DojoProvider value={setupResult}>
                        <BrowserRouter>
                          <DatadogUserContext />
                          <Toaster />
                          <SettingsProvider
                            introSongPath={"/music/intro-track.mp3"}
                            baseSongPath={"/music/game-track.mp3"}
                            rageSongPath={"/music/rage_soundtrack.mp3"}
                          >
                            <App />
                          </SettingsProvider>
                        </BrowserRouter>
                      </DojoProvider>
                    </WalletProvider>
                  </FeatureFlagProvider>
                </ChakraBaseProvider>
              </QueryClientProvider>
            </I18nextProvider>
          </StarknetProvider>
        </AppContextProvider>
      </FadeInOut>
    );
  };

  const presentationPromise = new Promise<void>((resolve) => {
    const updateLoadingScreen = (canFadeOut: boolean) => {
      root.render(
        <ChakraBaseProvider theme={theme}>
          <I18nextProvider i18n={localI18n} defaultNS={undefined}>
            <LoadingScreen
              initial
              ref={progressBarRef}
              showPresentation={false}
              onPresentationEnd={() => {
                progressBarRef.current?.nextStep();
                resolve();
              }}
              canFadeOut={canFadeOut}
            />
            <PositionedVersion />
          </I18nextProvider>
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
    : Promise.all([preloadImages(), preloadVideos()]).then(() => {
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
