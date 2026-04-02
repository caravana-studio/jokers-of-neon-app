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
import { PositionedVersion } from "./components/version/PositionedVersion.tsx";
import { SKIP_PRESENTATION } from "./constants/localStorage.ts";
import { APP_VERSION } from "./constants/version";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import { WalletProvider } from "./dojo/WalletContext.tsx";
import localI18n from "./i18n.ts";
import "./index.css";
import { initDatadogRum } from "./monitoring/datadogRum.ts";
import { DatadogUserContext } from "./monitoring/DatadogUserContext.tsx";
import { LoadingScreen } from "./pages/LoadingScreen/LoadingScreen.tsx";
import { Maintenance } from "./pages/Maintenance.tsx";
import { MobileBrowserBlocker } from "./pages/MobileBrowserBlocker.tsx";
import { OfflineBlocker } from "./pages/OfflineBlocker.tsx";
import { VersionMismatch } from "./pages/VersionMismatch.tsx";
import {
  AppContextProvider,
  AppType,
} from "./providers/AppContextProvider.tsx";
import { SettingsProvider } from "./providers/SettingsProvider.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { CavosWrapper } from "./dojo/cavos/CavosConfig.tsx";
import { fetchVersion, VERSION_URL } from "./queries/fetchVersion.ts";
import customTheme from "./theme/theme";
import { LoadingScreenHandle } from "./types/LoadingProgress.ts";
import AudioManager from "./audio/AudioManager.ts";
import { preloadImages, preloadVideos } from "./utils/cacheUtils.ts";
import { isNative } from "./utils/capacitorUtils.ts";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { registerAppUrlOpenListener } from "./utils/registerAppUrlOpenListener.ts";
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

const progressBarRef = createRef<LoadingScreenHandle>();

const parseBooleanEnv = (value: unknown): boolean =>
  typeof value === "string" ? value.toLowerCase() === "true" : false;

const BYPASS_MOBILE_BROWSER_RULE = parseBooleanEnv(
  import.meta.env.VITE_BYPASS_MOBILE_BROWSER_RULE
);

const BYPASS_MAINTENANCE = parseBooleanEnv(import.meta.env.VITE_BYPASS_MAINTENANCE);
const MAINTENANCE_BYPASS_QUERY_PARAM = "bypassMaintenance";

const shouldBypassMaintenanceFromUrl = (): boolean => {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has(
    MAINTENANCE_BYPASS_QUERY_PARAM
  );
};

initDatadogRum();
registerAppUrlOpenListener();

const CONNECTION_CHECK_TIMEOUT_MS = 6000;

const hasInternetConnection = async () => {
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    CONNECTION_CHECK_TIMEOUT_MS
  );

  try {
    await fetch(VERSION_URL, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch (error) {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement);

  const hasSeenPresentation =
    window.localStorage.getItem(SKIP_PRESENTATION) === "true";
  const isNavigatingFromHome = window.location.pathname === "/";
  const shouldSkipPresentation = hasSeenPresentation && !isNavigatingFromHome;

  let setCanFadeOut: (value: boolean) => void = () => {};
  let isStartingApp = false;

  const theme = extendTheme(customTheme);

  const renderApp = (setupResult: any) => {
    const queryClient = new QueryClient();
    root.render(
      <FadeInOut isVisible fadeInDelay={shouldSkipPresentation ? 0.5 : 1.5}>
        <AppContextProvider appType={AppType.FULL_GAME}>
          <StarknetProvider>
            <CavosWrapper>
              <I18nextProvider i18n={localI18n} defaultNS={undefined}>
                <QueryClientProvider client={queryClient}>
                  <ChakraBaseProvider theme={theme}>
                    <WalletProvider value={setupResult}>
                      <DojoProvider value={setupResult}>
                        <BrowserRouter>
                          <DatadogUserContext />
                          <Toaster />
                          <SettingsProvider
                            introSongPath={"music/intro-track.mp3"}
                            baseSongPath={"music/game-track.mp3"}
                            rageSongPath={"music/rage_soundtrack.mp3"}
                          >
                            <App />
                          </SettingsProvider>
                        </BrowserRouter>
                      </DojoProvider>
                    </WalletProvider>
                  </ChakraBaseProvider>
                </QueryClientProvider>
              </I18nextProvider>
            </CavosWrapper>
          </StarknetProvider>
        </AppContextProvider>
      </FadeInOut>
    );
  };

  const startApp = async () => {
    if (isStartingApp) return;
    isStartingApp = true;

    fetchVersion().then((data) => {
      const version = data.version;
      // If the maintenance flag is set, block the app
      if (
        data.maintenance &&
        !BYPASS_MAINTENANCE &&
        !shouldBypassMaintenanceFromUrl()
      ) {
        return root.render(
          <I18nextProvider i18n={localI18n} defaultNS={undefined}>
            <Maintenance />
          </I18nextProvider>
        );
      }
      // If the major or minor version is different, block the app
      if (
        isNative &&
        (Number(getMajor(version)) > Number(getMajor(APP_VERSION)) ||
          (Number(getMajor(version)) === Number(getMajor(APP_VERSION)) &&
            Number(getMinor(version)) > Number(getMinor(APP_VERSION))))
      ) {
        console.log("Version mismatch", version, APP_VERSION);
        return root.render(
          <I18nextProvider i18n={localI18n} defaultNS={undefined}>
            <VersionMismatch />
          </I18nextProvider>
        );
      }
    });

    const presentationPromise = new Promise<void>((resolve) => {
      const updateLoadingScreen = (canFadeOut: boolean) => {
        root.render(
          <ChakraBaseProvider theme={theme}>
            <I18nextProvider i18n={localI18n} defaultNS={undefined}>
              <LoadingScreen
                initial
                ref={progressBarRef}
                showPresentation={!shouldSkipPresentation}
                onPresentationEnd={() => {
                  window.localStorage.setItem(SKIP_PRESENTATION, "true");
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
      : Promise.all([
          preloadImages(),
          preloadSpineAnimations(),
          preloadVideos(),
        ]).then(() => {
          progressBarRef.current?.nextStep();
        });

    // Initialize AudioManager (preload all SFX once)
    const audioPromise = AudioManager.getInstance()
      .initialize()
      .catch(() => {
        // Audio init failure is non-fatal
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
        audioPromise,
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
  };

  function renderOfflineBlocker() {
    root.render(
      <I18nextProvider i18n={localI18n} defaultNS={undefined}>
        <OfflineBlocker onRetry={checkConnectivityAndStart} />
      </I18nextProvider>
    );
  }

  async function checkConnectivityAndStart() {
    if (isStartingApp) return;

    // Block mobile browsers
    if (
      isMobileOnly &&
      !isNative &&
      window.location.hostname !== "localhost" &&
      !BYPASS_MOBILE_BROWSER_RULE
    ) {
      return root.render(
        <I18nextProvider i18n={localI18n} defaultNS={undefined}>
          <MobileBrowserBlocker />
        </I18nextProvider>
      );
    }

    const hasConnection = await hasInternetConnection();
    if (!hasConnection) {
      return renderOfflineBlocker();
    }

    await startApp();
  }

  await checkConnectivityAndStart();
}

init();
