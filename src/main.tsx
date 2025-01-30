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
import { LoadingScreen } from "./pages/LoadingScreen.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { preloadImages } from "./utils/preloadImages.ts";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  let setupResult: any;
  let setupFinished = false;
  let i18nLoaded = false;

  root.render(<LoadingScreen />);

  const onI18nLoaded = () => {
    i18nLoaded = true;
    renderApp();
  };

  const loadImages = async () => {
    await i18n.loadNamespaces(
      ["home", "traditional-cards", "neon-cards"],
      onI18nLoaded
    );
    preloadImages();
    preloadSpineAnimations();
  };

  i18n.on("initialized", loadImages);

  registerServiceWorker();

  const renderApp = () => {
    if (setupFinished && i18nLoaded) {
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
    }
  };

  try {
    setupResult = await setup(dojoConfig);
    setupFinished = true;
    renderApp();
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
