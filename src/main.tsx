import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import localI18n from "./i18n.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen/LoadingScreen.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { preloadImages, preloadVideos } from "./utils/cacheUtils.ts";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";
import { SKIP_PRESENTATION } from "./constants/localStorage.ts";

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
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const hasSeenPresentation =
    sessionStorage.getItem(SKIP_PRESENTATION) === "true";
  const isNavigatingFromHome = window.location.pathname === "/";
  const shouldSkipPresentation = hasSeenPresentation || !isNavigatingFromHome;
  let presentationEnded = shouldSkipPresentation;

  const renderApp = (setupResult: any) => {
    const queryClient = new QueryClient();
    root.render(
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
    );
  };

  const i18nPromise = i18n.loadNamespaces(I18N_NAMESPACES);
  const imagesPromise = Promise.all([
    preloadImages(),
    preloadSpineAnimations(),
    preloadVideos(),
  ]);

  root.render(
    <LoadingScreen
      showPresentation={!shouldSkipPresentation}
      onPresentationEnd={() => {
        presentationEnded = true;
        sessionStorage.setItem(SKIP_PRESENTATION, "true");
      }}
    />
  );

  registerServiceWorker();
  await Promise.all([i18nPromise, imagesPromise]);

  try {
    const setupResult = await setup(dojoConfig);

    if (!presentationEnded) {
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (presentationEnded) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    renderApp(setupResult);
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
