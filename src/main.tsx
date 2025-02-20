import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { SKIP_PRESENTATION } from "./constants/localStorage.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import localI18n from "./i18n.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen/LoadingScreen.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { preloadImages, preloadVideos } from "./utils/cacheUtils.ts";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";
import { FadeInOut } from "./components/animations/FadeInOut.tsx";

const I18N_NAMESPACES = [
  "game",
  "rage",
  "home",
  "traditional-cards",
  "neon-cards",
  "store",
  "effects",
  "tutorials",
  "intermediate-screens",
  "plays",
  "loot-boxes",
];

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement);

  const hasSeenPresentation =
    window.localStorage.getItem(SKIP_PRESENTATION) === "true";
  const isNavigatingFromHome = window.location.pathname === "/";
  const shouldSkipPresentation = hasSeenPresentation && !isNavigatingFromHome;

  let setCanFadeOut: (value: boolean) => void = () => {};

  const renderApp = (setupResult: any) => {
    const queryClient = new QueryClient();
    root.render(
      <FadeInOut isVisible fadeInDelay={1.5}>
        <StarknetProvider>
          <DojoProvider value={setupResult}>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <Toaster />
                <I18nextProvider i18n={localI18n} defaultNS={undefined}>
                  <App />
                </I18nextProvider>
              </QueryClientProvider>
            </BrowserRouter>
          </DojoProvider>
        </StarknetProvider>
      </FadeInOut>
    );
  };

  const presentationPromise = shouldSkipPresentation
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const updateLoadingScreen = (canFadeOut: boolean) => {
          root.render(
            <LoadingScreen
              showPresentation={true}
              onPresentationEnd={() => {
                window.localStorage.setItem(SKIP_PRESENTATION, "true");
                resolve();
              }}
              canFadeOut={canFadeOut}
            />
          );
        };

        setCanFadeOut = (value: boolean) => {
          updateLoadingScreen(value);
        };

        updateLoadingScreen(false);
      });

  registerServiceWorker();

  const i18nPromise = i18n.loadNamespaces(I18N_NAMESPACES);
  const imagesPromise = Promise.all([
    preloadImages(),
    preloadSpineAnimations(),
    preloadVideos(),
  ]);

  try {
    const setupPromise = setup(dojoConfig);

    const [setupResult] = await Promise.all([
      setupPromise,
      i18nPromise,
      imagesPromise,
      presentationPromise,
    ]);

    setCanFadeOut(true);

    setTimeout(() => {
      renderApp(setupResult);
    }, 1000);
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
